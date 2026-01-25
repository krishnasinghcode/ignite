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

    techStack: [String],

    // -------- Flexible user content (Markdown) --------
    content: {
      type: String,
      required: true
    },

    // -------- Discovery / moderation --------
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
    },

    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
      }
    ],
    upvoteCount: {
      type: Number,
      default: 0
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
