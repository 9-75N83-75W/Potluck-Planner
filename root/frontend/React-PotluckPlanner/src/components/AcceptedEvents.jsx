// imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AcceptedEvents() {

    const [acceptedEvents, setAcceptedEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAcceptedEvents = async () => {
          try {
            // Get stored user and token
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser) return;
    
            const token = storedUser.accessToken;
    
            // Call backend route to get accepted events
            const res = await axios.get("http://localhost:4000/api/events/accepted", {
              headers: { Authorization: `Bearer ${token}` },
            });
    
            setAcceptedEvents(res.data.events); // set events in state
            console.log("Fetched accepted events:", res.data.events);
          } catch (err) {
            console.error("Error fetching accepted events:", err);
          }
        };
    
        fetchAcceptedEvents();
      }, []);
    
      if (acceptedEvents.length === 0) {
        return <p>No accepted events found.</p>;
      }


    return (
        <div style={{ width: "50%", padding: "16px" }} >
            <h1>Events</h1>
            {acceptedEvents.map(event => (
                <button
                    key={event._id}
                    variant="contained"
                    style={{ margin: "8px" }}
                    onClick={() => navigate(`/Event/${event._id}`)} // navigate to event page
                >
                {event.eventName}
                </button>
      ))}
        </div>
    )
}