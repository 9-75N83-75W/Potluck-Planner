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


// --------------------------------------------------------------------------------------------------------------------


// Short Term Fix for invitations functionality
// defining async function, req (incoming HTTP request) res (outgoing HTTP response)
export const getInvitedEventsByEmail = async (req, res) => {
    try {
      // looks for email in query string part of request URL
      const email = req.query.email;
      // if no email is found, it responds with 400 Bad request and stops
      if (!email) {
        return res.status(400).json({ message: "Email query parameter is required" });
      }
  
      // events is MongoDB/Mongoose model for events
      // searches for all events where inside the members array, there's an emails field that contains userEmail
      const invitedEvents = await Events.find({
        // looking inside each member object for emails property
        'members.emails': email,
      });

      // returns array of found events in JSON
      res.status(200).json({ invitedEvents });
      // if DB query or anything else fails, it sends a 500 server error
    } catch (error) {
      console.error("Error fetching invited events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

//   export const acceptInviteNew = async (req, res) => {
//     try {
//       // Get event ID from URL params
//       const { id } = req.params;
  
//       // Extract members object from request body, expected format:
//       // { members: { emails: [ { email: 'user@example.com', attending: true/false }, ... ] } }
//       const { members } = req.body;
  
//       // Validate input - must have members with emails array
//       if (!members || !Array.isArray(members.emails)) {
//         return res.status(400).json({ message: "Please provide members.emails as an array" });
//       }
  
//       // Find the event by ID and update the members.emails array
//       // Set { new: true } to return the updated document after update
//       const updatedEvent = await Events.findByIdAndUpdate(
//         id,
//         { "members.emails": members.emails },
//         { new: true }
//       );
  
//       // If event not found, return 404
//       if (!updatedEvent) {
//         return res.status(404).json({ message: "Event not found" });
//       }
  
//       // Respond with success message and updated event
//       res.status(200).json({ message: "RSVP updated successfully", event: updatedEvent });
  
//     } catch (error) {
//       console.error("Error in acceptInvite:", error);
//       res.status(500).json({ message: "Server error: could not update RSVP" });
//     }
//   };
  
  export const acceptInviteNew = async (req, res) => {
    try {
      const { id } = req.params; // event ID from URL
      const { email, attending } = req.body; // email of the invitee and whether they are attending (true/false)
  
      if (!email || typeof attending !== "boolean") {
        return res.status(400).json({ message: "Email and attending (true/false) are required" });
      }
  
      // Find event by ID
      const event = await Events.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if members exist and emails array exists
      if (!event.members || !Array.isArray(event.members.emails)) {
        return res.status(400).json({ message: "Event members data malformed" });
      }
  
      // Find the index of the email in members.emails
      const index = event.members.emails.indexOf(email);
      if (index === -1) {
        return res.status(404).json({ message: "Email not invited to this event" });
      }
      
      console.log("Before update:", event.members.emails, event.members.attending);
      if (!Array.isArray(event.members.attending)) {
        event.members.attending = [];
      }
      
      // Make sure attending array is same length as emails
      while (event.members.attending.length < event.members.emails.length) {
        event.members.attending.push(false); // default no response
      }
      
    //   // Update the attending array at the same index
    //   event.members.attending[index] = attending;

      // Use set() to be safe
      event.members.attending.set(index, attending);


      // Inform Mongoose about the nested array update (sometimes needed)
      event.markModified('members.attending');

      console.log("Saving event with attending:", event.members.attending);

  
      // Save updated event
      // const updatedEvent = await event.save();
      await event.save();

      // Double-check save by refetching:
      const updated = await Events.findById(id);
      console.log("Saved attending:", updated.members.attending);

  
      res.status(200).json({ message: "Invite updated successfully", updatedEvent: event });
    } catch (error) {
      console.error("Error accepting invite:", error);
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
        console.log({message: "id:" , id})
        return res.status(404).json({ message: "Event not found" });
      }
  
      // // Determine role
      // let role = "guest";
      // if (userEmail) {
      //   if (event.email === userEmail) {
      //     role = "host";
      //   } else if (event.members?.emails?.some(email => email === userEmail)) {
      //     role = "invited";
      //   }
      // }
  
      res.status(200).json({
        event,
        invitedEmails: event.members?.emails || []
      });
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  export const getUserEvents = async (req, res) => {
    try {
      const userEmail = req.query.email; // from frontend
      if (!userEmail) return res.status(400).json({ message: "Email is required" });
  
      // Find events where either owner email matches or members.emails contains the user email
      const events = await Events.find({
        $or: [
          { email: userEmail },
          { "members.emails": userEmail }
        ]
      })
  
      res.status(200).json(events);
    } catch (err) {
      console.error("Error fetching events:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };