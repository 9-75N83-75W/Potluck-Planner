// imports
import mongoose from "mongoose";

const FoodConstraintSchema = new mongoose.Schema({

    constraint: {type: String, required: true, trim: true },
    category: { type: String, 
                enum: [ "airborne_allergy",
                        "dietary_allergy",
                        "dietary_restriction",
                        "preference_dislikes",
                        "preference_likes"
                ], 
                required: true
            }
});

// Compound unique index (constraint + category must be unique together)
FoodConstraintSchema.index({ constraint: 1, category: 1 }, { unique: true });

export default mongoose.model("FoodConstraint", FoodConstraintSchema);