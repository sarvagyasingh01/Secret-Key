const express = require("express");
const router = express.Router();
const { saveDoc, deleteDoc, getDocs, updateDoc, getDoc, deleteAll } = require("../controllers/docController");
const protect = require("../middleware/authMiddleware");

router.post("/save", protect, saveDoc)
router.delete("/delete/:id",protect, deleteDoc)
router.get("/getall", protect, getDocs)
router.get("/getdoc/:id", protect, getDoc)
router.put("/update/:id", protect, updateDoc)
router.delete("/deleteall",protect, deleteAll)


module.exports = router;