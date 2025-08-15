import Recipes from "../models/Recipes.js";

//create a recipe
export const createRecipe=async(req,res)=>{
    try {
        const{email,recipeName,description,questions}=req.body;
        if(!email){
            return res.status(400).json({message:"Please enter your email"})
        }
        if(!recipeName){
            return res.status(400).json({message:"Please enter name of Recipe"})
        }
        if(!description){
            return res.status(400).json({message:"Please enter description of Recipe"})
        }
        if(!questions){
            return res.status(400).json({message:"Please answer questions about allergies"})
        }
        const newRecipe=new Recipes({
            email,
            recipeName,
            description,
            questions: {
                AirborneQuestion: questions?.AirborneQuestion||[],
                DietaryQuestion: questions?.DietaryQuestion||[],
                DietaryRestrictionsQuestion: questions?.DietaryRestrictionsQuestion||[],
                PreferencesQuestion: questions?.PreferencesQuestion||[],
            }
        });
        await newRecipe.save()
        
        res.status(200).json({message:"Recipe Created",Recipes:newRecipe});
    } catch (error) {
        console.error("Error:",error);
        res.status(500).json({message:"Internal server Error"});
    }
    
};

//edit Recipes
export const editRecipes=async(req,res)=>{
    try {
        const {id}=req.params
        const{email,recipeName,description}=req.body;
        if(!email){
            return res.status(400).json({message:"Please enter email"})
        }
        if(!recipeName){
            return res.status(400).json({message:"Please add recipeName"})
        }
        if(!description){
            return res.status(400).json({message:"Please add description of meal"})
        }
        const updateRecipe=await Recipes.findByIdAndUpdate(
            id,{recipeName,description},{new:true}
        )
        if(!updateRecipe){
            return res.status(200).json({message:"Recipe not found"})
        }
        res.status(200).json({message:"Recipes update",event:updateRecipe});
        
    } catch (error) {
        console.error("Error:",error);
        res.status(500).json({message:"Internal server Error"});
    }
}

//delete recipes
export const deleteRecipes=async(req,res)=>{
    try{
        const {id}=req.params
        const deleteRecipes=await Recipes.findByIdAndDelete(id)
    if(!deleteRecipes){
        return res.status(400).json({message:"Recipe was not found"})
    }
    res.status(200).json({message:"Recipe successfully deleted"});
    }catch(error){
    console.error("Error:",error);
    res.status(500).json({message:"Internal server Error"});
    }
}

//------------------------------------------------------------------------------------
// SHORT TERM FIXES
export const getAllRecipes = async (req, res) => {
    try {
      const recipes = await Recipes.find(); // Fetch all recipes
      res.status(200).json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };