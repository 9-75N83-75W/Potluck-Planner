// imports
import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import axios from "axios";
import NavBar from "./NavBar";

function getRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 60%, 75%)`; // slightly dustier pastel
}

export default function DashboardBanner() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;

        const token = storedUser.accessToken;
        const userId = storedUser.id;

        if (!token || !userId) return;

        const res = await axios.get(`http://localhost:4000/api/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "32px 34px",
        margin: "16px",
        backgroundColor: "#8B7069",
        borderRadius: "16px",
        boxShadow: "0 2px 6px #404040", // subtle shadow
        border: "1px solid #8B7069",
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
            fontSize: "38px",       // match AcceptedEvents font size
            fontWeight: 600,
            color: "#F4F1EB",       // dark text like AcceptedEvents
          }}
        >
          {user.firstName} {user.lastName}
        </h1>
      </div>

      {/* Right side: NavBar */}
      <NavBar />
    </div>
  );
}
