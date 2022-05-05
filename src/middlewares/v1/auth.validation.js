const validator = require("../../validation/v1/auth.validation");

module.exports = (req, res, next) => {
  const valid = validator(req.body);

  if (valid) {
    next();
  } else {
    res
      .status(403)
      .send({ errors: validator.errors || "wrong email or password !" });
  }
};
