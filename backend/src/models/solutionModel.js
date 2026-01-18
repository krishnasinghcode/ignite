import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true
    },

    repositoryUrl: {
      type: String,
      required: true
    },

    liveDemoUrl: {
      type: String
    },

    writeup: {
      understanding: String,
      approach: String,
      architecture: String,
      tradeoffs: String,
      limitations: String,
      outcome: String
    },

    techStack: [String],

    status: {
      type: String,
      enum: ["SUBMITTED", "APPROVED", "REJECTED"],
      default: "SUBMITTED",
      index: true
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviewedAt: Date,
    rejectionReason: String,

    isPublic: {
      type: Boolean,
      default: true
    }

  },
  { timestamps: true }
);

// Enforce uniqueness
SolutionSchema.index(
  { userId: 1, problemId: 1 },
  { unique: true }
);

export default mongoose.model("Solution", SolutionSchema);
