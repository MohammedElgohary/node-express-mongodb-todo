const asyncFunc = require("../../utils/async");
const { sign } = require("../../utils/token");
const User = require("../../models/v1/user.model");
const bcrypt = require("bcryptjs");

module.exports = {
  login: asyncFunc(async (req, res, next) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email }, { __v: 0 });

    if (!user) return next(sendError("wrong email or password !", 400));

    let passwordOkay = await bcrypt.compare(password, user?.password);

    if (!passwordOkay) return next(sendError("wrong email or password !", 400));

    // set Online true
    await User.updateOne({ _id: user?._id }, { online: true });

    let token = sign({
      uid: user?._id,
    });

    // Organize user Object
    user._doc.id = user?._doc?._id;
    delete user?._doc?._id;
    delete user?._doc?.password;

    res.send({
      user: {
        ...user?._doc,
        online: true,
      },
      token,
    });
  }),
  logout: asyncFunc(async (req, res, next) => {
    const { user } = req,
      { _id } = user;

    await User.updateOne({ _id }, { online: false });

    // Organize user Object
    user._doc.id = user?._doc?._id;
    delete user?._doc?.password;
    delete user?._doc?._id;

    res.send({
      ...user?._doc,
      online: false,
    });
  }),
};
