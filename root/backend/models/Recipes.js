import mongoose from "mongoose";

//updated the format of questions
const RecipesSchema=new mongoose.Schema({
    email:{type:String,require:true},
    recipeName:{type:String,require:true},
    description:{type:String,require:true},
    questions:{
        AirborneQuestion:{AirQuestion: {type:[String],default:[],require:true},AirAnswer:{type:[String],default:[],require:true}},
        DietaryQuestion:{DietaryQuestion: {type:[String],default:[],require:true},DietaryAnswer:{type:[String],default:[],require:true}},    
        DietaryRestrictionsQuestion:{DRQuestion: {type:[String],default:[],require:true},DRAnswer:{type:[String],default:[],require:true}},
        PreferencesQuestion:{PreferencesQuestion: {type:[String],default:[],require:true},PreferencesAnswer:{type:[String],default:[],require:true}},
    }
})


export default mongoose.model('Recipes',RecipesSchema);
