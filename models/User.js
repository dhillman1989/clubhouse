const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = Schema({
  username: String,
  firstName: String,
  lastName: String,
  password: String,
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
