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
  if (!username || !password || !confirmPassword) {
    return res.send("please provide all details");
  } else if (password !== confirmPassword) {
    return res.send("passwords must match");
  }
  bcrypt.hash(password, 8, async function (err, hash) {
    const user = await new User({ username, password: hash }).save();
    return res.send("registration successful" + user.username);
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
