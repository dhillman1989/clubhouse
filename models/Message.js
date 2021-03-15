const mongoose = require("mongoose");
const { Schema } = mongoose;
const MessageSchema = new Schema({
  title: String,
  text: String,
  date: Date,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Message", MessageSchema);
