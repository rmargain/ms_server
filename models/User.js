const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type:String,
    required: true
  },
  name: {
    type:String,
    required: true
  },
  lastname: {
    type:String,
    required: true
  },
  avatar: {
    type: String,
  },
  confirmationCode: {
    type: String,
  },
  isSchool: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Inactive'
  },
  _schools: [
    {
      type: Schema.Types.ObjectId,
      ref: "School"
    }
  ],
  _students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student"
    }
  ],
  _applications: [
    {
      type: Schema.Types.ObjectId,
      ref: "StudentApplication"
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
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
