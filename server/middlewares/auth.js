const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");
    //  token missing

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token us missing",
      });
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (err) {
      //verification - issue
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// isStudent

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for student",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// isInstuctor


exports.isInstructor = async (req, res, next) => {
    try {
      if (req.user.accountType !== "Instructor") {
        return res.status(401).json({
          success: false,
          message: "This is protected route for instructor",
        });
      }
      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

//   isAdmin


exports.isAdmin = async (req, res, next) => {
    try {
      if (req.user.accountType !== "Admin") {
        return res.status(401).json({
          success: false,
          message: "This is protected route for Admin",
        });
      }
      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
