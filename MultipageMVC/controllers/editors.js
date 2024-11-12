const express = require('express');
var router = express.Router()
const UsersModel = require('../models/users.model');
const ArticlesModel = require('../models/articles.js');

// Display the editors page
router.get("/", async function(req, res)
{
  const users = await UsersModel.getAllUsers();
  const articles = await ArticlesModel.getAllArticles();
  res.render("editors", { users, articles });
});

router.post("/delete-user/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  await UsersModel.deleteUser(userId);
  // await ArticlesModel.deleteArticlesByUser(userId);
  res.redirect("/editors"); 
});

router.post("/delete-article/:title", async (req, res) => {
  const articleTitle = req.params.title;
  await ArticlesModel.deleteArticle(articleTitle);
  res.redirect("/editors");
});

module.exports = router;
