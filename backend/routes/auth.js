const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const CustomStore = require('../auth/session')
const asyncHandler = require("express-async-handler");
const protect = require("../middleware/authMiddleware")

const router = express.Router();

//Generate Json Web Token
const generateToken = (id, googleUser) => {
  return jwt.sign({ id, googleUser }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  const token = generateToken(req.user._id, req.user.googleUser);
  // Send http only cookie
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    secure: false,
    sameSite: "Lax",
    path: "/",
  });
  // "http://localhost:5173/"
  res.redirect(`${AUTH_REDIRECT_URL}`);
});

router.get("/logout",(req, res) => {
  req.logout();
  res.clearCookie("token");

  res.status(200).json({ message: "Successfully Logged Out" });
});

router.get("/user", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
