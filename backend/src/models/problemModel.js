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
      enum: ["draft", "published"],
      default: "draft",
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Problem", ProblemSchema);
