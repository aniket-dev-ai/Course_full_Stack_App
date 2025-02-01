const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomUUID();

    const updatedDeatils = await User.findByIdAndUpdate(
      { email: email },
      {
        token: token,
        resetpasswordExpires: Date.now() + 3600000,
      },
      {
        new: true,
      }
    );

    const url =
      req.protocol + "://" + req.get("host") + "/resetPassword/" + token;

    await mailSender({
      email: email,
      subject: `Reset Password Link => ${url}`,
      message: url,
    });

    res.status(200).json({ message: "Email Sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password Do Not Match" });
    }

    const userdetails = await User.findOne({ token: token });
    if (!userdetails) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    if (userdetails.resetpasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Token Expired" });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(
      { token: token },
      {
        password: hashPassword,
        confirmPassword: hashPassword,
        token: "",
        resetpasswordExpires: "",
      },
      { new: true }
    );
    return res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
