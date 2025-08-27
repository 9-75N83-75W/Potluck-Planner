import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Stack, Avatar, AvatarGroup, Typography, Paper, Box, CircularProgress } from "@mui/material";
import DashboardBanner from "../atoms/DashboardBanner"
import RecipesForm from "../components/RecipesForm";
import RecipesCards from "../components/RecipesCards";

export default function Event() {

  const { id } = useParams();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [recipes, setRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`http://localhost:4000/api/event/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch event: ${res.status}`);
        }
        const data = await res.json();
        setEventData(data); // The event data is the top-level object, not data.event
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const fetchRecipes = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/${id}/recipes`);
      if (!res.ok) throw new Error(`Failed to fetch recipes: ${res.status}`);
      const data = await res.json();
      setRecipes(data); // update state with recipes returned from backend

    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading event...</Typography>
      </Box>
    );
  }

  if (!eventData) {
    return (
      <div>
        <DashboardBanner/>
        <p style={{ padding: "20px" }}>Event not found.</p>
      </div>
    );
  }

  // Filter for accepted guests
  const acceptedGuests = eventData.guests.filter(guest => guest.status === "accepted");
  
  // Format the date and time
  const formattedDateTime = new Date(eventData.dateTime).toLocaleString();

  return (
    <div>
      <DashboardBanner/>
      <Paper elevation={6} sx={{ p: 3, maxWidth: 800, mx: "auto", mt: 5 }}>
        <h1>{eventData.eventName}</h1>
        <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="body1">
            <strong>Host:</strong> {eventData.host.firstName} {eventData.host.lastName} ({eventData.host.email})
          </Typography>
          <Typography variant="body1">
            <strong>Date & Time:</strong> {formattedDateTime}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {eventData.location}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {eventData.description}
          </Typography>
          <Typography variant="body1">
            <strong>RSVP By:</strong> {new Date(eventData.rsvpDate).toLocaleDateString()}
          </Typography>
        </Stack>
        
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">Attendees ({acceptedGuests.length})</Typography>
          <AvatarGroup max={4}>
            {acceptedGuests.map((guest, index) => (
              <Avatar 
                key={index} 
                alt={guest.member ? `${guest.member.firstName} ${guest.member.lastName}` : guest.email}
                // You can replace this with a better way to get initials or an image
                src={`https://placehold.co/40x40/000000/FFFFFF?text=${guest.member ? guest.member.firstName.charAt(0) : guest.email.charAt(0)}`}
              />
            ))}
          </AvatarGroup>
        </Stack>

        <Stack sx={{ mt: 3 }}>
          <Typography variant="h5">Recipes</Typography>
        </Stack>
      </Paper>
      <div>
                {/* Button to open modal */}
                <button onClick={handleOpen}>
                    Create Recipe
                </button>

                {/* Modal Form */}
                <RecipesForm open={isModalOpen} onClose={handleClose} eventId={id} onRecipeCreated={fetchRecipes} />
      </div>
      <div>
        <h2> Recipes </h2>
        <RecipesCards recipes={recipes} />
      </div>
    </div>
  );
}
