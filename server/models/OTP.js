const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
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
    default: Date.now(),
    expires: 5 * 60,
  },
});

async function sendVerficationEmail(email, otp) {
  try {
    const mailResponse = await mailSender.sendMail(
      email,
      "Verification from study Notion",
      otp
    );
    console.log(mailResponse);
  } catch (err) {
    console.log(err);
  }
}

otpSchema.pre("save", async function (next) {
    await sendVerficationEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model("OTP", otpSchema);
