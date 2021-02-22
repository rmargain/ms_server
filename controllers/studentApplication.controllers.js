const User = require("../models/User");
const School = require("../models/School");
const Student = require("../models/Student");
const StudentApplication = require("../models/StudentApplication");
const Message = require("../models/Message")
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// controller for creating application
exports.createStudentApplication = async (req, res, next) => {
  const { _id } = req.user;
  const { alias, message } = req.body;
  const {schoolId} = req.params;

  const user = await User.findById(_id);
  const student = await Student.find({alias: alias, _user: _id})
  const application = await StudentApplication.create({
    _user: _id,
    _school: schoolId,
    _student: student._id,
  });
  
  const msg = await Message.create({
    _user: _id,
    to: 'School',
    from: 'Applicant',
    text: message,
    _application: application._id
  })
  user._applications.push(application._id);
  user._messages.push(msg._id)
  user.save();
  const school = await School.findById(schoolId)
  const {name, primaryContactEmail} = school
  await transporter.sendMail({
    from: '"MicroSchooling" <r.margain.gonzalez@gmail.com>',
    to: primaryContactEmail,
    subject: "MicroSchooling: You have Received a student application!",
    html: `<b>Log in to your MS account to review the student application for ${name}. </b>
    <b>Applicant Message: ${messsage}</b>`,
  });

  res.status(201).json(application, user, msg);
};

// controller for getting all applications
exports.getAllStudentApplications = async (req, res, next) => {
  const applications = await StudentApplication.find();
  res.status(201).json(applications);
};

//controller for getting applications by applicationID
exports.getStudentApplicaitonById = async (req, res, next) => {
  const { applicationId } = req.params;
  const application = await StudentApplication.findbyID(applicationId);
  res.status(201).json(application);
};

//controller for getting applications by studentID
exports.getStudentApplicaitonsByStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const applications = await StudentApplication.find({_student: studentId});
  res.status(201).json(applications);
};

//controller for getting applications by school by ID
exports.getStudentApplicaitonsBySchool = async (req, res, next) => {
  const { schoolId } = req.params;
  const applications = await StudentApplication.find({_school: schoolId});
  res.status(201).json(applications);
};

// controller para cancelar applicación
exports.cancelApplication = async (req, res, next) => {
  const { applicationId } = req.params;
  const { _id } = req.user;
  const {message} = req.body;
  const user = await User.findById(_id);
  if (user._applications.includes(applicationId)) {
    const application = await StudentApplicaiton.findByIdAndUpdate(
      applicationId,
      {
        isCancelled: true
      },
      { new: true }
    );
    const school = await School.findById(applicaiton._school)
    const {primaryContactEmail} = school
    await transporter.sendMail({
      from: '"MicroSchooling" <r.margain.gonzalez@gmail.com>',
      to: primaryContactEmail,
      subject: "MicroSchooling: The applicant has cancelled the application.",
      html: `<b>Log in to your MS account to review the application cancellation reason for ${name}. </b>
    <b>Applicant Message: ${message}</b>`,
    });
    res.status(200).json(application);
  } else {
    res.status(401).json({ message: "Unathorized" });
  }
};

// controller para cancelar applicación
exports.approveApplication = async (req, res, next) => {
  const { applicationId } = req.params;
  const { _id } = req.user;
  const {message, decision} = req.body;
  const application = await StudentApplication.findById(applicationId)
  const user = await User.findById(_id);
  if (user._schools.includes(application._school)) {
    application.admitted = decision
    application.save()
    const school = await School.findById(application._school)
    const {name} = school
    await transporter.sendMail({
      from: '"MicroSchooling" <r.margain.gonzalez@gmail.com>',
      to: user.email,
      subject: `MicroSchooling: Decision on you Application to ${name}`,
      html: `<b>Your application has been ${decision}. Log in to your MS account to review your application to ${name}. </b>
    <b>School Message: ${message}</b>`,
    });
    res.status(200).json(application);
  } else {
    res.status(401).json({ message: "Unathorized" });
  }
};