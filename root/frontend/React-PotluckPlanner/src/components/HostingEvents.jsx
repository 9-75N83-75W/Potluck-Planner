// imports
import React from "react";
import { useNavigate } from "react-router-dom";
import NewEventForm from "./NewEventForm";

export default function HostingEvents({hostedEvents =[], onOpen, onClose, isModalOpen, onEventCreated}) {

    const navigate = useNavigate();

    const handleOpen = () => onOpen();
    const handleClose = () => onClose();


    return (
        <>
        {/* display: "flex", alignItems: "center", justifyContent: "space-between", */}
        <div style={{ display: "flex", alignItems: "flex-start", padding: "26px 30px", margin: "16px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", gap: "24px" }}>
            {/* Header */}
            <div style={{ display: "flex", flexDirection: "column", padding: "10px 14px", margin: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", }}>
                    <span style={{ fontSize: "38px", marginRight: "8px", color: "#1d4ed8" }}>🏠</span>
                    <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1f2937", margin: 0, }}>
                        Hosting Events
                    </h2>
                    <span style={{ backgroundColor: "#d1fae5", color: "#065f46", fontSize: "20px", padding: "8px 16px", borderRadius: "25%", }}>
                        {hostedEvents.length}
                    </span>
                </div>
                <div>
                    {/* Create Event Button */}
                    <button onClick={handleOpen} style={{ width: "100%", alignSelf: "flex-start", backgroundColor: "#1d4ed8", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 500, transition: "background 0.2s", marginTop: "12px", marginBottom: "12px", }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                    >
                        + Create Event
                    </button>
                    {/* Modal Form */}
                    <NewEventForm open={isModalOpen} onClose={handleClose} onEventCreated={onEventCreated} />
                </div>
            </div>
            
            {/* Events list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width:"100%", padding:"18px" }}>
                {hostedEvents.map((event) => (
                    <div key={event._id} style={{ backgroundColor: "#EEE4FF", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "background 0.2s", }}
                    onMouseEnter = { (e) => (e.currentTarget.style.backgroundColor = "#f9fafb") }
                    onMouseLeave = { (e) => (e.currentTarget.style.backgroundColor = "#EEE4FF") }
                    >
                        <div style={{ margin: "8px", marginRight: "28px", padding: "8px" }}>
                            <h3 style={{ fontWeight: 500, color: "#1f2937", margin: "0 0 4px 0", }}>
                                {event.eventName}
                            </h3>
                            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 2px 0", }}>
                                Location: {event.location}
                            </p>
                            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, }}>
                                {new Date(event.dateTime).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
  
                <button style={{ minWidth: "100px", backgroundColor: "#1d4ed8", color: "white", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 500, transition: "background 0.2s", }}
                onClick={() => navigate(`/Event/${event._id}`)}
                onMouseEnter = { (e) => (e.currentTarget.style.backgroundColor = "#1e40af") }
                onMouseLeave={ (e) => (e.currentTarget.style.backgroundColor = "#1d4ed8") }
                >
                    View Event
                </button>
            </div>
            ))}
        </div>
        </div>
        </>
    );
};