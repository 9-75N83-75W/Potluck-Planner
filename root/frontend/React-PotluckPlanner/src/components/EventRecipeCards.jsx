// imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Modal, Box, Typography } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
  maxWidth: 500,
  width: "90%",
};

const colors = {
  airborne_allergy: "#fee2e2", // light red
  dietary_allergy: "#fef9c3", // light yellow
  dietary_restriction: "#d1fae5", // light green
};

const textColors = {
  airborne_allergy: "#991b1b",
  dietary_allergy: "#92400e",
  dietary_restriction: "#065f46",
};

export default function EventRecipeCards({ recipes }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => setSelectedRecipe(null);

  if (!recipes || recipes.length === 0) {
    return <p style={{ margin: "16px" }}>No recipes found.</p>;
  }

  const renderConstraintChips = (constraints) =>
    constraints?.map((fc, idx) => {
      const category = fc.category; // Make sure your constraint object has a category field
      return (
        <span
          key={idx}
          style={{
            backgroundColor: colors[category] || "#e5e7eb",
            color: textColors[category] || "#1f2937",
            fontSize: "14px",
            fontWeight: 500,
            padding: "6px 12px",
            borderRadius: "20px",
            margin: "4px",
            display: "inline-block",
          }}
        >
          {fc.constraint}
        </span>
      );
    });

  return (
    <div
      style={{
        width: "70%",
        height: "100%",
        padding: "26px 30px",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", padding: "10px 14px" }}>
        <div
          style={{
            display: "flex",
            marginLeft: "24px",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "38px", color: "#f59e0b" }}>🍳</span>
          <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1f2937", margin: 0 }}>
            Recipes
          </h2>
          <span
            style={{
              backgroundColor: "#fef9c3",
              color: "#92400e",
              fontSize: "20px",
              padding: "8px 16px",
              borderRadius: "25%",
            }}
          >
            {recipes.length}
          </span>
        </div>
      </div>

      {/* Recipes list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px 14px",
          margin: "24px",
          marginTop: "1px",
          gap: "12px",
          maxHeight: "330px",
          overflowY: recipes.length > 3 ? "auto" : "visible",
          paddingRight: "4px",
        }}
        className="custom-scrollbar"
      >
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "18px",
              paddingLeft: "28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
          >
            {/* Recipe Info */}
            <div style={{ marginRight: "28px", flex: 1 }}>
              <h3 style={{ fontWeight: 500, color: "#1f2937", margin: "0 0 4px 0" }}>
                {recipe.recipeName}
              </h3>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 6px 0" }}>
                Chef: {recipe.createdBy?.firstName} {recipe.createdBy?.lastName || ""}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {renderConstraintChips(recipe.foodConstraints)}
              </div>
            </div>

            {/* View button */}
            <button
              style={{
                minWidth: "100px",
                backgroundColor: "#f59e0b",
                color: "white",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                transition: "background 0.2s",
                flexShrink: 0,
              }}
              onClick={() => setSelectedRecipe(recipe)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d97706")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f59e0b")}
            >
              View Recipe
            </button>
          </div>
        ))}
      </div>

      {/* Modal for recipe details */}
      <Modal open={!!selectedRecipe} onClose={handleClose}>
        <Box sx={modalStyle}>
          {selectedRecipe && (
            <>
              <Typography variant="h5" gutterBottom>
                {selectedRecipe.recipeName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Chef: {selectedRecipe.createdBy.firstName} {selectedRecipe.createdBy.lastName}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Email: {selectedRecipe.createdBy.email}
              </Typography>
              <Typography variant="body1" sx={{ my: 2 }}>
                {selectedRecipe.description || "No description provided."}
              </Typography>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {renderConstraintChips(selectedRecipe.foodConstraints)}
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
