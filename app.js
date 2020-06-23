require("express-async-errors");
const express = require("express");
const path = require("path");
const winston = require("winston");
const app = express();

require("./Startup/db")();
require("./Startup/errorhandler")(app);
app.use(express.json());
app.use("/users", require("./routes/users"));
app.use(express.static(path.join(__dirname, "Client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "Client/build", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`Listening on port ${port}`));
