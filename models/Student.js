const { Schema, model } = require("mongoose");

const schoolSchema = new Schema(
  {
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    alias: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    avatar: {
      type: String,
    },
    _applications: {
      type: Schema.Types.ObjectId,
      ref: "StudentApplications",
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
