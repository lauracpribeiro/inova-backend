const mongoose = require('mongoose');
const Team = require("../models/Team");
const Challenge = require("../models/Challenge");
const Category = require("../models/Category");
const Point = require("../models/Point");
const Leader = require("../models/Leader");
const Trail = require("../models/Trail");
const Response = require("../models/Response");
const admin = require("firebase-admin");

module.exports = {
  async team(req, res) {
    const { authId } = req;
    const { trailId } = req.params;

    const team = await Team.findOne({ users: authId, trailId });

    if (!team) {
      return res.status(400).send({ error: "Time não existe." });
    }

    const result = JSON.parse(JSON.stringify(team));

    const users = [];

    team.users.forEach(uid => users.push({ uid }))

    await admin
      .auth()
      .getUsers(users)
      .then((usersResult) => {
        const usersList = usersResult.users.map(user => ({
          uid: user.uid,
          email: user.email
        }))

        result.users = usersList
      })
      .catch((error) => {
        console.log('error: ', error);
        return res.status(400).send({ error: "Erro ao buscar dados." })
      });

    const points = await Point.find({ teamId: team._id });

    if (points && points.length > 0) {
      let total = 0;
      points.forEach(item => total += item.value)
      result.points = total;
    } else {
      result.points = 0;
    }


    const responses = await Response.find({ teamId: team._id });

    result.progress = (responses.length * 100) / 4;

    const challenge = await Challenge.findById(team.challengeId);

    const category = await Category.findById(challenge.categoryId);

    result.challenge = challenge;
    result.category = category;

    return res.json(result);
  },

  async user(req, res) {
    const { email } = req.params;

    await admin
      .auth()
      .getUserByEmail(email)
      .then((user) => {
        return res.json(user);
      })
      .catch((error) => {
        console.log('error: ', error);
        return res.status(400).send({ error: "Erro ao buscar dados." })
      });
  },

  async trail(req, res) {
    const { code } = req.params;

    const trail = await Trail.findOne({ code }).populate('challenges');

    const leader = await Leader.findById(trail.leaderId);

    const user = await admin
      .auth()
      .getUser(leader.uid)

    const newTrail = {...trail.toObject()};

    newTrail.leader = user.displayName;

    return res.json(newTrail);
  },

  async trails(req, res) {
    const { authId } = req;

    const trailsTeam = await Trail.aggregate([
      {
        $lookup: {
          from: Team.collection.name,
          localField: "_id",
          foreignField: "trailId",
          as: "team"
        }
      },
      {
        $unwind: "$team"
      },
      {
        $lookup: {
          from: Leader.collection.name,
          localField: "leaderId",
          foreignField: "_id",
          as: "leader"
        }
      },
      {
        $unwind: "$leader"
      },
      {
        $match: {
          $or:[
            {'team.users': authId},
          ]
        }
      },
      {
        $project: {
          '_id': 1,
          'challenges': 1,
          'title': 1,
          'code': 1,
          'schedule': 1,
          'leaderId': 1,
          'isActive': 1,
          'team.name': 1,
          'team._id': 1,
          'team.leaderId': 1,
          'team.users': 1
        }
      }
    ])  


    
    const leader = await Leader.findOne({ uid: authId });

    if (!leader) {
      return res.json(trailsTeam);
    }

    trailsLeader = await Trail.find({ leaderId: leader._id }).lean();

    

    if (trailsTeam.length <= 0) {
      return res.json(trailsLeader)
    }

    const trails = [...trailsTeam]

    for (const item of trailsLeader) {
      let obj = trailsTeam.find(o => o._id.toString() === item._id.toString());
      if (!obj) {
        trails.push(item)
      }
    }

    return res.json(trails);

  },

  async responses(req, res) {
    const { authId } = req;
    const { trailId } = req.params;

    const team = await Team.findOne({ users: authId, trailId });
    const responses = await Response.find({ teamId: team._id });

    const result = {
      1: false,
      2: false,
      3: false,
      4: false
    };

    // no índice que tiver resposta seta como true e envia apenas se é true ou false, sem a resposta em si
    responses.forEach(response => {
      result[response.stage] = true
    })
    

    return res.json(result);

  },

  async responsesTeam(req, res) {
    const { authId } = req;

    const team = await Team.findOne({ users: authId });
    const responses = await Response.find({ teamId: team._id }).lean();

   
    for (const response of responses) {
      const points = await Point.findOne({ responseId: response._id })
      response["points"] = points;
    }

    return res.json(responses);

  },

  async responsesLeader(req, res) {
    const { trailId } = req.params;

    const responses = await Response.find({ trailId });

    return res.json(responses);

  },

  async response(req, res) {
    const { authId } = req;
    const { trailId, stage } = req.query;

    const team = await Team.findOne({ users: authId, trailId });

    if (!team) {
      return res.status(400).send({ error: "Time não existe." });
    }
    

    const response = await Response.findOne({
      teamId: team._id,
      trailId,
      stage
    })

    return res.json(response);
  },

  async ranking(req, res) {
    const { trailId } = req.params;

    const trailExists = await Trail.findById(trailId)

    if (!trailExists) {
      return res.status(400).send({ error: "Atividade não existe." });
    }

    const trail = mongoose.Types.ObjectId(trailId);

    const teams = await Team.aggregate([
      {
        $match: {
          'trailId': trail
        }
      },
      {
        $lookup: {
          from: Point.collection.name,
          localField: "_id",
          foreignField: "teamId",
          as: "pointsTeam"
        }
      },
      {
        "$addFields": {
          "points": {
            "$reduce": {
              "input": "$pointsTeam",
              "initialValue": 0,
              "in": { "$add" : ["$$value", "$$this.value"] }
            }
          }
        }
      },
      {
        $sort: { "points": -1 }
      },
      {
        $project: {
          "points": 1,
          "_id": 1,
          "name": 1,
          "avatar": 1
        }
      }
      
    ])

    return res.json(teams);
  },
};
