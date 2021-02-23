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
    generalInfo: {
      type: String,
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
    location: { /* GeoJson */
      type: {type: String},
      coordinates: [Number]
    },
    capacity: {
      type: Number,
      required: true,
    },
    educationalMethod: {
      type: String,
      enum: ["Montessori", "Progressive", "Traditional", "Other"],
      required: true,
    },
    educationLevelMin: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    educationLevelMax: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
    },
    tuition: {
      type: Number,
      required: true,
    },
    _students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student"
      }
    ], 
    _messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

schoolSchema.index({location: "2dsphere"})

module.exports = model("School", schoolSchema);
