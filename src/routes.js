const express = require("express");
const multer = require('multer');
const routes = express.Router();

const auth = require("./middlewares/auth");

const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");
const UserTeamController = require("./controllers/UserTeamController");
const LeaderController = require("./controllers/LeaderController");
const TeamController = require("./controllers/TeamController");
const TrailController = require("./controllers/TrailController");
const CategoryController = require("./controllers/CategoryController");
const ChallengeController = require("./controllers/ChallengeController");
const ResponseController = require("./controllers/ResponseController");
const PointController = require("./controllers/PointController");
const GameController = require("./controllers/GameController");
const PainelController = require("./controllers/PainelController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

routes.get("/check", auth, AuthController.check);
routes.post("/register-email", AuthController.registerEmail);

routes.get("/user", auth, UserController.view);
routes.get("/users", UserController.list);
routes.post("/users", UserController.create);
routes.put("/user/:id", auth, UserController.update);
//routes.delete("/user/:id", UserController.delete);

routes.get("/leader", auth, LeaderController.view);
routes.get("/leaders", LeaderController.list);
routes.post("/leaders", LeaderController.create);
routes.put("/leader/:id", LeaderController.update);
routes.delete("/leader/:id", LeaderController.delete);

routes.get("/team/:id", auth, TeamController.view);
routes.get("/teams", auth, TeamController.list);
routes.post("/teams", auth, TeamController.create);
routes.put("/team/:id", auth, TeamController.update);
routes.delete("/team/:id", auth, TeamController.delete);
routes.delete("/team-trail/:trailId", auth, TeamController.deleteTrail);

routes.get("/user-team", auth, UserTeamController.view);
routes.get("/user-teams", auth, UserTeamController.list);
routes.post("/user-teams", auth, UserTeamController.create);

routes.get("/trail/:id", TrailController.view);
routes.get("/trails", TrailController.list);
routes.post("/trails", TrailController.create);
routes.put("/trail/:id", TrailController.update);
routes.delete("/trail/:id", TrailController.delete);

routes.get("/category/:id", CategoryController.view);
routes.get("/categories", CategoryController.list);
routes.post("/categories", CategoryController.create);
routes.put("/category/:id", CategoryController.update);
routes.delete("/category/:id", CategoryController.delete);

routes.get("/challenge/:id", ChallengeController.view);
routes.get("/challenges", ChallengeController.list);
routes.post("/challenges", ChallengeController.create);
routes.put("/challenge/:id", ChallengeController.update);
routes.delete("/challenge/:id", ChallengeController.delete);

routes.get("/response/:id", auth, ResponseController.view);
routes.get("/responses", auth, ResponseController.list);
routes.post("/responses", auth, ResponseController.create);
routes.put("/response/:id", ResponseController.update);
routes.delete("/response/:id", auth, ResponseController.delete);

routes.get("/point/:id", PointController.view);
routes.get("/points", PointController.list);
routes.post("/points", PointController.create);
routes.put("/point/:id", PointController.update);
routes.delete("/point/:id", PointController.delete);

routes.get("/game-team/:trailId", auth, GameController.team);
routes.get("/game-trail/:code", auth, GameController.trail);
routes.get("/game-user/:email", auth, GameController.user);
routes.get("/game-trails", auth, GameController.trails);
routes.get("/game-responses/:trailId", auth, GameController.responses);
routes.get("/game-responses-team/:trailId", auth, GameController.responsesTeam);
routes.get("/game-responses-leader/:trailId", auth, GameController.responsesLeader);
routes.get("/game-response", auth, GameController.response);
routes.get("/game-ranking/:trailId", auth, GameController.ranking);

routes.get("/painel-teams/:trailId", auth, PainelController.teams);
routes.get("/painel-users/:trailId", auth, PainelController.users);


module.exports = routes;
