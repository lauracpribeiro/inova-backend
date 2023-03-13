const Team = require("../models/Team");
const Challenge = require("../models/Challenge");
const Leader = require("../models/Leader");
const Trail = require("../models/Trail");
const admin = require("firebase-admin");

module.exports = {
  async view(req, res) {
    const { id } = req.params;
    const team = await Team.findById(id);

    return res.json(team);
  },

  async list(req, res) {
    const teams = await Team.find();
    return res.json({ teams });
  },

  async create(req, res) {
    const { name, avatar, challengeId, leaderId, users, trailId } = req.body;

    if (!name) {
      return res.status(400).send({ error: "Informe o nome para continuar." });
    }

    if (!avatar) {
      return res.status(400).send({ error: "Informe o avatar para continuar." });
    }

    const nameExists = await Team.findOne({ name, trailId });

    if (nameExists) {
      return res.status(400).send({ error: "Esse nome já está sendo usado" });
    }

    const teamUsers = await Team.findOne({ users: { $in: users }, trailId });

    if (teamUsers) {
      return res.status(400).send({ error: "Um dos usuários já está em um time." });
    }

    const leader = await Leader.findById(leaderId);

    if (!leader) {
      return res
        .status(400)
        .send({ error: "Não encontramos o responsável por esse desafio." });
    }

    const trail = await Trail.findById(trailId);

    if (!trail) {
      return res
        .status(400)
        .send({ error: "Essa trilha não existe." });
    }

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(400).send({ error: "Esse desafio não existe." });
    }

    const team = await Team.create({
      name,
      avatar,
      challengeId,
      trailId,
      leaderId,
      users,
      username: "123"
    });

    leader.teams.push(team);
    await leader.save(); 

    return res.json({ message: "Time criado!" });
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await Team.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    const team = await Team.findById(id);

    const leader = await Leader.findById(team.leaderId);

    leader.teams.pull({ _id: id });
    await leader.save();

    await Team.findByIdAndDelete({ _id: id });

    return res.json({ message: "Deletado" });
  },

  async deleteTrail(req, res) {
    const { trailId } = req.params;
    const team = await Team.findOne({ trailId });

    const leader = await Leader.findById(team.leaderId);

    leader.teams.pull({ _id: team._id });
    await leader.save();

    await Team.findByIdAndDelete({ _id: team._id });

    return res.json({ message: "Deletado" });
  },
};
