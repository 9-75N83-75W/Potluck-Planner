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
    res.status(500).json({ error: `Failed to create event: ${err}` });
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
    res.status(500).json({ error: `Failed to fetch events: ${err}` });
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
    res.status(500).json({ error: `Failed to fetch event: ${err}` });
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
    res.status(500).json({ error: `Failed to update event: ${err}` });
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
    res.status(500).json({ error: `Failed to delete event: ${err}` });
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
    res.status(500).json({ error: `Failed to add guest: ${err}` });
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
    res.status(500).json({ error: `Failed to update RSVP: ${err}` });
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
    res.status(500).json({ error: `Failed to assign recipe: ${err}` });
  }
};

export const getInvitedEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find events where user is a guest AND their status is "invited"
    const events = await Event.find({
      $or: [
        { "guests": { $elemMatch: { member: userId, status: "invited" } } },
        { "guests": { $elemMatch: { email: user.email, status: "invited" } } }
      ]
    })
      .populate("host", "firstName lastName email") // only pull host name + email
      .select("eventName host description location dateTime rsvpDate guests"); // only return these fields

    // Format events so host info is included nicely
    const formattedEvents = events.map(event => {
      // find only the guest object for logged-in user
      const guest = event.guests.find(
        g => g.member?.toString() === userId.toString() || g.email === user.email
      );

      return {
        _id: event._id,
        eventName: event.eventName,
        host: {
          firstName: event.host?.firstName || "",
          lastName: event.host?.lastName || "",
          email: event.host?.email || ""
        },
        description: event.description,
        location: event.location,
        dateTime: event.dateTime,
        rsvpDate: event.rsvpDate,
        guest, // include guest _id here
      };
    });

    res.json({ events: formattedEvents });
  } catch (err) {
    console.error("Error fetching invited events:", err);
    res.status(500).json({ error: `Failed to fetch invited events: ${err}` });
  }
};

export const getAcceptedEvents = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user's ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find events where user is a guest AND their status is "accepted"
    const events = await Event.find({
      $or: [
        { "guests": { $elemMatch: { member: userId, status: "accepted" } } },
        { "guests": { $elemMatch: { email: user.email, status: "accepted" } } }
      ]
    }).select("eventName"); // only return eventName and _id by default

    // Optionally, include _id explicitly
    const formattedEvents = events.map(event => ({
      _id: event._id,
      eventName: event.eventName,
    }));

    res.json({ events: formattedEvents });
  } catch (err) {
    console.error("Error fetching accepted events:", err);
    res.status(500).json({ error: `Failed to fetch accepted events: ${err}` });
  }
};


export const getEventConstraints = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // 2. Extract accepted guest emails
    const acceptedEmails = event.guests
      .filter(g => g.status === "accepted" && g.email)
      .map(g => g.email);

    // 3. Retrieve host's email using host ID
    if (event.host) {
      const hostUser = await User.findById(event.host);
      if (hostUser && hostUser.email) {
        acceptedEmails.push(hostUser.email);
      }
    }

    if (acceptedEmails.length === 0) {
      return res.json({ message: "No accepted guests" });
    }

    // 4. Find matching users
    const users = await User.find({ email: { $in: acceptedEmails } })
      .populate("airborneAllergies")
      .populate("dietaryAllergies")
      .populate("dietaryRestrictions")
      .populate("preferenceDislikes")
      .populate("preferenceLikes");

    // 4. Collect constraints into categories
    const collected = {
      airborne_allergy: new Set(),
      dietary_allergy: new Set(),
      dietary_restriction: new Set(),
      preference_dislikes: new Set(),
      preference_likes: new Set()
    };

    users.forEach(user => {
      user.airborneAllergies?.forEach(c => collected.airborne_allergy.add(c.constraint));
      user.dietaryAllergies?.forEach(c => collected.dietary_allergy.add(c.constraint));
      user.dietaryRestrictions?.forEach(c => collected.dietary_restriction.add(c.constraint));
      user.preferenceDislikes?.forEach(c => collected.preference_dislikes.add(c.constraint));
      user.preferenceLikes?.forEach(c => collected.preference_likes.add(c.constraint));
    });

    // 5. Return deduped arrays
    res.json({
      airborne_allergy: [...collected.airborne_allergy],
      dietary_allergy: [...collected.dietary_allergy],
      dietary_restriction: [...collected.dietary_restriction],
      preference_dislikes: [...collected.preference_dislikes],
      preference_likes: [...collected.preference_likes]
    });
  } catch (err) {
    console.error("Error fetching constraints:", err);
    res.status(500).json({ error: "Failed to fetch constraints:", err });
  }
};
