const express = require("express");
const router = express.Router();
const {
  checkSession,
  loginProcess,
  logoutProcess,
  signupProcess,
  changeAvatar,
  confirmationProcess,
} = require("../controllers/auth.controller");
const { isAuth, catchErrors } = require("../middlewares");

router.post("/login", loginProcess);

router.post("/signup", signupProcess);

router.post("/confirm/:confirmationCode", catchErrors(confirmationProcess));

router.get("/logout", logoutProcess);

router.get("/session", checkSession);

router.post("/avatar/change", isAuth, catchErrors(changeAvatar));

module.exports = router;
