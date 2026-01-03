import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAccountVerified: { type: Boolean, default: false }, // Flag for account verification status
    resetOtp: { type: String, default: "" }, // OTP for password reset
    resetOtpExpireAt: { type: Date, default: Date.now }, // Expiry time for password reset OTP
    isResetVerified: { type: Boolean, default: false }, // Flag for reset OTP verification
});

const User = mongoose.model("User", userSchema);

export default User;
