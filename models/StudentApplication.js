const {Schema, model} = require("mongoose");

const studentApplicationSchema = new Schema(
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
    _messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Messages"
      }
    ],
    admitted: {
      type: String,
      default: 'Under Review',
      enum: ['Approved', 'Under Review', 'Not Approved']
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

const StudentApplication = model("StudentApplication", studentApplicationSchema);
module.exports = StudentApplication;
