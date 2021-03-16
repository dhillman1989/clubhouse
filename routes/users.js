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
  const errors = [];
  if (!username || !password || !confirmPassword) {
    errors.push("All fields are required");
  }
  if (password !== confirmPassword) {
    errors.push("Passwords must match");
  }
  if (user) {
    errors.push("A user with this username already exists");
  }
  if (errors.length) {
    res.render("signupform", { errors });
  } else {
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
  }
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
