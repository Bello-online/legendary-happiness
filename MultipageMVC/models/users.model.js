var sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

let db;

// Initialize and open the database
async function startup() {
    db = await sqlite.open({
        filename: 'database.db',
        driver: sqlite3.Database
    });
}

startup(); // Call the startup function to initialize the database connection

// Fetch a user by username and password
function getUser(username, password) {
    return db.get('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password])
        .then(result => result || null);
}

// Create a new user with a specific access level
function createUser(username, password, accessLevel) {
    return db.run('INSERT INTO Users (username, password, access_level) VALUES (?, ?, ?)', 
                  [username, password, accessLevel]);
}

// Retrieve all users
function getAllUsers() {
    return db.all('SELECT rowid AS id, * FROM Users');
}

// Delete a user by ID
async function deleteUser(rowid) {
    const user = await db.get("SELECT username FROM Users WHERE rowid = ?", [rowid]);
    if (user) {
        await db.run("DELETE FROM Users WHERE rowid = ?", [rowid]);
        await db.run("DELETE FROM Articles WHERE username = ?", [user.username]);
    }
}

module.exports = { getUser, createUser, getAllUsers, deleteUser };
