const express = require("express");
const router = express.Router();
const uploader = require("../config/cloudinary/cloudinary");
const { isAuth, catchErrors } = require("../middlewares");
const {
  createSchool,
  updateSchoolInfo,
  getAllSchools,
  getAllFilteredSchools,
  getSchool,
  deleteSchool,
  getSchoolsByUser,
  getStudentsBySchool,
  uploadProcess,
  deleteImage,
} = require("../controllers/school.controllers");
const {
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByUser,
} = require("../controllers/student.controllers");
const {
  createStudentApplication,
  getAllStudentApplications,
  getStudentApplicationsBySchool,
  getStudentApplicationsByStudent,
  getStudentApplicationById,
  cancelApplication,
  approveApplication,
  getSchoolUserApplications,
  getAllUserApplications,
} = require("../controllers/studentApplication.controllers");
const {
  createMessage,
  markAsRead,
  deleteMessage,
  getMessagesBySchool,
  getMessagesByApplicant,
  getMessagesByApplication,
  recoverMessage,
} = require("../controllers/message.controllers");

/* GET home page */
router.get("/", (req, res, next) => {
  res.send("index");
});

// // ============School============
router.post("/school/create", isAuth, catchErrors(createSchool));
router.patch("/school/update/:schoolId", isAuth, catchErrors(updateSchoolInfo));
router.get("/school/all", catchErrors(getAllSchools));
router.get("/school", catchErrors(getSchoolsByUser));
router.get("/school/search", catchErrors(getAllFilteredSchools));
router.get("/school/:schoolId", catchErrors(getSchool));
router.get(
  "/school/:schoolId/students",
  isAuth,
  catchErrors(getStudentsBySchool)
);
router.delete("/school/:schoolId", isAuth, catchErrors(deleteSchool));
router.post(
  "/school/upload/:schoolId",
  uploader.single("image"),
  catchErrors(uploadProcess)
);
router.patch("/school/delete/:schoolId", isAuth, catchErrors(deleteImage));

// // ===========Student===========
// router.get("/student", catchErrors(getAllStudents));
router.post("/student/create", isAuth, catchErrors(createStudent));
router.get("/student/:studentId", catchErrors(getStudentById));
router.patch("/student/:studentId", isAuth, catchErrors(updateStudent));
router.delete("/student/:studentId", isAuth, catchErrors(deleteStudent));
router.get("/student", isAuth, catchErrors(getStudentsByUser));

// //===========Student Applications===========
router.post(
  "/application/:schoolId",
  isAuth,
  catchErrors(createStudentApplication)
);
router.get("/application", isAuth, catchErrors(getSchoolUserApplications));
router.get(
  "/application/:applicationId",
  isAuth,
  catchErrors(getStudentApplicationById)
);
router.get(
  "/application/user/:userId",
  isAuth,
  catchErrors(getAllUserApplications)
);
router.get(
  "/application/school/:schoolId",
  isAuth,
  catchErrors(getStudentApplicationsBySchool)
);
router.get(
  "/application/student/:studentId",
  isAuth,
  catchErrors(getStudentApplicationsByStudent)
);
router.patch(
  "/application/approve/:applicationId",
  isAuth,
  catchErrors(approveApplication)
);
router.patch(
  "/application/cancel/:applicationId",
  isAuth,
  catchErrors(cancelApplication)
);

// //===========Messages=========== TODO: Terminar Mensajes.

router.post(
  "/message/create/:applicationId",
  isAuth,
  catchErrors(createMessage)
);
router.patch("/message/read/:messageId", isAuth, catchErrors(markAsRead));
router.patch("/message/delete/:messageId", isAuth, catchErrors(deleteMessage));
router.patch(
  "/message/recover/:messageId",
  isAuth,
  catchErrors(recoverMessage)
);
router.get(
  "/message/school/:schoolId",
  isAuth,
  catchErrors(getMessagesBySchool)
);
router.get("/message/applicant", isAuth, catchErrors(getMessagesByApplicant));
router.get(
  "/message/application/:applicationId",
  isAuth,
  catchErrors(getMessagesByApplication)
);

module.exports = router;
