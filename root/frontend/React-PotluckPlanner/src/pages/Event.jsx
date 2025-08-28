// imports
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Paper, Stack, Typography, Avatar, AvatarGroup, Box, CircularProgress, Button } from "@mui/material";
import DashboardBanner from "../atoms/DashboardBanner";
import EventCard from "../components/EventCard";
import RecipesForm from "../components/RecipesForm";
import RecipesCards from "../components/RecipesCards";
import EventRecipeCards from "../components/EventRecipeCards";
import AddRecipeButton from "../atoms/AddRecipeButton";
import EventConstraints from "../atoms/EventConstraints";


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
        if (!res.ok) throw new Error(`Failed to fetch event: ${res.status}`);
        const data = await res.json();
        setEventData(data);
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
      setRecipes(data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading event...</Typography>
      </Box>
    );
  }

  if (!eventData) {
    return (
      <div>
        <DashboardBanner />
        <p style={{ padding: "20px" }}>Event not found.</p>
      </div>
    );
  }

  const acceptedGuests = eventData.guests.filter(g => g.status === "accepted");
  const formattedDateTime = new Date(eventData.dateTime).toLocaleString();

  return (
    <div>
      <DashboardBanner />

      <EventCard eventInfo={eventData} guests={acceptedGuests} />
      {/* <EventRecipeCards recipes={recipes} />
      <AddRecipeButton handleOpen={isModalOpen} onClose={handleClose} eventId={id} onRecipeCreated={fetchRecipes}/> */}

      <div style={{ display: "flex", gap: "16px", margin: "16px", alignItems: "stretch" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "30%" }}>
          
          <AddRecipeButton handleOpen={handleOpen} style={{ flex: "0 0 250px" }} />
          
          <EventConstraints eventId={id} />

        </div>
        {/* Add Recipe Button */}
        {/* <AddRecipeButton handleOpen={handleOpen} style={{ flex: "0 0 250px" }} />

        <EventConstraints eventId={id} /> */}

        {/* Recipe Cards */}
        <EventRecipeCards recipes={recipes} style={{ flex: 1 }} />

        {/* Modal Form */}
        <RecipesForm open={isModalOpen} onClose={handleClose} eventId={id} onRecipeCreated={fetchRecipes} />

      </div>


    </div>
  );
}
