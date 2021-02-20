const { Schema, model } = require("mongoose");

const schoolSchema = new Schema(
  {
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    alias: {
      type: String,
      required: true
    },
    level: {
        type: String,
        enum: [
            'Kindergarten - 3',
            'Elementary - 1st',
            'Elementary - 2nd',
            'Elementary - 3rd',
            'Elementary - 4th',
            'Elementary - 5th',
            'Elementary - 6th',
            'Highschool - 7th',
            'Highschool - 8th',
            'Highschool - 9th'
         ]
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
