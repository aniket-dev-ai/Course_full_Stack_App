const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

//auth

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.query.token ||
      req.headers("Authorization").replace("Bearer ", "");

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.User = decode;
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.User.accoutType !== "Student") {
      return res.status(401).json({ message: "Authorized For Students Only" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.User.accoutType !== "Admin") {
      return res.status(401).json({ message: "Authorized For Admins Only" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

//isInstrutor

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.User.accoutType !== "Instructor") {
      return res
        .status(401)
        .json({ message: "Authorized For Instructors Only" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
