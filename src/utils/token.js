const jwt = require("jsonwebtoken");

const sign = (obj) =>
  jwt.sign(obj, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { sign, verify };
