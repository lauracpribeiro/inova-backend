const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");
const googleKey = require("./utils/googleKey");
const compression = require('compression');

admin.initializeApp({
  credential: admin.credential.cert(googleKey),
  databaseURL: "https://inova-c70f5.firebaseio.com",
  storageBucket: "inova-c70f5.appspot.com"
});

const app = express();

mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(compression());

app.listen(process.env.PORT || 3333);
