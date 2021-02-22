const express = require("express");
const router = express.Router();
const { isAuth, catchErrors, isArtists } = require("../middlewares");
const {
  createSchool,
  updateSchoolInfo,
  getAllSchools,
  getAllFilteredSchools,
  getSchool,
  deleteSchool,
  getSchoolsByUser,
  getStudentsBySchool,
} = require("../controllers/school.controllers");
const {
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controllers");
const {
  createStudentApplication,
  getAllStudentApplications,
  getStudentApplicaitonsBySchool,
  getStudentApplicaitonsByStudent,
  getStudentApplicaitonById,
  cancelApplication,
  approveApplication,
} = require("../controllers/studentApplication.controllers");

/* GET home page */
router.get("/", (req, res, next) => {
  res.send("MS API");
});

// // ============School============                             👇
router.post("/school/create", isAuth, catchErrors(createSchool));
router.patch("/school/update/:schoolId", isAuth, catchErrors(updateSchoolInfo));
router.get("/school/all", catchErrors(getAllSchools));
router.get("/school", catchErrors(getSchoolsByUser));
router.get("/school/search", catchErrors(getAllFilteredSchools));
router.get("/school/:schoolId", catchErrors(getSchool));
router.get(
  "/school/:schoolId/strudents",
  isAuth,
  catchErrors(getStudentsBySchool)
);
router.delete("/school/:schoolId", isAuth, catchErrors(deleteSchool));

// // ===========Student===========
router.get("/student", catchErrors(getAllStudents));
router.post("/student", isAuth, catchErrors(createStudent));
router.get("/student/:studentId", catchErrors(getStudentById));
router.patch("/student/:studentId", isAuth, catchErrors(updateStudent));
router.delete("/student/:studentId", isAuth, catchErrors(deleteStudent));

// //===========Student Applications===========
router.post("/application/:schoolId", isAuth, catchErrors(createStudentApplication))
router.get("/application", isAuth, catchErrors(getAllStudentApplications))
router.get("/application/:applicationId", isAuth, catchErrors(getStudentApplicaitonById));
router.get("/application/school/:schoolId", isAuth, catchErrors(getStudentApplicaitonsBySchool))
router.get("/application/student/:studentId", isAuth, catchErrors(getStudentApplicaitonsByStudent))
router.patch("/application/approve/:applicationlId", isAuth, catchErrors(approveApplication))
router.patch("/application/cancel/:applicationlId", isAuth, catchErrors(cancelApplication))
// //===========Messages=========== TODO: Terminar Mensajes.


module.exports = router;
