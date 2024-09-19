const sqlite3 = require("sqlite3").verbose();

// Open database file 
const db = new sqlite3.Database("database.db");

// db function 
db.serialize(function(){
    db.run("DROP TABLE IF EXISTS ")
    db.run("CREATE TABLE stuff (thing TEXT)")

});