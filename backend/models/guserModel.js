const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const guserSchema = mongoose.Schema({
  googleUser: { type: Boolean, default: true},
  googleId: { type: String, required: true, unique: true },
  displayName: String,
  username: String,
  lastName: String,
  email: String,
  image: String,
});

const Guser = mongoose.model("GUser", guserSchema);
module.exports = Guser;
