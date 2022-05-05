const asyncFunc = require("../../utils/async");
const user = require("../../models/v1/user.model");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

module.exports = {
  getAll: asyncFunc(async (req, res, next) => {
    const { page, limit, deleted, online, email, name } = {
      page: 1,
      limit: 20,
      deleted: false,
      blocked: false,
      ...req.query,
    };

    const skip = (page - 1) * limit;

    let searchQuery = {
      deleted,
      blocked,
    };

    if (name) {
      searchQuery.name = { $regex: RegExp(name, "ig") };
    }

    if (email) {
      searchQuery.email = { $regex: RegExp(email, "ig") };
    }

    if (online) {
      searchQuery.online = online;
    }

    let data = await user
      .find(searchQuery, { __v: 0, password: 0 })
      .limit(limit)
      .skip(skip);

    let totalCount = await user.count(searchQuery);
    const pageCount = Math.ceil(totalCount / limit);

    res.send({
      data,
      page,
      limit,
      pageCount,
      totalCount,
    });
  }),
  getOne: asyncFunc(async (req, res, next) => {
    const { id } = req.params;

    let data = await user.findOne({ _id: id }, { __v: 0, password: 0 });

    if (!data) return next(sendError("user was not found !", 404));

    data._doc.id = data?._doc?._id;
    delete data?._doc?._id;

    res.send({
      ...data?._doc,
    });
  }),
  add: asyncFunc(async (req, res, next) => {
    let { name, email, password } = req.body;

    // date
    const date = new Date().toJSON();

    const addQuery = {
      email,
      name,
      createdAt: date,
      updatedAt: date,
    };

    // hash the password
    const salt = await bcrypt.genSalt(10);
    addQuery.password = await bcrypt.hash(password, salt);

    // photo
    if (req?.files?.photo?.length && req?.files?.photo[0]?.filename) {
      addQuery.photo = `/uploads/${req?.files?.photo[0]?.filename}`;
    }

    const newUser = await user.create(addQuery);

    newUser._doc.id = newUser?._doc?._id;
    delete newUser?._doc?._id;

    res.send(newUser);
  }),
  update: asyncFunc(async (req, res, next) => {
    let { name, email, password } = req.body;

    let DeleteOldImage = false;

    const { id } = req.params;

    if (req.user?._id.toString() !== id)
      return next(sendError("You can't update this user !", 400));

    let selectedUser = await user
      .findOne({ _id: id }, { password: 0, __v: 0 })
      .then((user) => {
        user._doc.id = user?._doc?._id;
        delete user?._doc?._id;
      });

    if (!selectedUser) return next(sendError("User was not found !", 400));

    // date
    const date = new Date().toJSON();

    let updatedQuery = {
      updatedAt: date,
    };

    if (name) {
      updatedQuery.name = name;
    }

    if (email) {
      updatedQuery.email = email;
    }
    // hash the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedQuery.password = await bcrypt.hash(password, salt);
    }

    // photo
    if (req?.files?.photo?.length && req?.files?.photo[0]?.filename) {
      updatedQuery.photo = `/uploads/${req?.files?.photo[0]?.filename}`;

      DeleteOldImage = true;
    }

    await user.updateOne({ _id: id }, updatedQuery);

    // delete old image
    if (DeleteOldImage) {
      let uploadPath = path.join(process.cwd(), selectedUser?.photo);

      await fs.unlink(uploadPath, () => {});
    }

    let data = { ...selectedUser?._doc, ...updatedQuery };

    delete data?.password;

    res.send(data);
  }),
  delete: asyncFunc(async (req, res, next) => {
    const { id } = req.params;

    if (!req.user?._id.toString() === id)
      return next(sendError("You can't update this user !", 400));

    let selectedUser = await user.findOne({ _id: id }).then((user) => {
      user._doc.id = user?._doc?._id;
      delete user?._doc?._id;
    });

    if (!selectedUser) return next(sendError("User was not found !", 400));

    // date
    const date = new Date().toJSON();

    let updatedQuery = {
      updatedAt: date,
      deleted: !selectedUser?.deleted,
    };

    await user.updateOne({ _id: id }, updatedQuery);

    let obj = { ...selectedUser?._doc, ...updatedQuery };

    obj.id = obj?._id;
    delete obj?.password;
    delete obj?._id;

    res.send(obj);
  }),
};
