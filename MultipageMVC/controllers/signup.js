const express = require('express');
const router = express.Router();
const UsersModel = require('../models/users.model');

router.get("/", (req, res) => {
  req.TPL.signup_error = req.session.signup_error;
  req.session.signup_error = "";
  req.TPL.signup_success = req.session.signup_success;
  req.session.signup_success = "";
  res.render("signup", req.TPL);
});

router.post("/attemptsignup", async (req, res) => {
  const { username, password } = req.body;

  if (username.length < 1 || password.length < 1) {
    req.session.signup_error = "Username/password cannot be blank!";
    res.redirect("/signup");
  } else {
    await UsersModel.createUser(username, password, "member");
    req.session.signup_success = "User account created! Login to access your new account.";
    res.redirect("/signup");
  }
});

module.exports = router;
