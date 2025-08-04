import Events from "../models/Events.js";
import Event from "../models/Events.js";

//create an event
export const createEvent=async(req,res)=>{
    try {
        //console.log("Incoming request of event",req.body);
        //reminder to use req.query when testing using postmate
        const{eventName,email,dateAndTime,location,description,rsvpdate,members}=req.body;
        if(!eventName){
            return res.status(400).json({message:"Please Name your event"})
        }
        //in the frontend pull email from UserController.js in function specificUser
        //disable in input field and put email as default value
        //needed here for tracking purposes 
        if(!email){
            return res.status(400).json({message:"Please enter your email"})
        }
        if(!dateAndTime){
            return res.status(400).json({message:"Please enter date of event"})
        }
        if(!location){
            return res.status(400).json({message:"Please enter location of event"})
        }
        if(!description){
            return res.status(400).json({message:"Add any other information your guests might need"})
        }
        if(!rsvpdate){
            return res.status(400).json({message:"Provide date by which attendees have to register s'il vouz plait"})
        }
        const newEvent=new Event({
            eventName,
            email,
            dateAndTime,
            location,
            description,
            rsvpdate,
            members:{
                emails: members?.emails||[]
            }
        })
        await newEvent.save()
        
        res.status(200).json({message:"Event Created",event:newEvent});
    } catch (error) {
        console.error("Error:",error);
        res.status(500).json({message:"Internal server Error"});
    }

};
//creator edit capabilities of event
export const editFunction=async(req,res)=>{
    try { 
        const {id}=req.params
        const{eventName,email,dateAndTime,location,description,rsvpdate,members}=req.body;
        if(!eventName){
            return res.status(400).json({message:"Please Name your event"})
        }
        if(!email){
            return res.status(400).json({message:"Please enter your email"})
        }
        if(!dateAndTime){
            return res.status(400).json({message:"Please enter date of event"})
        }
        if(!location){
            return res.status(400).json({message:"Please enter location of event"})
        }
        if(!description){
            return res.status(400).json({message:"Add any other information your guests might need"})
        }
        if(!rsvpdate){
            return res.status(400).json({message:"Provide date by which attendees have to register s'il vouz plait"})
        }
        const updateEvent=await Events.findByIdAndUpdate(
            id,{eventName,dateAndTime,location,description,rsvpdate,members:{
                emails: members?.emails||[]
            }},{new:true}
        )
        if(!updateEvent){
            return res.status(400).json({message:"Event not found"})
        }
        res.status(200).json({message:"Event updated",event:updateEvent});
//add members
    } catch (error){
     console.error("Error:",error);
     res.status(500).json({message:"Internal server Error"});
    }
}

//delete event
export const deleteEvent=async(req,res)=>{
    try { 
        const {id}=req.params
        const deleteEvent=await Event.findByIdAndDelete(id)
    if(!deleteEvent){
        return res.status(400).json({message:"Event was not found"})
    }
    res.status(200).json({message:"Event successfully deleted"});
    } catch(error){
    console.error("Error:",error);
    res.status(500).json({message:"Internal server Error"});    
    }
}

//accept rsvp to event
//once you accept this boolean stored in editfunction above
export const acceptInvite=async(req,res)=>{
    try{
        //maybe have to change id of event to user's email when connecting with frontend
        const {id}=req.params
        const {members}   =req.body
        const editInvites=await Event.findByIdAndUpdate(id,{members:{
                emails: members?.emails||[],
                attending: members?.attending||[]}},{new:true})
    res.status(200).json({message:"Event was accepted",events:editInvites});
    }catch(error){
    console.error("Error",error);
    res.status(500).json({message:"server error event could not be accepted:"});
    }
}

export const countingAttendees=async(req,res)=>{
    try {
        const total=await Event.countDocuments({'members.attending':true})
        res.json({totalAttendance:total})
    } catch (error) {console.error("Error",error);
    res.status(500).json({message:"couldnt count attendees:"});
        
    }
}
//email 
//add more invites
//rsvp
//recipes

