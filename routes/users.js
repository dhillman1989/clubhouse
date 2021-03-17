const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const isLoggedIn = require("../middleware/isLoggedIn");
const nodemailer = require("nodemailer");

///NODEMAILER SETUP
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/signup", (req, res, next) => {
  res.render("signupform");
});

router.post("/signup", async (req, res, next) => {
  const { username, password, confirmPassword, email } = req.body;
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

      //SEND ACTIVATION EMAIL
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Welcome to the ClubHouse",
        text:
          "Before you can make use of the Clubhouse you will need to activate your account using this secret code: INDACLUB",
        html: `Before you can make use of the Clubhouse you will need to activate your account using this secret code: <h1>${process.env.MEMBERSHIP_CODE}</h1>
          Login and verify your account at <a href="${process.env.PRODUCTION_URL}/users/activate">${process.env.PRODUCTION_URL}/users/activate </a>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

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

router.get("/activate", isLoggedIn, function (req, res) {
  res.render("activateMembership");
});

router.post("/activate", isLoggedIn, async function (req, res) {
  const { code } = req.body;
  if (code.toLowerCase() != process.env.MEMBERSHIP_CODE.toLowerCase()) {
    res.render("activateMembership", { error: "Invalid code" });
  } else {
    await User.findByIdAndUpdate(req.user.id, { isMember: true });
    res.redirect("/users/activate");
  }
});

module.exports = router;
