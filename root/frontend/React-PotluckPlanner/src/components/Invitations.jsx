// imports
import React, { useEffect, useState } from "react";
import axios from "axios"; // for API calls
import { Button, Modal, Box } from "@mui/material";

export default function Invitations() {

  // State to store all events user is invited to
  const [events, setEvents] = useState([]);
  // Stat to store currently selected event for viewing/updating RSVP
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch invited events when component mounts
  useEffect(() => {
    const fetchInvitedEvents = async () => {
      try {
        
        // Get logged-in user from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return; // exit if user not found

        // JWT token for auth
        const token = storedUser.accessToken;

        // GET request to backend to fetch invited events
        const res = await axios.get(`http://localhost:4000/api/events/invited`, {
          headers: { Authorization: `Bearer ${token}` }, // passing token in headers
        });

        // Save fetched events in state
        setEvents(res.data.events);
        console.log("Fetched invited events:", res.data.events);
      } catch (err) {
        console.error("Error fetching invited events:", err);
      }
    };
    // calling async function
    fetchInvitedEvents();
  }, []); // empty dependency array -> runs once on mount


  // Function to handle RSVP (accept/decline)
  const handleRSVP = async (status) => {
    try {

      // Get logged-in user from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !selectedEvent) return; // exit if no user or no selected event

      // Checkpoint
      // console.log("Stored User:", storedUser);
      // console.log("Selected Event:", selectedEvent);

      // JWT token for auth
      const token = storedUser.accessToken;

      // Get guest & event object for this user from the selected event
      const guest = selectedEvent.guest || [];
      const eventId = selectedEvent._id;

      // Checkpoint
      console.log("Event ID:", eventId);
      console.log("Guest:", guest);
      console.log("Guest ID:", guest._id);
  
      // PUT request to backend to update RSVP status for this guest
      const res = await axios.put(
        `http://localhost:4000/api/${eventId}/guests/${guest._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } } // pass auth token
      );
  
      // Checkpoint for RSVP update
      console.log("RSVP updated:", res.data);

      setSelectedEvent(null); // closes modal after RSVP
      // After RSVP success:
      setEvents(prev =>
        prev.filter(ev => {
          const currentGuest = ev.guests?.find(g => g._id === guest._id);
          return currentGuest?.status === "invited"; // keep only still-invited events
        })
      );

    } catch (err) {
      console.error("Error updating RSVP:", err);
    }
  };
  

  return (

    <div style={{ width: "50%", padding: "16px" }}>

      <h1>Invitations</h1>

      {/* If there are no events, display no events message. */}
      {events.length === 0 ? (
        <p>No events found.</p>

      ) : (
        // Otherwise, render a button for each event
        events.map(event => (
          <button
            key={event._id}
            variant="contained"
            style={{ margin: "8px" }}
            onClick={() =>
              setSelectedEvent({
                ...event, // set the clicked event as selected
              })
            }
          >
            {event.eventName} {/*Button label */}
          </button>
        ))
      )}

      {/* Modal to show Selected event details */}
      <Modal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
      >
        <Box
          sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, bgcolor: "background.paper", border: "2px solid #000", boxShadow: 24, p: 4, }}
        >
          {selectedEvent && (
            <>
              <h2 id="event-modal-title">{selectedEvent.eventName}</h2>
              <p>
                <strong>Host:</strong>{" "}
                {selectedEvent.host.firstName} {selectedEvent.host.lastName} (
                {selectedEvent.host.email})
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.dateTime).toLocaleString()}
              </p>
              <p>
                <strong>RSVP by:</strong>{" "}
                {new Date(selectedEvent.rsvpDate).toLocaleString()}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>

              <button variant="contained" color="success" onClick={() => handleRSVP("accepted")}>
                Accept
              </button>

              <button variant="contained" color="error" onClick={() => handleRSVP("declined")}>
                Decline
              </button>


              
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
