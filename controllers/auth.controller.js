const User = require("../models/User");
const passport = require("passport");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const nodemailer = require("nodemailer");
const { unsubscribe } = require("../routes/auth");
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const clearRes = (data) => {
  //destructuramos el objeto "data" y retornamos un nuevo objeto unicamente con
  // los datos requerido para nuestro "desarrollador = dev"
  const { password, __v, createdAt, updatedAt, ...cleanedData } = data;
  // {key:"value"}
  return cleanedData;
};

exports.loginProcess = (req, res, next) => {
  passport.authenticate("local", (error, user, errDetails) => {
    if (error) return res.status(500).json({ message: errDetails });
    if (!user || user.status === "Inactive")
      return res
        .status(401)
        .json({
          message:
            "Unauthorized. If you have already created your account, check your email to confirm your account.",
        });

    req.login(user, (error) => {
      if (error) return res.status(500).json({ message: errDetails });
      const usr = clearRes(user.toObject());
      res.status(200).json(usr);
    });
  })(req, res, next);
};

exports.signupProcess = async (req, res) => {
  const { email, password, name, lastname } = req.body;

  if (email === "" || password === "" || name === "" || lastname === "") {
    res
      .status(400)
      .json({ message: "Indicate email, name, lastname, and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: "The email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const avatar = `https://ui-avatars.com/api/?background=206de8&color=fff&length=2&rounded=true&name=${name}+${lastname}`;
    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = new User({
      email,
      name,
      lastname,
      avatar,
      confirmationCode: token,
      password: hashPass,
    });

    newUser
      .save()
      .then((newUser) => {
        const {
          _doc: { password, ...rest },
        } = newUser;
      })
      .then(() => {
        transporter.sendMail({
          from: '"MicroSchooling" <r.margain.gonzalez@gmail.com>',
          to: email,
          subject: "MicroSchooling: Activate your account",
          html: `<b>click this link to activate your account: <a href="https://schoolmatch.herokuapp.com/confirm/${token}"> click here </a>  </b>`,
        });
      })
      //TODO:
      //Change email link when deployed
      //Beautify email
      .then(() => {
        res.status(200).json({ message: "confirmation email sent", newUser });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err.message });
      });
  });
};

exports.logoutProcess = (req, res) => {
  req.logout();
  res.json({ message: "loggedout" });
};

exports.checkSession = (req, res) => {
  if (req.user) {
    const usr = clearRes(req.user.toObject());
    return res.status(200).json(usr);
  }
  res.status(200).json(null);
};

exports.changeAvatar = async (req, res) => {
  const { avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar } },
    { new: true }
  );

  const {
    _doc: { password, ...rest },
  } = user;

  res.status(200).json(rest);
};

exports.confirmationProcess = async (req, res, next) => {
  const { confirmationCode } = req.params;
  const user = await User.findOneAndUpdate(
    { confirmationCode: confirmationCode },
    { status: "Active" },
    { new: true }
  );

  const usr = clearRes(user.toObject());
  res.status(200).json(usr);
};
