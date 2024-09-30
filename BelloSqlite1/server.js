const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const db = new sqlite3.Database("api.db", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        db.run(`DROP TABLE IF EXISTS movies`, () => {
            db.run(`CREATE TABLE IF NOT EXISTS movies (
                title TEXT NOT NULL,
                release_year TEXT NOT NULL,
                time_viewed TEXT
            )`, (err) => {
                if (err) {
                    console.error("Error creating table:", err.message);
                } else {
                    console.log("Movies table created successfully.");
                }
            });
        });
    }
});

// Routes 

// Get Entire collection of movies
app.get("/api", (req, res) => {
    db.all("SELECT * FROM movies", (err, rows) => {
        if (err) {
            console.error("Error retrieving movies:", err.message);
            res.status(500).send("Error retrieving movies");
        } else {
            res.send(rows);
        }
    });
});

// Put request
app.put("/api", (req,res)=> {
    db.serialize(() => {
        db.run("DELETE FROM movies", () => {
            const stmt = db.prepare("INSERT INTO movies (title, release_year, time_viewed) VALUES (?, ?, ?)");
            req.body.forEach((movie) => {
                stmt.run(movie.title, movie.release_year, movie.time_viewed);
            });
            stmt.finalize();
            res.json({ status: "REPLACE COLLECTION SUCCESSFUL" });
        });
    });
});

// Post request 
app.post("/api",(req,res) =>{
    const { title, release_year, time_viewed } = req.body;
    db.run(
        `INSERT INTO movies (title, release_year, time_viewed) VALUES (?, ?, ?)`,
        [title, release_year, time_viewed],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ status: "CREATE ENTRY SUCCESSFUL", id: this.lastID });
        }
    );
})

// Delete collection 
app.delete("/api", (req,res) =>{
    db.run("DELETE FROM movies", (err) => {
        if (err){
            res.status(500).json({error : err.message});
            return;
        }
        res.json({status: "DELETE COLLECTION SUCCESSFUL"})
    }
    );
})

// Get Single movie 
app.get("/api/:id",(req,res) => {
    const {id} = req.params;
    db.get("SELECT rowid AS id, * FROM movies WHERE rowid = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
})

//Update single movie
app.put("/api/:id", (req,res)=>{
    const {id} = req.params;
    const {title, release_year, time_viewed} = req.body;
    db.run("UPDATE movies SET title = ?, release_year = ?, time_viewed = ? WHERE rowid = ?",
        [title,release_year, time_viewed, id],(err) =>{
        if (err){
            res.status(500).json({error: err.message})
            return;
        }
        res.json({status: " UPDATE ITEM SUCCESSFUL"});
    });
})

// Delete Single Movie by Id
app.delete("/api/:id", (req,res) =>{
    const id = req.params;
    db.run("DELETE FROM movies WHERE rowid = ?",[id],(err)=>{
        if (err){
            res.status(500).json({error: err.message})
            return;
        }
        res.json({staus: "DELETE ITEM SUCCESSFUL"});
    })
    
})




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});