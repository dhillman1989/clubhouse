const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.send("you dont have the correct permissions");
};

module.exports = isAdmin;
