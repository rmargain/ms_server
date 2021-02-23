const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
        type: String,
    },
    from: {
        type: String,
    },
    text: {
      type: String,
    },
    status: {
        type: String,
        enum: ['Read', 'Unread'],
        default: 'Unread'
    },
    _application: {
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

const Message = model("Message", messageSchema);
module.exports = Message;
