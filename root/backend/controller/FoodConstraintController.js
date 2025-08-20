// imports
import FoodConstraint from "../models/FoodConstraint.js";

// Create new food constraint
export const createFoodConstraint = async (req, res) => {
  try {
    const { constraint, category } = req.body;

    const newConstraint = new FoodConstraint({ constraint, category });
    await newConstraint.save();

    res.status(201).json({ message: "Food constraint created", constraint: newConstraint });
  } catch (err) {
    console.error("Error creating food constraint:", err);
    res.status(500).json({ error: "Failed to create food constraint" });
  }
};

// Get all food constraints
export const getAllFoodConstraints = async (req, res) => {
  try {
    const constraints = await FoodConstraint.find();
    res.json(constraints);
  } catch (err) {
    console.error("Error fetching food constraints:", err);
    res.status(500).json({ error: "Failed to fetch food constraints" });
  }
};

// Get food constraint by ID
export const getFoodConstraintById = async (req, res) => {
  try {
    const constraint = await FoodConstraint.findById(req.params.id);
    if (!constraint) return res.status(404).json({ error: "Food constraint not found" });

    res.json(constraint);
  } catch (err) {
    console.error("Error fetching food constraint:", err);
    res.status(500).json({ error: "Failed to fetch food constraint" });
  }
};

// Update food constraint
export const updateFoodConstraint = async (req, res) => {
  try {
    const updated = await FoodConstraint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Food constraint not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating food constraint:", err);
    res.status(500).json({ error: "Failed to update food constraint" });
  }
};

// Delete food constraint
export const deleteFoodConstraint = async (req, res) => {
  try {
    const deleted = await FoodConstraint.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Food constraint not found" });

    res.json({ message: "Food constraint deleted" });
  } catch (err) {
    console.error("Error deleting food constraint:", err);
    res.status(500).json({ error: "Failed to delete food constraint" });
  }
};
