const Category = require("../models/Category");
const Trail = require("../models/Trail");
const Leader = require("../models/Leader");
const admin = require("firebase-admin");
const crypto = require("crypto");
const Team = require("../models/Team");

module.exports = {
  async view(req, res) {
    const { id } = req.params;
    const trail = await Trail.findById(id).populate("challenges");

    const leader = await Leader.findById(trail.leaderId);

    const user = await admin.auth().getUser(leader.uid);

    const newTrail = { ...trail.toObject() };

    newTrail.leader = user.displayName;

    return res.json(newTrail);
  },

  async list(req, res) {
    const trails = await Trail.find();
    return res.json(trails);
  },

  async create(req, res) {
    const {
      title,
      schedule,
      type,
      note,
      leaderId,
      challenges,
      isActive = true,
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .send({ error: "Informe o título para continuar." });
    }

    const leader = await Leader.findById(leaderId);

    if (!leader) {
      return res.status(400).send({ error: "Líder não existe." });
    }

    const code = crypto.randomBytes(8).toString("hex");

    const trail = await Trail.create({
      title,
      schedule,
      type,
      note,
      code,
      leaderId,
      challenges,
      isActive,
    });

    leader.trails.push(trail);
    await leader.save();

    return res.json({ message: "Atividade criada!" });
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await Trail.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;

    const trail = await Trail.findById(id);

    const leader = await Leader.findById(trail.leaderId);

    leader.trails.pull({ _id: id });
    await leader.save();

    await Trail.findByIdAndDelete({ _id: id });

    await Team.deleteMany({ trailId: trail._id });

    return res.json({ message: "Deletado" });
  },
};
