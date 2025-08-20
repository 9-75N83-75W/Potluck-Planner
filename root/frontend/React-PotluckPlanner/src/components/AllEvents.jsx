import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, CircularProgress } from "@mui/material";

/**
 * A React component that fetches and displays a list of all events.
 * This component sends an authorization token with the request to a protected backend route.
 */
const AllEvents = () => {
  // State to store the fetched events
  const [events, setEvents] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for any errors that occur during the fetch
  const [error, setError] = useState(null);

  // Hook for navigating to different routes
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Fetches all events from the backend using the public API endpoint.
     */
    const fetchAllEvents = async () => {
      // Get the JWT token from local storage
      const token = localStorage.getItem("token");

      // Check if a token exists
      if (!token) {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Make the API call to the protected endpoint
        const res = await fetch(`http://localhost:4000/api/allEvents`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // IMPORTANT: Add the Authorization header with the JWT token
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          // If the response is not OK, parse the error and throw it
          const errorData = await res.json();
          throw new Error(errorData.message || res.statusText);
        }

        const data = await res.json();
        setEvents(data); // Update the state with the fetched events
      } catch (err) {
        console.error("Error fetching all events:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchAllEvents();
  }, []); // Empty dependency array means this effect runs once on component mount

  if (loading) {
    // Show a loading spinner while data is being fetched
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading all events...</Typography>
      </Box>
    );
  }

  if (error) {
    // Show an error message if the fetch failed
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Typography>Please ensure you are logged in and your backend is running.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        All Events
      </Typography>
      {events.length === 0 ? (
        <Typography>No events found.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {events.map((event) => (
            <Button
              key={event._id}
              variant="contained"
              onClick={() => navigate(`/Event/${event._id}`)}
              sx={{ py: 1.5, textTransform: 'none', justifyContent: 'flex-start' }}
            >
              {event.eventName}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AllEvents;
