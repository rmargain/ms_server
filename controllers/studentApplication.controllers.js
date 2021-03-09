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

// controller for creating application
exports.createStudentApplication = async (req, res, next) => {
  const { _id } = req.user;
  const { alias, message } = req.body;
  const { schoolId } = req.params;

  const user = await User.findById(_id);
  const student = await Student.findOne({ alias: alias, _user: _id });
  const application = await StudentApplication.create({
    _user: _id,
    _school: schoolId,
    _student: student._id
  });
  student._applications.push(application._id)
  await student.save()
  const school = await School.findById(schoolId);
  const msg = await Message.create({
    _user: _id,
    onToModel: 'School', 
    onFromModel: 'User',
    to: application._school,
    from: application._user,
    text: message,
    _application: application._id,
  });
  application._messages.push(msg._id)
  await application.save()
  user._applications.push(application._id);
  user._messages.push(msg._id);
  await user.save();
  school._messages.push(msg._id);
  await school.save();
  await transporter.sendMail({
    from: '"MicroSchooling" <r.margain.gonzalez@gmail.com>',
    to: school.primaryContactEmail,
    subject: "MicroSchooling: You have Received a student application!",
    html: `<b>Log in to your MS account to review the student application for ${school.name}. </b>
    <b>Applicant Message: ${message}</b>`,
  });

  res.status(201).json({application, user, msg});
};

// controller for getting all applications
exports.getAllStudentApplications = async (req, res, next) => {
  const applications = await StudentApplication.find();
  res.status(201).json(applications);
};

// controller for getting all applications of all students of a user
exports.getAllUserApplications = async (req, res, next) => {
  const {_id} = req.user
  const applications = await StudentApplication.find({ _user: _id })
    .populate("_school", "name")
    .populate("_user", { name: 1, lastname: 1 })
    .populate("_student", "alias")
    .populate({
      path: "_messages",
      populate: [
        {
          path: "to",
          select: { name: 1, lastname: 1 },
        },
        {
          path: "from",
          select: { name: 1, lastname: 1 },
        },
      ],
    });
  res.status(201).json(applications);
};


// get all applications for all schools of a user
exports.getSchoolUserApplications = async (req, res, next) => {
  const {_id} = req.user
  const user= await User.findById(_id)
  const {_schools} = user
  const applications = await StudentApplication.find({
    _school: { $in: _schools },
  })
    .populate("_school", "name")
    .populate("_user", { name: 1, lastname: 1 })
    .populate("_student", "alias")
    .populate({
      path: "_messages",
      populate: [
        {
          path: "to",
          select: { name: 1, lastname: 1 },
        },
        {
          path: "from",
          select: { name: 1, lastname: 1 },
        },
      ],
    });
  res.status(201).json({applications})
}

//controller for getting applications by applicationID
exports.getStudentApplicationById = async (req, res, next) => {
  const { applicationId } = req.params;
  const application = await StudentApplication.findById(applicationId)
    .populate("_school", "name")
    .populate("_user", { name: 1, lastname: 1 })
    .populate("_student", "alias")
    .populate({
      path: "_messages",
      populate: [{
        path: "to",
        select: { name: 1, lastname: 1 },
      },
      {
        path: "from",
        select: { name: 1, lastname: 1 },
      },]
    });
  res.status(201).json(application);
};

//controller for getting applications by studentID
exports.getStudentApplicationsByStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const applications = await StudentApplication.find({ _student: studentId })
    .populate("_school", "name")
    .populate("_user", { name: 1, lastname: 1 })
    .populate("_student", "alias")
    .populate({
      path: "_messages",
      populate: [
        {
          path: "to",
          select: { name: 1, lastname: 1 },
        },
        {
          path: "from",
          select: { name: 1, lastname: 1 },
        },
      ],
    });
  res.status(201).json(applications);
};

//controller for getting applications by school by ID
exports.getStudentApplicationsBySchool = async (req, res, next) => {
  const { schoolId } = req.params;
  const applications = await StudentApplication.find({ _school: schoolId })
    .populate("_school", "name")
    .populate("_user", { name: 1, lastname: 1 })
    .populate("_student", "alias")
    .populate({
      path: "_messages",
      populate: [
        {
          path: "to",
          select: { name: 1, lastname: 1 },
        },
        {
          path: "from",
          select: { name: 1, lastname: 1 },
        },
      ],
    });
  res.status(201).json(applications);
};

// controller para cancelar applicación
exports.cancelApplication = async (req, res, next) => {
  const { applicationId } = req.params;
  const { _id } = req.user;
  const { message } = req.body;
  const user = await User.findById(_id);
  console.log(user._applications.includes(applicationId))
  if (user._applications.includes(applicationId)) {
    const application = await StudentApplication.findById(applicationId);
    const school = await School.findById(application._school);
    const msg = await Message.create({
      _user: _id,
      onToModel: "School",
      onFromModel: "User",
      to: application._school,
      from: application._user,
      text: message,
      _application: application._id,
    });
    application.isCancelled = true
    application.admitted = "Cancelled"
    application._messages.push(msg._id)
    await application.save()
    school._messages.push(msg._id);
    await school.save();
    user._messages.push(msg._id);
    await user.save()
    const { primaryContactEmail, name } = school;
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

// controller para aprobar applicación
exports.approveApplication = async (req, res, next) => {
  const { applicationId } = req.params;
  const { _id } = req.user;
  const { message, decision } = req.body;
  const application = await StudentApplication.findById(applicationId);
  const user = await User.findById(_id);
  if (user._schools.includes(application._school)) {
    application.admitted = decision;
    await application.save();
    const school = await School.findById(application._school);
    const msg = await Message.create({
      _user: _id,
      onToModel: "User",
      onFromModel: "School",
      to: application._user,
      from: application._school,
      text: message,
      _application: application._id,
    });
    user._messages.push(msg._id);
    await user.save();
    school._messages.push(msg._id);
    await school.save();
    const { name } = school;
    const applicationUser = await User.findById(application._user)
    const {email} = applicationUser
    applicationUser._messages.push(msg._id)
    await applicationUser.save()
    await transporter.sendMail({
      from: '"MicroSchooling" <r.margain.gonzalez@gmail.com>',
      to: email,
      subject: `MicroSchooling: Decision on you Application to ${name}`,
      html: `<b>Your application has been ${decision}. Log in to your MS account to review your application to ${name}. </b>
    <b>School Message: ${message}</b>`,
    });
    res.status(200).json(application);
  } else {
    res.status(401).json({ message: "Unathorized" });
  }
};
