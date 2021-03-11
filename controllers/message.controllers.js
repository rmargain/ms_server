const User = require("../models/User");
const School = require("../models/School");
const Student = require("../models/Student");
const StudentApplication = require("../models/StudentApplication");
const Message = require("../models/Message");
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

exports.createMessage = async (req, res, next) => {
  const { _id } = req.user;
  const { message } = req.body;
  const { applicationId } = req.params;

  const user = await User.findById(_id);
  const application = await StudentApplication.findById(applicationId);
  const applicationUser = await User.findById(application._user);
  if (user._applications.includes(applicationId)) {
    const msg = await Message.create({
      _user: _id,
      onToModel: "School",
      onFromModel: "User",
      to: application._school,
      from: application._user,
      text: message,
      _application: applicationId,
      toDeleted: false,
      fromDeleted: false,
    });
    application._messages.push(msg._id);
    await application.save();
    user._messages.push(msg._id);
    await user.save();
    const school = await School.findById(application._school);
    school._messages.push(msg._id);
    await school.save();
    const { primaryContactEmail } = school;
    await transporter.sendMail({
      from: '"MicroSchooling" <r.margain.gonzalez@gmail.com>',
      to: primaryContactEmail,
      subject: "MicroSchooling: You have a new message from an applicant",
      html: `<b>Log in to your MS account to review the message from you applicant. </b>
    <b>Applicant Message: ${message}</b>`,
    });
    res.status(201).json({ message: "message sent", msg });
  } else if (user.isSchool && user._schools.includes(application._school)) {
    const msg2 = await Message.create({
      _user: _id,
      onToModel: "User",
      onFromModel: "School",
      to: application._user,
      from: application._school,
      text: message,
      _application: applicationId,
      toDeleted: false,
      fromDeleted: false,
    });
    application._messages.push(msg2._id);
    await application.save();
    user._messages.push(msg2._id);
    await user.save();
    const school = await School.findById(application._school);
    school._messages.push(msg2._id);
    await school.save();
    await transporter.sendMail({
      from: '"MicroSchooling" <r.margain.gonzalez@gmail.com>',
      to: applicationUser.email,
      subject: `MicroSchooling: You have a new message regarding you application to ${school.name}.`,
      html: `<b>Log in to your MS account to review the message from ${school.name}. </b>
    <b>School Message: ${message}</b>`,
    });
    res.status(201).json({ message: "Message sent", msg2 });
  } else {
    res.status(401).json({ message: "Unathorized" });
  }
};

exports.markAsRead = async (req, res, next) => {
  const { messageId } = req.params;
  const { _id } = req.user;
  const message = await Message.findById(messageId);
  const id = JSON.stringify(_id);
  const to = JSON.stringify(message.to);
  if (to === id) {
    message.status = "Read";
    message.save();
    res.status(201).json(message);
  } else {
    res.status(401).json({ message: "Unathorized" });
  }
};

exports.getMessagesBySchool = async (req, res) => {
  const { schoolId } = req.params;
  const { _id } = req.user;
  const user = await User.findById(_id);
  if (user._schools.includes(schoolId)) {
    const messages = await Message.find({
      $or: [{ from: schoolId }, { to: schoolId }],
    })
      .sort({ created_at: -1 })
      .populate("to", ["name", "lastname"])
      .populate("from", ["name", "lastname"]);
    res.status(201).json(messages);
  } else {
    res.status(401).json({ message: "Unathorized" });
  }
};

exports.getMessagesByApplicant = async (req, res) => {
  const { _id } = req.user;
  const messages = await Message.find({
    $or: [{ from: _id }, { to: _id }],
  })
    .sort({ created_at: -1 })
    .populate("to", ["name", "lastname"])
    .populate("from", ["name", "lastname"]);
  res.status(201).json(messages);
};


exports.getMessagesByApplication = async (req, res) => {
  const { applicationId } = req.params;
  const messages = await Message.find({ _application: applicationId })
    .populate("to")
    .populate("from");
  res.status(201).json(messages);
};

exports.deleteMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const { _id } = req.user;
  const user = await User.findById(_id);
  const { _schools } = user;
  const message = await Message.findById(messageId);
  const { to, from } = message;
  const id = JSON.stringify(_id);
  const from2 = JSON.stringify(from);
  const to2 = JSON.stringify(to);
  if (from2 === id) {
    message.fromDeleted = true;
    await message.save();
    res.status(201).json({ message: "Message Deleted" });
  } else if (to2 === id) {
    message.toDeleted = true;
    await message.save();
    res.status(201).json({ message: "Message Deleted" });
  } else if (_schools.includes(from2)) {
    message.fromDeleted = true;
    await message.save();
    res.status(201).json({ message: "Message Deleted" });
  } else if (_schools.includes(to2)) {
    message.toDeleted = true;
    await message.save();
    res.status(201).json({ message: "Message Deleted" });
  } else {
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.recoverMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const { _id } = req.user;
  const user = await User.findById(_id);
  const { _schools } = user;
  const message = await Message.findById(messageId);
  const id = JSON.stringify(_id);
  const from2 = JSON.stringify(from);
  const to2 = JSON.stringify(to);
  if (from2 === id) {
    message.fromDeleted = false;
    await message.save();
    res.status(201).json({ message: "Message Recovered" });
  } else if (to2 === id) {
    message.toDeleted = false;
    await message.save();
    res.status(201).json({ message: "Message Recovered" });
  } else if (_schools.includes(from2)) {
    message.fromDeleted = false;
    await message.save();
    res.status(201).json({ message: "Message Recovered" });
  } else if (_schools.includes(to2)) {
    message.toDeleted = false;
    await message.save();
    res.status(201).json({ message: "Message Recovered" });
  } else {
    res.status(500).json({ message: "something went wrong" });
  }
};
