const User = require('../models/authModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { loginWithOtpService,
  verifyOtpService,
  forgotPasswordService,
  resetPasswordService } = require('../utils/SendOtp');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register user (with extended fields)
const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    dob,
    address,
    availability,
    skills,
    motivation,
    hobbies,
    interests
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
    dob,
    address,
    availability,
    skills,
    motivation,
    hobbies,
    interests
  });

  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    message: 'Registration successful',
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    message: 'Login successful',
  });
});

// Logout user
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) throw new Error('User not found');
  res.json(user);
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new Error('User not found');

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  user.dob = req.body.dob || user.dob;
  user.address = req.body.address || user.address;
  user.availability = req.body.availability || user.availability;
  user.skills = req.body.skills || user.skills;
  user.motivation = req.body.motivation || user.motivation;
  user.hobbies = req.body.hobbies || user.hobbies;
  user.interests = req.body.interests || user.interests;


  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await user.save();

  res.json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    message: 'Profile updated successfully',
  });
});

// Request OTP
const requestOtpLogin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await loginWithOtpService(email);
  res.status(200).json(result);
});

// Verify OTP
const verifyOtpLogin = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const { token, user } = await verifyOtpService(email, otp);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ message: 'OTP login successful', user });
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await forgotPasswordService(email);
  res.status(200).json(result);
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const result = await resetPasswordService(email, otp, newPassword);
  res.status(200).json(result);
});

const checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({ isAuthenticated: false, message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      isAuthenticated: true,
      user: decoded,
    });
  } catch (err) {
    return res.status(200).json({ isAuthenticated: false, message: "Invalid or expired token" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  requestOtpLogin,
  verifyOtpLogin,
  forgotPassword,
  resetPassword,
  checkAuth
};
