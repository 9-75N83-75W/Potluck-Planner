// imports
import mongoose from "mongoose";

const FoodConstraintSchema = new mongoose.Schema({

    constraint: {type: String, required: true, unique: true, trim: true },
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

export default mongoose.model("FoodConstraint", FoodConstraintSchema);