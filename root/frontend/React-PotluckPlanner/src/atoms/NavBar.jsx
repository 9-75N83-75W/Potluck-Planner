import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return;
  
      const refreshToken = storedUser.refreshToken;
      const accessToken = storedUser.accessToken;
  
      await axios.post("http://localhost:4000/api/logout", { token: accessToken });
  
      // Clear local storage and navigate to login
      localStorage.clear();
      navigate("/SignIn");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F2F0EF",
        borderRadius: "24px",
        margin: "16px",
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        boxShadow: "0 6px 20px rgba(0,0,0,0.16)",
        backdropFilter: "blur(6px)",
      }}
    >
      <IconButton onClick={handleMenuOpen}>
        <MenuIcon style={{ color: "#8B7E96", fontSize: "28px" }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
