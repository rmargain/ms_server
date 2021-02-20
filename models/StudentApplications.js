const {Schema, model} = require("mongoose");

const schoolSchema = new Schema(
  {
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    _school: {
      type: Schema.Types.ObjectId,
      ref: "School",
    },
    _student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    admitted: {
      type: Boolean,
      default: false,
    },
    enrolled: {
      type: Boolean,
      default: false
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const School = model("School", schoolSchema);
module.exports = School;
