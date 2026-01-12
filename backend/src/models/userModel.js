import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: function () {
      return this.authProviders?.local === true;
    }
  },

  authProviders: {
    local: { type: Boolean, default: false },
    google: {
      googleId: { type: String },
      emailVerified: { type: Boolean, default: false }
    }
  },
  
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
    required: true
  },

  isAccountVerified: { type: Boolean, default: false },

  resetOtp: { type: String, default: null },
  resetOtpExpireAt: { type: Date, default: null },
  isResetVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
