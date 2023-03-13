const mongoose = require('mongoose');
const Team = require("../models/Team");
const Point = require("../models/Point");
const Leader = require("../models/Leader");
const Trail = require("../models/Trail");
const Response = require("../models/Response");
const admin = require("firebase-admin");
const { response } = require('express');

module.exports = {
  async teams(req, res) {
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
          from: Response.collection.name,
          localField: "_id",
          foreignField: "teamId",
          as: "responses"
        }
      },
      {
        $unwind: "$responses"
      },
      {
        $lookup: {
          from: Point.collection.name,
          localField: "responses._id",
          foreignField: "responseId",
          as: "responses.points"
        },
      },
      {
        $unwind: "$responses.points"
      },
      {
        $group: {
          _id : "$_id",
          name: { $first: "$name" },
          users: { $first: "$users" },
          avatar: { $first: "$avatar" },
          challengeId: { $first: "$challengeId" },
          trailId: { $first: "$trailId" },
          leaderId: { $first: "$leaderId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          responses: { $push: "$responses" },
          totalPoints: { $sum: "$responses.points.value" },
        }
      }
    ])

    let startTeams = 0;
    const lenTeams = teams.length;
    const users = [];

    while(startTeams < lenTeams) {
      let startUsers = 0;
      const lenUsers = teams[startTeams].users.length;

      let totalPoints = 0;
      
      while(startUsers < lenUsers) {
        const user = {
          uid: teams[startTeams].users[startUsers]
        }
        users.push(user);
        startUsers = startUsers + 1;
      }
      startTeams = startTeams + 1;
    }

    const responseUsers = await admin.auth().getUsers(users);

    let indexTeams = 0;
    const participants = [];
    
    while(indexTeams < lenTeams) {
      let indexUsers = 0;
      const lenUsers = teams[indexTeams].users.length;

      while (indexUsers < lenUsers) {
        const pos = responseUsers.users.map(e => e.uid).indexOf(teams[indexTeams].users[indexUsers]);
        if (responseUsers.users[pos].uid === teams[indexTeams].users[indexUsers]) {
          teams[indexTeams].users[indexUsers] = {
            email: responseUsers.users[pos].email,
            displayName: responseUsers.users[pos].displayName,
            points: (teams[indexTeams].totalPoints * trailExists.note) / 100
          };
          participants.push(teams[indexTeams].users[indexUsers]);
        }

        indexUsers = indexUsers + 1;
      }

      indexTeams = indexTeams + 1;
    }

    const result = { teams, participants };

    return res.json(result);
  },

  async users(req, res) {
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
          "users": 1
        }
      }
      
    ])

    for (const team of teams) {
      const users = [];

      team.users.forEach(uid => users.push({ uid }))

      await admin
        .auth()
        .getUsers(users)
        .then((usersResult) => {
          const usersList = usersResult.users.map(user => (
            {
              displayName: user.displayName,
              email: user.email,
            }
          ))

          team["users"] = usersList;
        })
        .catch((error) => {
          console.log('error: ', error);
          return res.status(400).send({ error: "Erro ao buscar dados." })
        });

    }

    const response = [];

    for (const item of teams) {
      for (const user of item.users) {
        const obj = {
          displayName: user.displayName,
          email: user.email,
          points: (item.points * trailExists.note) / 100
        }
        response.push(obj)
      }
    }

    const responseSort = response.sort((a, b) => a.displayName > b.displayName ? 1 : ((b.displayName > a.displayName) ? -1 : 0));
    return res.json(responseSort);
  },

  
};
