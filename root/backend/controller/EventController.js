// imports
import Event from "../models/Event.js";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// Create event
export const createEvent = async (req, res) => {
  try {
    const userId = req.user.id; // get user ID from authenticated token
    const { eventName, description, location, dateTime, rsvpDate, guests } = req.body;

    // Check if guests array exists and is not empty
    if (guests && guests.length > 0) {
      // Iterate through guests and set a default 'invited' status
      guests.forEach(guest => {
          guest.status = "invited";
      });
  }

    const newEvent = new Event({
      eventName,
      host: userId, // set the host to the ID of the logged-in user
      description,
      location,
      dateTime,
      rsvpDate,
      guests,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("host", "firstName lastName email")
      .populate("guests.member", "firstName lastName email")
      .populate("guests.bringing")
      .populate("recipes");

    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("host", "firstName lastName email")
      .populate("guests.member", "firstName lastName email")
      .populate("guests.bringing")
      .populate("recipes");

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        // Check if the authenticated user is the host
        if (event.host.toString() !== req.user.id) {
            return res.status(403).json({ error: "Forbidden: You are not the host of this event" });
        }
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("host")
      .populate("guests.member")
      .populate("guests.bringing")
      .populate("recipes");

    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
  }
  // Check if the authenticated user is the host
  if (event.host.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: You are not the host of this event" });
  }
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
};

// Add guest to event
export const addGuest = async (req, res) => {
  try {
    const { memberId, email } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    event.guests.push({ member: memberId || null, email });
    await event.save();

    res.json({ message: "Guest added successfully", event });
  } catch (err) {
    console.error("Error adding guest:", err);
    res.status(500).json({ error: "Failed to add guest" });
  }
};

// Update guest RSVP
export const updateGuestRSVP = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { status } = req.body; // "accepted" | "declined"

    const event = await Event.findOneAndUpdate(
      { "guests._id": guestId },
      {
        $set: {
          "guests.$.status": status,
          "guests.$.respondedAt": new Date(),
        },
      },
      { new: true }
    ).populate("guests.member");

    if (!event) return res.status(404).json({ error: "Guest not found in event" });

    res.json(event);
  } catch (err) {
    console.error("Error updating RSVP:", err);
    res.status(500).json({ error: "Failed to update RSVP" });
  }
};

// Assign recipe to guest
export const assignRecipeToGuest = async (req, res) => {
  try {
    const { guestId, recipeId } = req.body;

    const event = await Event.findOneAndUpdate(
      { "guests._id": guestId },
      {
        $addToSet: { "guests.$.bringing": recipeId },
        $addToSet: { recipes: recipeId }, // ensure recipe is added to event too
      },
      { new: true }
    )
      .populate("guests.member")
      .populate("guests.bringing")
      .populate("recipes");

    if (!event) return res.status(404).json({ error: "Guest not found in event" });

    res.json({ message: "Recipe assigned to guest", event });
  } catch (err) {
    console.error("Error assigning recipe:", err);
    res.status(500).json({ error: "Failed to assign recipe" });
  }
};

// New function to get events the user is invited to
export const getInvitedEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Find events where the user is listed as a guest either by member ID or email
    const events = await Event.find({
        $or: [
            { "guests.member": userId },
            { "guests.email": user.email }
        ]
    })
    .populate("host", "firstName lastName email")
    .populate("guests.member", "firstName lastName email")
    .populate("guests.bringing")
    .populate("recipes");

    res.json({ events });
  } catch (err) {
    console.error("Error fetching invited events:", err);
    res.status(500).json({ error: "Failed to fetch invited events" });
  }
};
