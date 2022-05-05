const mongoose = require("mongoose");

const { String, Boolean, ObjectId } = mongoose.Schema.Types;

module.exports = mongoose.model(
  "Todo",
  new mongoose.Schema({
    text: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 100,
    },
    file: {
      type: String,
      default: "",
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
    completed: {
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
