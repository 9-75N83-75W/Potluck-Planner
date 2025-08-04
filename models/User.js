import mongoose from 'mongoose';

const UserSchema=new mongoose.Schema({
    name:{type:String,},
    email:{type:String,required:true,unique:true},
    phone:{type:String},
    password:{type:String,required:true},
    profileImage:{
        type:Buffer,
        required:false,},
    allergies:{
        AirborneAllergy:{type:[String],default:[]},
        DietaryAllergy:{type:[String],default:[]},
        DietaryRestrictions:{type:[String],default:[]},
        Preferences:{type:[String],default:[]},
        NoAllergy:{type:[String],default:[]}
        
},
    //multer
//recipes
})


export default mongoose.model('User',UserSchema);