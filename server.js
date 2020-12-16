const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const sqlite3 = require("sqlite3").verbose();

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

// // database calls
// // get ALL candidates
// db.all(`SELECT * FROM candidates`, (err, rows) => {
//   console.log(rows);
// });
// //  GET a single candidates
// db.get(`SELECT * FROM candidates WHERE id=1`, (err, row) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(row);
// });
// // delete a candidate
// db.run(`DELETE FROM candidates WHERE id = ?`, 1, function (err, result) {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result, this, this.changes);
// });
// // Create a Candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
// Values (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 function, nor arrow function, to use 'this'
// db.run(sql, params, function(err, result) {
//   if (err) {
//     console.log(err)
//   }
//   console.log(result, this.lastID)
// })

// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
  res.status(404).end();
});

db.on("open", () => {
  app.listen(PORT, () => {
    console.log(`server is live on port ${PORT}`);
  });
});
