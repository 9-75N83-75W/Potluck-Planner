// imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "@mui/material";

export default function EventConstraints({ eventId }) {

  const [constraints, setConstraints] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchConstraints = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.accessToken) {
          throw new Error("User not authenticated. Please log in again.");
        }
        const res = await axios.get(`http://localhost:4000/api/event/${eventId}/constraints`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        setConstraints(res.data);
        console.log("Constraints:", res.data)
      } catch (err) {
        console.error("Error fetching constraints:", err);
      }
    };
    fetchConstraints();
  }, [eventId]);

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

  const renderChips = (items, category) =>
    items.map((item, idx) => (
      <span
        key={idx}
        style={{
          backgroundColor: colors[category],
          color: textColors[category],
          fontSize: "14px",
          fontWeight: 500,
          padding: "6px 12px",
          borderRadius: "20px",
          margin: "4px",
          display: "inline-block",
        }}
      >
        {item}
      </span>
    ));

  return (
    <div
      onClick={() => setIsModalOpen(true)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "24px",
        height: "70%",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
        cursor: "pointer",
        transition: "background 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f9fafb";
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "white";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", }}>
        <span style={{ fontSize: "38px", color: "#1d4ed8" }}>⚠️</span>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1f2937", margin: 0 }}>
          Event Constraints
        </h2>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {constraints?.airborne_allergy &&
          renderChips(constraints.airborne_allergy, "airborne_allergy")}
        {constraints?.dietary_allergy &&
          renderChips(constraints.dietary_allergy, "dietary_allergy")}
        {constraints?.dietary_restriction &&
          renderChips(constraints.dietary_restriction, "dietary_restriction")}
      </div>

      {/* Modal */}
      {/* <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div
            style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // full screen so backdrop works properly
            outline: "none",
            }}
        >
            <div
            style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                maxWidth: "500px",
                width: "90%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()} // prevent clicks inside modal from closing
            >
            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "#1f2937" }}>
                Constraint Categories
            </h2>
            <ul style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
                <li>
                <strong style={{ color: textColors.airborne_allergy }}>Airborne Allergies:</strong>{" "}
                Includes allergies triggered by airborne particles (e.g., peanuts, pollen).
                </li>
                <li>
                <strong style={{ color: textColors.dietary_allergy }}>Dietary Allergies:</strong>{" "}
                Food-specific allergies like dairy, shellfish, or nuts.
                </li>
                <li>
                <strong style={{ color: textColors.dietary_restriction }}>Dietary Restrictions:</strong>{" "}
                Lifestyle/religious restrictions (e.g., vegan, halal, gluten-free).
                </li>
            </ul>
            </div>
        </div>
        </Modal> */}

    </div>
  );
}
