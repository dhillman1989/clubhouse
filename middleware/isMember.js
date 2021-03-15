const isLoggedIn = (req, res, next) => {
  if (req.user && req.user.isMember) {
    return next();
  }
  return res.redirect("/users/login");
};

module.exports = isLoggedIn;
