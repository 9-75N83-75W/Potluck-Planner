// imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AcceptedEvents() {

    const [acceptedEvents, setAcceptedEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAcceptedEvents = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (!storedUser) return;

                const token = storedUser.accessToken;

                const res = await axios.get("http://localhost:4000/api/events/accepted", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setAcceptedEvents(res.data.events);
            } catch (err) {
                console.error("Error fetching accepted events:", err);
            }
        };

        fetchAcceptedEvents();
    }, []);

    if (acceptedEvents.length === 0) {
        return <p style={{ margin: "16px" }}>No accepted events found.</p>;
    }

    const maxEventsToShow = 3;
    const maxHeight = acceptedEvents.length > maxEventsToShow ? "330px" : "auto";

    return (
        <div style={{
            height: "100%",
            padding: "26px 30px",
            margin: "16px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
        }}>

            {/* Header */}
            <div style={{ display: "flex", flexDirection: "column", padding: "10px 14px", }}>
              <div style={{ display: "flex", marginLeft: "24px", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ fontSize: "38px", color: "#16a34a" }}>🤝</span>
                <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1f2937", margin: 0 }}>
                    Upcoming Events
                </h2>
                <span style={{ backgroundColor: "#dbeafe", color: "#1e40af", fontSize: "20px", padding: "8px 16px", borderRadius: "25%" }}>
                    {acceptedEvents.length}
                </span>
              </div>
            </div>

            {/* Events list */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px 14px",
                margin: "24px",
                marginTop: "1px",
                gap: "12px",
                maxHeight: maxHeight,
                overflowY: acceptedEvents.length > maxEventsToShow ? "auto" : "visible",
                paddingRight: "4px",
                scrollbarWidth: "thin",
                scrollbarColor: "#94a3b8 #e5e7eb"
            }}
                className="custom-scrollbar"
            >
                {acceptedEvents.map((event) => (
                    <div key={event._id} style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "18px",
                        paddingLeft: "28px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        transition: "background 0.2s"
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
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
                            backgroundColor: "#16a34a",
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
                            onClick={() => navigate(`/Event/${event._id}`)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#15803d"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}
                        >
                            View Event
                        </button>
                    </div>
                ))}
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
        </div>
    );
}
