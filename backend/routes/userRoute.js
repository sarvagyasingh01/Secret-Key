const express = require("express");
const router = express.Router();
const {registerUser, loginUser, logoutUser, getUserData, loginStatus, deleteUser} = require("../controllers/userController")
const protect = require("../middleware/authMiddleware")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser",protect, getUserData);
router.get("/loggedin", loginStatus);
router.delete("/delete",protect, deleteUser);

module.exports = router;