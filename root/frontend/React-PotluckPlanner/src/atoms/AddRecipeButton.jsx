import React from "react";

export default function AddRecipeButton({ handleOpen }) {
  return (
    <div
      onClick={handleOpen}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "30%",
        padding: "24px",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
        cursor: "pointer",
        transition: "background 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f3f4f6";
        e.currentTarget.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "white";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span style={{ fontSize: "48px", color: "#1d4ed8", marginBottom: "12px" }}>🍽️</span>
      <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1f2937", textAlign: "center" }}>
        Add a Recipe
      </h2>
    </div>
  );
}
