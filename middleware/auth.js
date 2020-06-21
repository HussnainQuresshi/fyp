const Jwt = require("jsonwebtoken");
const config = require("../configuration/index");
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(401).send("Access Denied ..No Token Provided.");
  }
  try {
    const { sub } = Jwt.verify(token, config.JWT_SECRET);
    req.user = sub;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token..");
  }
};
