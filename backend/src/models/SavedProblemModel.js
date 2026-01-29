import mongoose from "mongoose";

const SavedProblemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
  savedAt: { type: Date, default: Date.now }
});

// Ensure a user cannot save the same problem twice
SavedProblemSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export default mongoose.model("SavedProblem", SavedProblemSchema);
