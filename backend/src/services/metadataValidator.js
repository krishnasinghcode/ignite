import Metadata from "../models/metaDataModel.js";

export async function validateMetadata({ category, problemType }) {
  const records = await Metadata.find({
    type: { $in: ["CATEGORY", "PROBLEM_TYPE"] },
    key: { $in: [category, problemType] },
    isActive: true
  }).lean();

  const found = new Set(records.map(r => `${r.type}:${r.key}`));

  if (!found.has(`CATEGORY:${category}`)) {
    const err = new Error(`Invalid category: ${category}`);
    err.statusCode = 400;
    throw err;
  }

  if (!found.has(`PROBLEM_TYPE:${problemType}`)) {
    const err = new Error(`Invalid problemType: ${problemType}`);
    err.statusCode = 400;
    throw err;
  }
}

