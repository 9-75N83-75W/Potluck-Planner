// imports
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import FoodConstraint from "../models/FoodConstraint.js";

// Create recipe
export const createRecipe = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the authenticated token
    const { recipeName, description, event, foodConstraints } = req.body;

    const newRecipe = new Recipe({
      recipeName,
      description,
      createdBy: userId, // Set the creator to the ID of the logged-in user
      event,
      foodConstraints,
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });
  } catch (err) {
    console.error("Error creating recipe:", err);
    res.status(500).json({ error: `Failed to create recipe: ${err}` });
  }
};

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("createdBy", "firstName lastName email")
      .populate("event", "eventName dateTime location")
      .populate("foodConstraints", "name description");

    res.json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: `Failed to fetch recipes: ${err}` });
  }
};

// Get recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("createdBy", "firstName lastName email")
      .populate("event", "eventName dateTime location")
      .populate("foodConstraints", "name description");

    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err);
    res.status(500).json({ error: `Failed to fetch recipe: ${err}` });
  }
};

// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
    }
    // Check if the authenticated user is the creator
    if (recipe.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: "Forbidden: You are not the creator of this recipe" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("createdBy", "firstName lastName email")
      .populate("event", "eventName dateTime location")
      .populate("foodConstraints", "name description");

    res.json(updatedRecipe);
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(500).json({ error: `Failed to update recipe: ${err}` });
  }
};

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        // Check if the authenticated user is the creator
        if (recipe.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: "Forbidden: You are not the creator of this recipe" });
        }

    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    res.status(500).json({ error: `Failed to delete recipe: ${err}` });
  }
};

// Get all recipes for an event
export const getRecipesByEvent = async (req, res) => {
  try {
    const recipes = await Recipe.find({ event: req.params.eventId })
      .populate("createdBy", "firstName lastName email")
      .populate("foodConstraints", "name description constraint category")

    res.json(recipes);
  } catch (err) {
    console.error("Error fetching event recipes:", err);
    res.status(500).json({ error: `Failed to fetch recipes for event: ${err}` });
  }
};

// Get all recipes by a user
export const getRecipesByUser = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.params.userId })
      .populate("event", "eventName dateTime location")
      .populate("foodConstraints", "name description")
      .populate("foodConstraints", "constraint category");

    res.json(recipes);
  } catch (err) {
    console.error("Error fetching user recipes:", err);
    res.status(500).json({ error: `Failed to fetch recipes by user: ${err}` });
  }
};
