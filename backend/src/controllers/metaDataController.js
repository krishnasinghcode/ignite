import Metadata from "../models/metaDataModel.js";

/**
 * GET /api/metadata
 */
export const getMetadata = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.type) {
      filter.type = req.query.type.toUpperCase();
    }

    const data = await Metadata.find(filter).sort({ order: 1 });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching metadata:", error);
    res.status(500).json({ message: "Failed to fetch metadata" });
  }
};

/**
 * POST /api/metadata
 */
export const createMetadata = async (req, res) => {
  try {
    const { type, key, label, description, order } = req.body;

    if (!type || !key || !label) {
      return res.status(400).json({
        message: "type, key and label are required",
      });
    }

    const exists = await Metadata.findOne({ type, key });
    if (exists) {
      return res.status(409).json({
        message: "Metadata entry already exists",
      });
    }

    const metadata = await Metadata.create({
      type: type.toUpperCase(),
      key,
      label,
      description,
      order,
    });

    res.status(201).json(metadata);
  } catch (error) {
    console.error("Error creating metadata:", error);
    res.status(500).json({ message: "Failed to create metadata" });
  }
};

/**
 * PUT /api/metadata/:id
 */
export const updateMetadata = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Metadata.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Metadata not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating metadata:", error);
    res.status(500).json({ message: "Failed to update metadata" });
  }
};

/**
 * DELETE /api/metadata/:id
 * (Soft delete recommended)
 */
export const deleteMetadata = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Metadata.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Metadata not found" });
    }

    res.status(200).json({ message: "Metadata deactivated successfully" });
  } catch (error) {
    console.error("Error deleting metadata:", error);
    res.status(500).json({ message: "Failed to delete metadata" });
  }
};
