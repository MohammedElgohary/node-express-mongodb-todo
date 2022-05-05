const mongoose = require("mongoose");

const { String, Boolean } = mongoose.Schema.Types;

module.exports = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: (email) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "",
    },
    online: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: String,
    },
    updatedAt: {
      type: String,
    },
  })
);
