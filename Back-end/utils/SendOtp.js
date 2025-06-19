const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/authModel');

const JWT_SECRET = process.env.JWT_SECRET;
const OTP_EXPIRY_MINUTES = 10;

// Generate a random 6-digit OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this if using another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    // console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

// Request OTP login
const loginWithOtpService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  user.otp = hashedOtp;
  user.otpExpiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  await user.save();

  await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes`);
  return { message: 'OTP sent to email' };
};

// Verify OTP for login
const verifyOtpService = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  if (!user.otp || !user.otpExpiry || Date.now() > user.otpExpiry) throw new Error('OTP expired or missing');

  const isValid = await bcrypt.compare(otp, user.otp);
  if (!isValid) throw new Error('Invalid OTP');

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user };
};

// Forgot password
const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  user.resetPasswordOtp = hashedOtp;
  user.resetPasswordOtpExpiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  await user.save();

  await sendEmail(email, 'Reset Password OTP', `Reset OTP is: ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes`);
  return { message: 'Reset OTP sent to email' };
};

// Reset password
const resetPasswordService = async (email, otp, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiry || Date.now() > user.resetPasswordOtpExpiry)
    throw new Error('Reset OTP expired or missing');

  const isValid = await bcrypt.compare(otp, user.resetPasswordOtp);
  if (!isValid) throw new Error('Invalid OTP');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpiry = undefined;
  await user.save();

  return { message: 'Password reset successfully' };
};

module.exports = {
  loginWithOtpService,
  verifyOtpService,
  forgotPasswordService,
  resetPasswordService,
};
