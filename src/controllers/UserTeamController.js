const mongoose = require('mongoose');
const Team = require("../models/Team");
const admin = require("firebase-admin");

module.exports = {
  async view(req, res) {
    const { authId } = req;

    const teams = await Team.find({ users: authId });

    return res.json({ teams });
  },

  async list(req, res) {
    const { team_id } = req.params;
    
    const team = await Team.findById(team_id);

    if (!team) {
      return res.status(400).send({ error: 'Time não cadastrado.' });
    }
    
    const users = [];

    team.users.forEach(uid => users.push({ uid }))

    await admin
      .auth()
      .getUsers(users)
      .then((usersResult) => {
        const usersList = usersResult.users.map(user => ({
          uid: user.uid,
          displayName: user.displayName
        }))

        return res.json(usersList)
      })
      .catch((error) => {
        console.log('error: ', error);
        return res.status(400).send({ error: "Erro ao buscar dados." })
      });
  },

  async create(req, res) {
    const { uid, team_id } = req.body;

    const team = await Team.findById(team_id);

    if (!team) {
      return res.status(400).send({ error: 'Time não cadastrado.' });
    }

    team.users.push(uid);
    await team.save();

    return res.json(uid);
  },

  // async update(req, res) {
  //   const { id } = req.params;
  //   const result = await UserTeam.findByIdAndUpdate(id, req.body, {
  //     new: true,
  //   });

  //   return res.json({ result });
  // },

  // async delete(req, res) {
  //   const { id } = req.params;

  //   await UserTeam.findByIdAndDelete({ _id: id });
  //   return res.json({ message: "Deletado" });
  // },
};
