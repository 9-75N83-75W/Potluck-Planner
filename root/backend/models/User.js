import mongoose from 'mongoose';

const UserSchema=new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,require:true}
})

export default mongoose.model('User',UserSchema);