import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  console.log("userEmail:", email)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`http://localhost:4000/api/userEvents?email=${email}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }

    fetchEvents();
  }, [email]);

  return (
    <Box sx={{ padding: 2 }}>
      <h2 variant="h5" gutterBottom>
        My Events
      </h2>
      {events.length === 0 && <Typography>No events found</Typography>}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {events.map((event) => (
          <button
            key={event._id}
            variant="contained"
            onClick={() => navigate(`/Event/${event._id}`)}
          >
            {event.eventName}
          </button>
        ))}
      </Box>
    </Box>
  );
}
