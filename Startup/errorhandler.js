const winston = require("winston");
const error = require("../middleware/error");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

module.exports = function (app) {
  winston.exceptions.handle(
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
    }),
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
    })
  );
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
  winston.add(new winston.transports.File({ filename: "serverlogs.log" }));
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

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(error);
};
