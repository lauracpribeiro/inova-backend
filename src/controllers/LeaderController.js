const Leader = require("../models/Leader");
const admin = require("firebase-admin");

module.exports = {
  async view(req, res) {
    const { authId } = req;
    const leader = await Leader.findOne({ uid: authId })

    return res.json(leader);
  },

  async list(req, res) {
    const leaders = await Leader.find();
    return res.json(leaders)
  },

  async create(req, res) {
    const { uid } = req.body;

    const userExists = await admin
      .auth()
      .getUser(uid)
      .then(user => user);

    if (!userExists) {
      return res.status(400).send({ error: "Usuário não existe." });
    }

    await Leader.create({
      uid
    });
    return res.json({ message: "Líder criado!" });

  },

  async update(req, res) {
    const { id } = req.params;
    const result = await Leader.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    await Leader.findByIdAndDelete({ _id: id });

    return res.json({ message: "Deletado" });
  },
};
