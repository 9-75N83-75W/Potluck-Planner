// imports
import mongoose from 'mongoose';

const EventSchema=new mongoose.Schema({

    eventName: { type: String, required: true},
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    description: { type: String },
    location: { type: String },
    dateTime: { type: Date, required: true },
    rsvpDate: { type: Date },

    guests: [
        {
            member: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // registered guest
            email: { type: String }, // fallback for unregistered guests
            status: { type: String, enum: ["invited", "accepted", "declined"], default: "invited" },
            respondedAt: { type: Date },
            bringing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }]
        }
    ],

    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    createdAt: { type: Date, default: Date.now }

});

export default mongoose.model('Event',EventSchema);