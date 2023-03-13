const admin = require("firebase-admin");

module.exports = (req, res, next) => {
  const getAuthToken = (req, res, next) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      req.authToken = req.headers.authorization.split(" ")[1];
    } else {
      req.authToken = null;
    }
    next();
  };

  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;

      const userInfo = await admin.auth().verifyIdToken(authToken);


      if (userInfo.email_verified) {
        req.authId = userInfo.uid;
        return next();
      }

      return null;
    } catch (e) {
      return res.status(401).send({ error: "Não autorizado." });
    }
  });
};
