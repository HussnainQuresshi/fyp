const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = require("./app");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = require("./configuration/index");
const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect(process.env.MONGODB_URI || db.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("connected to the mongodb ....."))
  .catch(err => console.error(err.message));
// Serve any static files
app.use(express.static(path.join(__dirname, "Client/build")));
// Handle React routing, return all requests to React app
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "Client/build", "index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
