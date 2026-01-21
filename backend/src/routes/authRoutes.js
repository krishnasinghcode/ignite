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
  googleLogin
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

router.post('/logout', authenticateUser, logout);

router.post("/google", googleLogin);

export default router;
