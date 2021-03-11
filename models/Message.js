const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    onToModel: {
      type: String,
      enum: ["User", "School"],
    },
    onFromModel: {
      type: String,
      enum: ["User", "School"],
    },
    to: {
      type: Schema.Types.ObjectId,
      refPath: "onToModel",
    },
    from: {
      type: Schema.Types.ObjectId,
      refPath: "onFromModel",
    },
    text: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Read", "Unread"],
      default: "Unread",
    },
    _application: {
      type: Schema.Types.ObjectId,
      ref: "StudentApplications",
    },
    toDeleted: {
      type: Boolean,
      default: false,
    },
    fromDeleted: {
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

const Message = model("Message", messageSchema);
module.exports = Message;
