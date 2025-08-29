// imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box } from "@mui/material";
export default function Invitations({ events, onRSVP }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleRSVP = async (status) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !selectedEvent) return;

      const token = storedUser.accessToken;
      const guest = selectedEvent.guest || [];
      const eventId = selectedEvent._id;

      await axios.put(
        `http://localhost:4000/api/${eventId}/guests/${guest._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Notify Dashboard so it updates state
      onRSVP(eventId, guest._id, status);

      setSelectedEvent(null);
    } catch (err) {
      console.error("Error updating RSVP:", err);
    }
  };

  const maxEventsToShow = 3;
  const maxHeight = events.length > maxEventsToShow ? "330px" : "auto";

    return (
    <div style={{
      height: "90%",
      paddingTop: "28px",
      paddingBottom: "1px",
      padding: "22px",
      margin: "16px",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0"
    }}>

      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", padding: "10px 14px", }}>
        <div style={{ display: "flex", marginLeft: "24px", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <span style={{ fontSize: "38px", color: "#2563eb" }}>📨</span>
          <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1f2937", margin: 0 }}>
            Pending Invitations
          </h2>
          <span style={{ backgroundColor: "#dbeafe", color: "#1e40af", fontSize: "20px", padding: "8px 16px", borderRadius: "25%" }}>
            {events.length}
          </span>
        </div>
      </div>

      {/* Invitations list */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px 14px",
        margin: "24px",
        marginTop: "1px",
        gap: "12px",
        maxHeight: "200px",
        overflowY: events.length > maxEventsToShow ? "auto" : "visible",
        paddingRight: "4px",
        scrollbarWidth: "thin",
        scrollbarColor: "#94a3b8 #e5e7eb"
      }}
        className="custom-scrollbar"
      >
        {events.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No pending invitations.</p>
        ) : (
          events.map(event => (
            <div key={event._id} style={{
              backgroundColor: "#E3EFFF",
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
              onClick={() => setSelectedEvent({ ...event })}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f9fafb"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#E3EFFF"}
            >
              <div style={{ marginRight: "28px" }}>
                <h3 style={{ fontWeight: 500, color: "#1f2937", margin: "0 0 4px 0" }}>
                  {event.eventName}
                </h3>
                <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 2px 0" }}>
                  Hosted by {event.host?.firstName} {event.host?.lastName || ""}
                </p>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                  {new Date(event.dateTime).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <button style={{
                minWidth: "100px",
                backgroundColor: "#2563eb",
                color: "white",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                transition: "background 0.2s",
                flexShrink: 0
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1e40af"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
              >
                Respond
              </button>
            </div>
          ))
        )}
      </div>

      {/* Scrollbar styling */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #e5e7eb;
            border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #94a3b8;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
          }
        `}
      </style>

      {/* Modal */}
      <Modal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
      >
        <Box sx={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: "16px",
          boxShadow: 24,
          p: 4
        }}>
          {selectedEvent && (
            <>
              <h2 id="event-modal-title">{selectedEvent.eventName}</h2>
              <p><strong>Host:</strong> {selectedEvent.host.firstName} {selectedEvent.host.lastName} ({selectedEvent.host.email})</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <p><strong>Date:</strong> {new Date(selectedEvent.dateTime).toLocaleString()}</p>
              <p><strong>RSVP by:</strong> {new Date(selectedEvent.rsvpDate).toLocaleString()}</p>
              <p><strong>Description:</strong> {selectedEvent.description}</p>

              <button onClick={() => handleRSVP("accepted")} style={{
                backgroundColor: "#16a34a",
                color: "white",
                padding: "6px 12px",
                borderRadius: "8px",
                marginRight: "8px",
                border: "none",
                cursor: "pointer"
              }}>
                Accept
              </button>

              <button onClick={() => handleRSVP("declined")} style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}>
                Decline
              </button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
