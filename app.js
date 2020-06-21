const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/users", require("./routes/users"));
module.exports = app;
