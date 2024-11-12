var sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

async function startup()
{
  db = await sqlite.open({
    filename: 'database.db',
    driver: sqlite3.Database
  });
}

startup();

// Return all of the articles
async function getAllArticles()
{
  const results = db.all("SELECT * FROM Articles");
  return results;
}

// Create a new article given a title, content and username
async function createArticle(article,username)
{ 
  await db.run("INSERT INTO Articles VALUES (?,?,?)",
               [article.title, username, article.content]);
}

// Delete an article by ID
async function deleteArticle(title) {
  await db.run("DELETE FROM Articles WHERE title = ?", [title]);
}

// Delete all articles by a specific user
async function deleteArticlesByUser(username) {
  await db.run("DELETE FROM Articles WHERE username = ?", [username]);
}

module.exports = {getAllArticles, createArticle, deleteArticle, deleteArticlesByUser}; 
