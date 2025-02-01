const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

async function sendVerification(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "OTP Verification",
      `Your OTP is ${otp}`
    );
    console.log("Mail Successfully Sent ==>", mailResponse);
  } catch (error) {
    console.log(error);
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerification(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
