const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Guser = require("../models/guserModel");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("User not authorized, please login");
    }

    //Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified.googleUser) {
      const user = await Guser.findById(verified.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }
      req.user = user;
      next();
    } else {
      const user = await User.findById(verified.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

// const protect = asyncHandler(async (req, res, next) => {
//     if (req.session && req.session.userId) {
//         const user = await User.findById(req.session.userId).select("-password");
//         if(user){
//             req.user = user
//             return next();
//         }
//         else{
//             res.status(401)
//             throw new Error("User not found")
//         }
//     } else {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// })

module.exports = protect;
