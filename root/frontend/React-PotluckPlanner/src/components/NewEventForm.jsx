import * as React from 'react';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Backdrop, Box, Modal, Fade, TextField, Stack, Button, CircularProgress } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function NewEventForm({ open, onClose, onEventCreated }) {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [rsvpDate, setRsvpDate] = useState("");
  const [invitees, setInvitees] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.accessToken) {
        throw new Error("User not authenticated. Please log in again.");
      }

      // Combine date and time into ISO format for backend
      const dateTime = new Date(`${date}T${time}`).toISOString();

      // Split the invitees string into an array of email objects
      const guests = invitees.split(",").map(email => ({
          email: email.trim()
      })).filter(guest => guest.email.length > 0);

      const response = await axios.post("http://localhost:4000/api/createEvent", {
        eventName,
        dateTime,
        location,
        description,
        rsvpDate,
        guests,
      }, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`
        }
      });

      console.log("Event created:", response.data);
      if (onEventCreated) {
        onEventCreated(response.data.event); 
      }
      onClose();

      setEventName("");
      setDate("");
      setTime("");
      setLocation("");
      setDescription("");
      setRsvpDate("");
      setInvitees("");

    } catch (err) {
      console.error("Error creating event:", err.response?.data || err.message);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 4,
          boxShadow: 24,
          borderRadius: 2,
        }}>
          <h2>Create a new event.</h2>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
              <TextField
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <TextField
                type="time"
                label="Time"
                InputLabelProps={{ shrink: true }}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              <TextField
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <TextField
                label="Description"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <TextField
                type="date"
                label="RSVP By"
                InputLabelProps={{ shrink: true }}
                value={rsvpDate}
                onChange={(e) => setRsvpDate(e.target.value)}
                required
              />
              <TextField
                label="Invitees Emails"
                value={invitees}
                onChange={(e) => setInvitees(e.target.value)}
                placeholder='e.g. alice@example.com, john@example.com'
                helperText="Note: Please separate by commas."
              />
              <button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Create Event"}
              </button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  );
}