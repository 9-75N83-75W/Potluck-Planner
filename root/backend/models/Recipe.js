import mongoose from "mongoose";


const RecipeSchema=new mongoose.Schema({

    recipeName: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    event: { type: mongoose.Schema.Types.ObjectId, ref: "Events" },

    foodConstraints: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodConstraint" }],

    createdAt: { type: Date, default: Date.now }

});


export default mongoose.model('Recipe',RecipeSchema);
