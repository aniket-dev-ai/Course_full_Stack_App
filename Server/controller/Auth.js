// const user = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");

//Sent OTP wala controller

exports.sentOtp = async (req, res) => {
  try {
    //fetch email from user ki body
    const { email } = req.body;
    //check if user is present in db
    const checkUserPresent = await User.findOne({ email });
    //if user is  present
    if (checkUserPresent) {
      return res.status(400).json({ message: "User Already Present" });
    }
    //if user is not present
    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      alphabets: false,
    });
    console.log("OTP ==>", otp);

    const result = await OTP.findOne({ otp: otp });

    while (result) {
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        alphabets: false,
      });
      console.log("OTP ==>", otp);

      const result = await OTP.findOne({ otp: otp });
    }

    const OtpPayload = { email, otp };

    const otpSave = await OTP.create(OtpPayload);
    console.log("OTP Saved ==>", otpSave);
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Signup wala controller

exports.signup = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp ||
      !contactNumber
    ) {
      return res.status(400).json({ message: "Please Fill All The Fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password Not Matched" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Present" });
    }

    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("Recent OTP ==>", recentOtp);

    if (recentOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    } else if (recentOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const HashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber,
    });

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: HashedPassword,
      //   confirmPassword: HashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      contactNumber,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstname} ${lastname}`,
    });

    res.status(200).json({ success: true, message: "User Created", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Login wala controller

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please Fill All The Fields" });
    }

    const existing = await User.findOne({ email });

    if (!existing) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existing.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    } else {
      const token = jwt.sign(
        { email: existing.email, role: existing.role, id: existing._id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      existing.token = token;
      existing.password = undefined;

      res
        .cookie("token", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        })
        .status(200)
        .json({ success: true, message: "User Logged In", user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//ChangePassword wala controller

exports.changePassword = async (req, res) => {}