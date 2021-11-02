const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");
// const { application } = require("express");

router.post("/create", async (req, res) => {

  let { username, password } = req.body.user;
  try {
    const thisUser = await User.create({
      username,
      password: bcrypt.hashSync(password, 13),
    });

    let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
    console.log(token);

    res.status(200).json({
      message: "The user object just saved",
      user: thisUser,
      sessionToken: token
    });
  } catch (err) {
    console.log(username, password);
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Email already in use",
      });
    } else {
      res.status(500).json({
        message: 'Failed to register user',
        error: err
      });
    }
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body.user;

  try {
    const loginUser = await User.findOne({
      where: {
        username: username,
        // password: password -- !Dwayne
      },
    });

    if (loginUser) {

      let passwordComparison = await bcrypt.compare(password, loginUser.password);

      if (passwordComparison) {

        let token = jwt.sign({ username: username, password: password }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(200).json({
          user: loginUser,
          message: "User successfully logged in!",
          sessionToken: token
        });

      } else {
        res.status(401).json({
          message: "Incorrect username or password*"
        })
      }

    } else {
      res.status(401).json({
        message: "Incorrect username* or password"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "failed to log user in"
    })
  }
});

module.exports = router;

// name5 token= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzU2MjMxMTQsImV4cCI6MTYzNTcwOTUxNH0.onUnt1SM9K_GMW6Ls60DSy8nohwKlCO_uWqaJosS6LQ