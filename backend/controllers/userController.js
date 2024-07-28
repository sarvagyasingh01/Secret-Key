const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const CustomStore = require("../auth/session");

//Generate Json Web Token
const generateToken = (id, googleUser) => {
  return jwt.sign({ id, googleUser }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//Register User
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  //validation
  if (!email || !username || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must contain at least 6 letters");
  }

  //Check if email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email already used");
  }

  //Create new user
  const user = await User.create({
    email,
    username,
    password,
  });

  //Create jwt token
  const token = generateToken(user._id, user.googleUser);

  // Send http only cookie
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    secure: true,
    sameSite: "None",
    path: "/",
  });

  //Set session id
  // req.session.userId = user._id;

  if (user) {
    const { username, email } = user;
    res.status(201).json({
      username,
      email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  //Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

  //User exisits, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  // req.session.userId = user._id;

  if (user && passwordIsCorrect) {
    const { username, email } = user;

    //Generate token
    const token = generateToken(user._id, user.googleUser);

    // Send http only cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      secure: true,
      sameSite: "None",
      path: "/",
    });

    res.status(200).json({
      username,
      email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//Logout User
const logoutUser = (req, res) => {
  //Expire cookie
  // res.cookie("token", " ", {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + 1000),
  //   sameSite: "None",
  //   secure: true,
  //   path: "/"
  // });

  //Clear cookie
  res.clearCookie("token");
  res.status(200).json({ message: "Successfully Logged Out" });

  // try {
  //   req.session.destroy;
  //   res.clearCookie("connect.sig");
  //   res.status(200).json({ message: "User logged out successfully" });
  // } catch (error) {
  //   res.status(401);
  //   throw new Error("Log Out Unsuccessfull");
  // }
};

//Get User Data
const getUserData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { email, username } = user;
    res.status(200).json({
      email,
      username,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//Get Login Status

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json(false);
  }

  try {
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.json(true);
    }
  } catch (error) {
    console.error("JWT verification failed:", error.message);
  }

  return res.json(false);
  // const id = req.session.userId;
  // const user = await User.findById(id).select("-password");
  // if (user) {
  //   res.json(true);
  // } else {
  //   res.json(false);
  // }
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  await User.findByIdAndDelete({ _id: id });
  res.status(201).json({ message: "User deleted successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserData,
  loginStatus,
  deleteUser,
};
