const express = require("express");
const inputCheck = require("./utils/inputCheck");
const PORT = process.env.PORT || 3001;
const app = express();
const sqlite3 = require("sqlite3").verbose();
const inputCHeck = require("./utils/inputCheck");

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = new sqlite3.Database("./db/election.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("connected to the election database.");
});

// routes for database calls
// get ALL candidates
app.get("/api/candidates", (req, res) => {
  const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;
  const params = [];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: row,
    });
  });
});

//  GET a single candidates
app.get("/api/candidates/:id", (req, res) => {
  const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: row,
    });
  });
});

// delete a candidate
app.delete("/api/candidates/:id", (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({
      message: "sucessfully deleted",
      changes: this.changes,
    });
  });
});

// Create a Candidate
app.post("/api/candidates", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
                Values (?,?,?,?)`;
  const params = [1, "Ronald", "Firbank", 1];
  // ES5 function, nor arrow function, to use 'this'
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: body,
      id: this.lastID,
    });
  });
});

// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
  res.status(404).end();
});

db.on("open", () => {
  app.listen(PORT, () => {
    console.log(`server is live on port ${PORT}`);
  });
});
