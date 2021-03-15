const isLoggedIn = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.redirect("/users/login");
};

module.exports = isLoggedIn;
