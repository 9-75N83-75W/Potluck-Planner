import Events from "../models/Events.js";

//functionalities checked 8.4 createvent,edit,delete,acceptInvite,countingattendees
//create an event
export const createEvent=async(req,res)=>{
    try {
        // console.log(">>> Incoming Event Request");
        // console.log("Headers:", req.headers);
        // console.log("Body:", req.body);
        //reminder to use req.query when testing using postmate
        //format YYYY-MM-DDT15:00:00Z
        const{eventName,email,dateTime,location,description,rsvpDate,members}=req.body;
        if(!eventName){
            return res.status(400).json({message:"Please Name your event"})
        }
        //in the frontend pull email from UserController.js in function specificUser
        //disable in input field and put email as default value
        //needed here for tracking purposes 
        if(!email){
            return res.status(400).json({message:"Please enter your email"})
        }
        if(!dateTime){
            return res.status(400).json({message:"Please enter date of event"})
        }
        if(!location){
            return res.status(400).json({message:"Please enter location of event"})
        }
        if(!description){
            return res.status(400).json({message:"Add description of any other information your guests might need"})
        }
        if(!rsvpDate){
            return res.status(400).json({message:"Provide date by which attendees have to register s'il vouz plait"})
        }
        const newEvent=new Events({
            eventName,
            email,
            dateTime,
            location,
            description,
            rsvpDate,
            members:{
                emails: members?.emails||[]
            }
        })
        await newEvent.save()

        res.status(200).json({message:"Event Created",event:newEvent});
    } catch (error) {
        console.error("Error occurred in createEvent:", error.message);
        console.error("Full error stack:", error.stack);
        res.status(500).json({
            message: "Internal server Error 51",
            error: error.message // Remove this in production
        });
    }
};
//creator edit capabilities of event
export const editFunction=async(req,res)=>{
    try { 
        const {id}=req.params
        const{eventName,email,dateTime,location,description,rsvpDate,members}=req.body;
        if(!eventName){
            return res.status(400).json({message:"Please Name your event"})
        }
        if(!email){
            return res.status(400).json({message:"Please enter your email"})
        }
        if(!dateTime){
            return res.status(400).json({message:"Please enter date of event"})
        }
        if(!location){
            return res.status(400).json({message:"Please enter location of event"})
        }
        if(!description){
            return res.status(400).json({message:"Add any other information your guests might need"})
        }
        if(!rsvpDate){
            return res.status(400).json({message:"Provide date by which attendees have to register s'il vouz plait"})
        }
        const updateEvent=await Events.findByIdAndUpdate(
            id,{eventName,dateTime,location,description,rsvpDate,members:{
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
     res.status(500).json({message:"Internal server Error 91"});
    }
}

//delete event
export const deleteEvent=async(req,res)=>{
    try { 
        const {id}=req.params
        const deleteEvent=await Events.findByIdAndDelete(id)
    if(!deleteEvent){
        return res.status(400).json({message:"Event was not found"})
    }
    res.status(200).json({message:"Event successfully deleted"});
    } catch(error){
    console.error("Error:",error);
    res.status(500).json({message:"Internal server Error 106"});    
    }
}

//accept rsvp to event
//once you accept this boolean stored in editfunction above
export const acceptInvite=async(req,res)=>{
    try{
        //maybe have to change id of event to user's email when connecting with frontend
        const {id}=req.params
        const {members}=req.body
        if(!members){
            return res.status(400).json({message:"please add email and true or false for attending 124"})}
        const editInvites=await Events.findByIdAndUpdate(id,{members:{
                emails: members?.emails||[],
                //boolean type for attending
                //the "new" below is stating that it is a new doc not a true boolean
                attending: members?.attending||[]}},{new:true})
    res.status(200).json({message:"Event was accepted",events:editInvites});
    }catch(error){
    console.error("Error",error);
    res.status(500).json({message:"server error event could not be accepted:"});
    }
}

export const countingAttendees = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Events.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const count = event.members.attending.filter(attend => attend === true).length;
    res.json({ totalAttendance: count });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "couldn't count attendees" });
  }
};
//email 
//add more invites
//rsvp
//recipes
// Short Term Fix for Ivitations functionality
export const getInvitedEventsByEmail = async (req, res) => {
    try {
      const email = req.query.email;
      if (!email) {
        return res.status(400).json({ message: "Email query parameter is required" });
      }
  
      // Find events where this email is in members.emails
      // and (optionally) has not accepted yet
      const invitedEvents = await Events.find({
        'members.emails': email,
        // if you track RSVP status, you can filter here, e.g. attending not true
        // 'members.attending': { $ne: true }  <-- depends on your data structure
      });
  
      res.status(200).json({ invitedEvents });
    } catch (error) {
      console.error("Error fetching invited events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

// get event by id, with host vs invited status
export const getEventById = async (req, res) => {
    try {
      const { id } = req.params;
      const userEmail = req.query.email; // frontend passes ?email=user@example.com
  
      if (!id) {
        return res.status(400).json({ message: "Event ID is required" });
      }
  
      const event = await Events.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Determine role
      let role = "guest";
      if (userEmail) {
        if (event.email === userEmail) {
          role = "host";
        } else if (event.members?.emails?.some(m => m.email === userEmail)) {
          role = "invited";
        }
      }
  
      res.status(200).json({
        event,
        role
      });
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Server error" });
    }
  };