const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, updateProfile, requestOtpLogin, verifyOtpLogin, forgotPassword, resetPassword , checkAuth} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/request-otp-login', requestOtpLogin);
router.post('/verify-otp-login', verifyOtpLogin);
router.post('/forget-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/check-auth', checkAuth);

module.exports = router;
