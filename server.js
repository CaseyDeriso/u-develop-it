const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

;
// Routes


// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
  res.status(404).end();
})

app.listen(PORT, () => {
  console.log(`server is live on port ${PORT}`);
});