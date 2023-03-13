const Point = require("../models/Point");
const Team = require("../models/Team");
const Leader = require("../models/Leader");
const Trail = require("../models/Trail");
const Response = require("../models/Response");
const normalize = require("../utils/normalize");

module.exports = {
  async view(req, res) {
    const { id } = req.params;
    const point = await Point.findById(id);

    return res.json(point);
  },

  async list(req, res) {
    const points = await Point.find();
    return res.json(points);
  },

  async create(req, res) {
    const { value, feedback, responseId, leaderId, trailId, teamId } = req.body;

    if (value < 0 || value > 100) {
      return res.status(400).send({ error: "Valor incorreto" });
    }

    const response = await Response.findById(responseId);

    if (!response) {
      return res.status(400).send({ error: "Time não existe" });
    }

    const leader = await Leader.findById(leaderId);

    if (!leader) {
      return res.status(400).send({ error: "Líder não existe" });
    }

    const trail = await Trail.findById(trailId);

    if (!trail) {
      return res.status(400).send({ error: "Atividade não existe" });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(400).send({ error: "Time não existe" });
    }

    await Point.create({
      value,
      feedback,
      responseId,
      trailId,
      leaderId,
      teamId,
    });

    return res.json({ message: "Pontos salvos!" });
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await Point.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    await Point.findByIdAndDelete({ _id: id });

    return res.json({ message: "Deletado" });
  },
};
