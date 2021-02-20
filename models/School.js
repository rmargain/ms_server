const {Schema, model} = require("mongoose");

const schoolSchema = new Schema(
  {
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    primaryContactName: {
      type: String,
      required: true,
    },
    primaryContactEmail: {
      type: String,
      required: true,
    },
    primaryContactPhone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{2}-\d{3}-\d{3}-\d{4}/.test(v);
        },
      },
    },
    address: {
      street: {
        type: String,
        require: true,
      },
      extNum: {
        type: String,
      },
      intNum: {
        type: String,
      },
      neighborhood: {
        type: String,
        require: true,
      },
      municipality: {
        type: String,
      },
      city: {
        type: String,
        require: true,
      },
      country: {
        type: String,
        require: true,
      },
      zipcode: {
        type: String,
        require: true,
        minLength: 5,
      },
    },
    capacity: {
      type: Number,
      required: true,
    },
    educationalMethod: {
      type: String,
      enum: ["Montesori", "Progressive", "Traditional", "Other"],
      required: true,
    },
    educationLevel: {
      type: String,
      required: true,
    },
    primaryEducationalLanguage: {
      type: String,
      enum: [
        "Spanish",
        "English",
        "Portuguese",
        "French",
        "German",
        "Mandarin",
        "Cantonese",
        "Dutch",
        "Hindi",
        "Russian",
        "Japanese",
        "Korean",
        "Arabic",
        "Hebrew",
        "Greek",
      ],
      required: true,
    },
    secondaryEducationalLanguage: {
      type: String,
      enum: [
        "Spanish",
        "English",
        "Portuguese",
        "French",
        "German",
        "Mandarin",
        "Cantonese",
        "Dutch",
        "Hindi",
        "Russian",
        "Japanese",
        "Korean",
        "Arabic",
        "Hebrew",
        "Greek",
      ],
      required: true,
    },
    tuition: {
      type: Number,
      required: true,
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
