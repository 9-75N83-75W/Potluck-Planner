// UserBanner.jsx
import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import axios from "axios";
import NavBar from "./NavBar";

// helper function: random pastel color
function getRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
}

export default function UserBanner() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Parse the stored user object
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;

        const token = storedUser.accessToken;
        const userId = storedUser.id;

        if (!token || !userId) return;

        const res = await axios.get(`http://localhost:4000/api/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data); // getUserProfile sends full user object
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return null; // wait until loaded

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

return (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between", // 👈 pushes NavBar to the far right
      padding: "20px 24px",
      margin: "16px",
      backgroundColor: "#8B7E96",
      borderRadius: "16px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    }}
  >
    {/* Left side: Avatar + Greeting */}
    <div style={{ display: "flex", alignItems: "center" }}>
      <Avatar
        style={{
          backgroundColor: getRandomPastelColor(),
          width: "56px",
          height: "56px",
          fontSize: "20px",
          fontWeight: "bold",
          marginRight: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {initials}
      </Avatar>

      <h1
        style={{
          margin: 0,
          fontSize: "2rem",
          color: "#F2F0EF",
        }}
      >
        {user.firstName} {user.lastName}
      </h1>
    </div>

    {/* Right side: NavBar */}
    <NavBar />
  </div>
)};
