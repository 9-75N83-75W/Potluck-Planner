// imports
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({

    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    phone: { type: String},
    //phone: { type: String, match: /^[0-9]{10}$/ }
    password: { type: String, required: true},
    profilePicture: { type: String},

    airborneAllergies: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodConstraint" }],
    dietaryAllergies: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodConstraint" }],
    dietaryRestrictions: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodConstraint" }],
    preferenceDislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodConstraint" }],
    preferenceLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodConstraint" }],


    createdAt: { type: Date, default: Date.now },

    refreshToken: { type: String, default: null }

})


export default mongoose.model('User',UserSchema);