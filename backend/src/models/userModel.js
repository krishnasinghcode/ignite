import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String },

  authProviders: {
    local: { type: Boolean, default: false },
    google: {
      googleId: { type: String },
      emailVerified: { type: Boolean, default: false }
    }
  },

  isAccountVerified: { type: Boolean, default: false },

  resetOtp: { type: String, default: null },
  resetOtpExpireAt: { type: Date, default: null },
  isResetVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
