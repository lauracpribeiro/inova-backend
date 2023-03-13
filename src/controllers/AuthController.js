const Leader = require("../models/Leader");
const googleKey = require("../utils/googleKey");

module.exports = {
  async check(req, res) {
    const { authId } = req;

    const leader = await Leader.findOne({ uid: authId });

    if (leader) {
      return res.json({ leader: leader._id, message: "success" })
    }

    return res.json({ message: "success" });
  },

  async registerEmail(req, res) {
    const { email } = req.body;

    const exists = await AllowedEmail.findOne({ email });

    if (exists) {
      return res.status(400).send({
        error: "Email já cadastrado",
      });
    }

    const result = await AllowedEmail.create({ email });

    res.json(result);
  },
};
