import express from 'express';
import Otp from '../models/otpModel.js';
import nodemailer from 'nodemailer';
import { authenticateUser } from "../middlewares/authMiddleware.js";

import { 
    signup, 
    login, 
    sendVerificationOTP, 
    verifyAndSignup, 
    sendResetOTP, 
    verifyResetOTP, 
    resetPassword,
    refreshAccessToken,
    logout,
    getProfile
} from '../controllers/authController.js';

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Send Verification OTP
router.post('/send-otp', sendVerificationOTP);

// Verify OTP
router.post('/verify-signup', verifyAndSignup);

// Send Password Reset OTP
router.post('/reset-otp', sendResetOTP);

// Verify Reset OTP
router.post('/verify-reset-otp', verifyResetOTP);

// Reset Password
router.post('/reset-password', resetPassword);

// Refresh Access Token
router.get("/refresh-token", refreshAccessToken);

router.get("/profile", authenticateUser, getProfile);

router.post('/logout', logout);

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.deleteMany({ email }); // Clear old OTPs

  await Otp.create({ email, otp });

  // Send via email (basic example)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your@gmail.com',
      pass: 'your-app-password'
    }
  });

  await transporter.sendMail({
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`,
  });

  res.status(200).json({ message: 'OTP sent' });
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const otpDoc = await Otp.findOne({ email, otp });
  if (!otpDoc) return res.status(400).json({ message: 'Invalid OTP' });

  // Optional: mark email as verified via temp memory or token (skipped for now)
  res.status(200).json({ message: 'OTP verified' });
});
export default router;
