const express = require("express");
const expressJwt = require("express-jwt");
const bodyParser = require("body-parser");
const { User } = require("./models");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

const jwtSecret = JSON.parse(fs.readFileSync(__dirname + "/config/secrets.json"))["jwt"];

app.use(expressJwt({ secret: jwtSecret }).unless({ path: ['/user/register', '/user/login'] }));

function cleanUser({ id, username }) {
  return { id, username };
}

app.get('/user', (req, res) => {
  const { userId } = req.user;
  User.findById(userId).then((user) => {
    if (user) {
      res.send(cleanUser(user));
    } else {
      res.status(403).send("invalid credentials");
    }
  }).catch((e) => {
    res.status(500).send(e.toString());
  })
});

app.post('/user/register', (req, res) => {
  const { username, password } = req.body;
  User.create({ username, password }).then((user) => {
    res.json(cleanUser(user));
  }).catch((e) => {
    res.status(500).send(e.toString());
  })
});

app.post('/user/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ where: { username } }).then((user) => {
    if (user && user.validatePassword(password)) {
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });
      res.send({ success: true, token });
    } else {
      res.status(403).send("invalid credentials");
    }
  }).catch((e) => {
    res.status(500).send(e.toString());
  })
});

app.listen(4000);
