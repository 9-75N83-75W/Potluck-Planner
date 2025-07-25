import mongoose from 'mongoose';

const EventsSchema=new mongoose.Schema({
    eventName:{type:String,},
    email:{type:String,},
    //for now as we dont have a calendar
    //date time type is inputted in the following format YYYY-MM-DDT15:00:00Z t is for time z is for time zone
    dateAndTime:{type:Date,},
         // attending:{type:Boolean},
    location:{type:String,},
    description:{type:String,},
    rsvpdate:{type:Date,},
    totalAttendance:{type:Number},
    members:{
        emails:{type:String},
        attending:{type:Boolean}
    }

    //confirm RSVP date before 
    //recipe

})

export default mongoose.model('Event',EventsSchema);