const { verify } = require("../../utils/token");
const asyncFunc = require("../../utils/async");
const user = require("../../models/v1/user.model");

module.exports = asyncFunc(async (req, res, next) => {
  let token = req?.headers?.authorization?.replace("Bearer ", "");

  if (!token)
    return res.status(401).send({ message: "sorry you need to login !" });

  let data = verify(token);

  if (!data?.uid)
    return res.status(401).send({ message: "sorry token is not valid !" });

  let selectedUser = await user.findOne({ _id: data?.uid });
  if (!selectedUser)
    return res.status(401).send({ message: "sorry token is not valid !" });

  req.user = selectedUser;
  next();
});
