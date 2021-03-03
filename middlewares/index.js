
exports.catchErrors = (controller) => (req, res, next) =>
  controller(req, res).catch(next);

exports.isAuth = (req, res, next) => {
  if (!req.isAuthenticated() || req.user.status === 'Inactive') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};



