var express = require("express");
var router = express.Router();
const Message = require("../models/Message");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const messages = await Message.find().populate("user");
  res.render("index", { title: "ClubHouse", messages });
});

module.exports = router;
