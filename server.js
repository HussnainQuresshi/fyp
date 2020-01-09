const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = require("./app");
const mongoose = require("mongoose");
const db = require("./configuration/index");

mongoose.Promise = global.Promise;
const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect(process.env.MONGODB_URI || db.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("connected to the mongodb ....."))
  .catch(err => console.error(err.message));
app.use(express.static(path.join(__dirname, "Client/build")));
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "Client/build", "index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
