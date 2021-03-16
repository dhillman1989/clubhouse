const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/signup", (req, res, next) => {
  res.render("signupform");
});

router.post("/signup", async (req, res, next) => {
  const { username, password, confirmPassword } = req.body;
  const user = await User.findOne({ username });
  if (!username || !password || !confirmPassword) {
    return res.send("please provide all details");
  } else if (password !== confirmPassword) {
    return res.send("passwords must match");
  } else if (user) {
    return res.send("User already exits");
  }
  const cleanUsername = username.trim().toLowerCase();
  bcrypt.hash(password, 8, async function (err, hash) {
    const user = await new User({
      username: cleanUsername,
      password: hash,
    }).save();
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("loginform");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/signup",
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
