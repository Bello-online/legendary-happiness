const express = require('express');
var router = express.Router()
const UsersModel = require('../models/users.model');

// Displays the login page
router.get("/", async function(req, res)
{
  // if we had an error during form submit, display it, clear it from session
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";

  // render the login page
  res.render("login", req.TPL);
});

// Attempts to login a user
// - The action for the form submit on the login page.
router.post("/attemptlogin", async function(req, res)
{
  const { username, password } = req.body;
  const user = await UsersModel.getUser(username, password);

  if (user) {
    req.session.username = user.username;
    req.session.access_level = user.access_level;
    res.redirect(user.access_level === "editor" ? "/editors" : "/members");
  } else {
    req.session.login_error = "Invalid username and/or password!";
    res.redirect("/login");
  }

});

// Logout a user
// - Destroys the session key username that is used to determine if a user
// is logged in, re-directs them to the home page.
router.get("/logout", async function(req, res)
{
  delete(req.session.username);
  delete req.session.access_level;
  res.redirect("/home");
});

module.exports = router;
