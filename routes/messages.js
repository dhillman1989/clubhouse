const express = require("express");
const router = express.Router();
const passport = require("passport");
const Message = require("../models/Message");
const isLoggedIn = require("../middleware/isLoggedIn");
const isMember = require("../middleware/isMember");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/create", isLoggedIn, isMember, function (req, res, next) {
  res.render("messageform");
});

router.post("/create", isLoggedIn, isMember, async function (req, res, next) {
  const { title, text } = req.body;
  const message = await new Message({
    title,
    text,
    user: req.user,
    date: Date.now(),
  }).save();
  res.send("message posted successfully");
});

module.exports = router;
