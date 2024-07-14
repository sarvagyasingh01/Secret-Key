const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const docRoute = require("./routes/docRoute");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const session = require('cookie-session');
const passport = require("passport");
require('./auth/passportSetup');
// const CustomStore = require('./auth/session');


const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(session({
//   name: "connect",
//   secret: process.env.SESSION_SECRET, // Change this to your secret
//   resave: false,
//   saveUninitialized: false,
//   store: new CustomStore(),
//   cookie: {
//       maxAge: 1000 * 60 * 60 * 24, // 1 day
//       secure: false, // Set to true in production with HTTPS
//       httpOnly: true,
//   }
// }));
app.use(session({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.SESSION_SECRET]
}));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials:true,
  })
);



//Routes Middleware
app.use("/api/users/", userRoute);
app.use("/api/document", docRoute);

//Routes
app.use('/auth', require('./routes/auth'));

//Error Middleware
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

//Connect to DB ans start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
