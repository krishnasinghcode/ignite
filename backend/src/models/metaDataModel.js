import mongoose from "mongoose";

const MetadataSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["CATEGORY", "PROBLEM_TYPE"],
      required: true,
      index: true
    },

    key: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true
    },

    label: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

/**
 * Guarantees:
 * - No duplicate keys per type
 * - CATEGORY:BLOCKCHAIN and PROBLEM_TYPE:BLOCKCHAIN can coexist
 */
MetadataSchema.index(
  { type: 1, key: 1 },
  { unique: true }
);

export default mongoose.model("Metadata", MetadataSchema);
