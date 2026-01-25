import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    // -------- Core identity --------
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    summary: {
      type: String,
      required: true,
      maxlength: 300
    },

    // -------- Flexible author content --------
    content: {
      type: String, // Markdown
      required: true
    },

    // -------- Taxonomy (validated via Metadata) --------
    category: {
      type: String, // e.g. WEB, BLOCKCHAIN
      required: true,
      uppercase: true,
      index: true
    },

    problemType: {
      type: String, // e.g. PROJECT, HACKATHON
      required: true,
      uppercase: true,
      index: true
    },

    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
      index: true
    },

    // -------- Discovery --------
    tags: {
      type: [String],
      index: true
    },

    // -------- Moderation --------
    status: {
      type: String,
      enum: [
        "DRAFT",
        "PENDING_REVIEW",
        "APPROVED",
        "PUBLISHED",
        "REJECTED"
      ],
      default: "DRAFT",
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviewedAt: Date,
    rejectionReason: String,

    deletedAt: {
      type: Date,
      index: true
    }
  },
  { timestamps: true }
);

// Full-text search
ProblemSchema.index(
  {
    title: "text",
    summary: "text",
    content: "text",
    tags: "text"
  },
  {
    weights: {
      title: 10,
      tags: 5,
      summary: 3,
      content: 2
    }
  }
);

export default mongoose.model("Problem", ProblemSchema);
