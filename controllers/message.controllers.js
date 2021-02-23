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
    const {_id} = req.user
    const {message} = req.body 
    const {applicationId} = req.params

    const user = await User.findById(_id)
    const application = await StudentApplication.findById(applicationId)
    if(user._application.includes(applicationId)){
        const msg = Message.create({
            _user: _id,
            to: application._school,
            from: application._user,
            text: message,
            _application: applicationId
        })
        user._messages.push(msg._id)
        await user.save()
        const school = await School.findById(application._school);
        school._messages.push(msg._id)
        await school.save()
        const {primaryContactEmail} = school
        await transporter.sendMail({
          from: '"MicroSchooling" <r.margain.gonzalez@gmail.com>',
          to: primaryContactEmail,
          subject: "MicroSchooling: You have a new message from an applicant",
          html: `<b>Log in to your MS account to review the message from you applicant. </b>
    <b>Applicant Message: ${messsage}</b>`,
        });
        res.status(201).json({message: 'Message sent', msg})
    } else if(user._isSchool && user._schools.includes(application._school)){
        const msg2 = Message.create({
            _user: _id,
            to: application._user,
            from: application._school,
            text: message,
            _application: applicationId
        })
        user._message.push(msg2._id)
        await user.save()
        const school = await School.findById(application._school);
        school._messages.push(msg2._id)
        await school.save()
        await transporter.sendMail({
          from: '"MicroSchooling" <r.margain.gonzalez@gmail.com>',
          to: user.email,
          subject: `MicroSchooling: You have a new message regarding you application to ${school.name}.`,
          html: `<b>Log in to your MS account to review the message from ${school.name}. </b>
    <b>School Message: ${messsage}</b>`,
        });
        res.status(201).json({ message: "Message sent", msg2 });

    } else {
        res.status(401).json({message: 'Unathorized'})
    }
}

exports.markAsRead = async (req, res, next) => {
    const {messageId} = req.params
    const {_id} = req.user
    const message = await Message.findById(messageId)
    if(message.to === _id){
        message.status = 'Read'
        message.save()
        res.status(201).json(message)
    } else {
        res.status(401).json({message: 'Unathorized'})
    }
}

exports.deleteMessage = async (req, res, next) => {
    const {messageId} = req.params
    const {_id} = req.user
    const message = await Message.findById(messageId)
    if(message._user === _id){
        message.delete
        message.save()
        res.status(201).json({message: 'message deleted'})
    } else {
        res.status(401).json({message: 'Unathorized'})
    }

}