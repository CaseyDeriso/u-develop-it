const express = require("express");
const inputCheck = require("./utils/inputCheck");
const PORT = process.env.PORT || 3001;
const app = express();
const db = require("./db/database");
const apiRoutes = require("./routes/apiRoutes");

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes for database calls
app.use("/api", apiRoutes);

// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
  res.status(404).end();
});

// start server after DB connection
db.on("open", () => {
  app.listen(PORT, () => {
    console.log(`server is live on port ${PORT}`);
  });
});
