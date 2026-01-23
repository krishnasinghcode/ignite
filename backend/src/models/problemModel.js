import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
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

    description: {
      type: String,
      required: true
    },

    context: {
      type: String
    },

    objectives: [
      {
        type: String
      }
    ],

    constraints: [
      {
        type: String
      }
    ],

    assumptions: [
      {
        type: String
      }
    ],

    domain: {
      type: String,
      enum: ["Web", "Backend", "AI", "Systems"],
      index: true
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      index: true
    },

    tags: {
      type: [String],
      index: true
    },

    expectedDeliverables: [String],

    evaluationCriteria: [String],

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

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviewedAt: Date,
    rejectionReason: String,


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    deletedAt: {
      type: Date,
      index: true
    }
  },
  { timestamps: true }
);

ProblemSchema.index(
  {
    title: "text",
    summary: "text",
    tags: "text",
  },
  {
    weights: {
      title: 10,
      tags: 5,
      summary: 2,
    },
    name: "ProblemTextIndex",
  }
);

export default mongoose.model("Problem", ProblemSchema);
