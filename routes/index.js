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
  getSchoolsByUser
} = require("../controllers/school.controllers");
// const {
//   getAllCosos,
//   getCosoById,
//   createCoso,
//   updateCoso,
//   deleteCoso,
// } = require("../controllers/coso");
// const {
//   getColsByUser,
//   getOneCol,
//   createCol,
//   updateCol,
//   addResourceToCol,
//   deleteResourceFromCol,
//   deleteCol,
// } = require("../controllers/collection");
// const {
//   createPreference,
//   createOrder,
//   userOrders,
// } = require("../controllers/order");

/* GET home page */
router.get("/", (req, res, next) => {
  res.send("MS API");
});

// // ============School============
// // verificamos que exista el user
// //                               👇
router.post("/school/create", isAuth, catchErrors(createSchool));
router.patch("/school/update/:schoolId", isAuth, catchErrors(updateSchoolInfo));
router.get("/school/all", catchErrors(getAllSchools));
router.get("/school", catchErrors(getSchoolsByUser));
router.get("/school/search", catchErrors(getAllFilteredSchools));
router.get("/school/:schoolId", catchErrors(getSchool));
router.delete("/school/:schoolId", isAuth, catchErrors(deleteSchool))
// The main difference between the PUT and PATCH method is that the PUT method uses the request URI to supply a modified version of the requested resource which replaces the original version of the resource, whereas the PATCH method supplies a set of instructions to modify the resource.
// router.patch("/school/:artistId/like", isAuth, catchErrors(updateLikes));
// router.patch("/school/:artistId/rating", isAuth, catchErrors(updateRating));
// // Mostrar todos los artistas
// router.get("/school/all", catchErrors(getAllArtists));
// //Mostrar un artista (por su id)
// router.get("/school/:artistId", catchErrors(getArtistsById));

// //===========Cosos===========
// router.get("/coso", catchErrors(getAllCosos));
// router.post("/coso", isAuth, isArtists, catchErrors(createCoso));
// router.get("/coso/:cosoId", catchErrors(getCosoById));
// router.patch("/coso/:cosoId", catchErrors(updateCoso));
// router.delete("/coso/:cosoId", catchErrors(deleteCoso));

// //===========Collections===========
// router.get("/col", isAuth, catchErrors(getColsByUser));
// router.get("/col/:colId", catchErrors(getOneCol));
// router.post("/col", isAuth, catchErrors(createCol));
// router.patch("/col/:colId", catchErrors(updateCol));
// router.patch("/col/:colId/:cosoId", catchErrors(addResourceToCol));
// router.delete("/col/:colId/:cosoId", catchErrors(deleteResourceFromCol));
// router.delete("/col/:colId", catchErrors(deleteCol));

// //===========Orders=========== TODO: Terminar ordenes con MP.

// router.post("/preference", catchErrors(createPreference))
// router.post("/order", isAuth, catchErrors(createOrder))
// router.get("/order", isAuth, catchErrors(userOrders))
// // Generar la preferencia con mercadopago de nuestro carrito
// // uyetrqi8w47
// // Generar la orden (ya pagado)

module.exports = router;
