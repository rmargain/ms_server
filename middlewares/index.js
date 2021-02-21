
exports.catchErrors = (controller) => (req, res, next) =>
  controller(req, res).catch(next);

exports.isAuth = (req, res, next) => {
  if (!req.isAuthenticated() || req.user.status === 'Inactive') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// exports.checkCredits = (req, res, next) => {
//   if (req.user.credits === 0) {
//     return res.status(401).json({ message: "insufficient credits" });
//   }
// };

// exports.isArtists = (req, res, next) => {
//   // Esta es la alternativa a encadenar los middlewares
//   // if(!req.isAuthenticated){
//   //   return res.status(401).json({ })
//   // }
//   if (!req.user.artist) {
//     return res
//       .status(401)
//       .json({ message: "No puedes crear cosos sin ser artista" });
//   }
//   next();
// };
