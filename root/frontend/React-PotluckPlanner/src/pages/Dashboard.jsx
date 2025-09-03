//imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardBanner from "../atoms/DashboardBanner"
import NewEventForm from "../components/NewEventForm";
import Invitations from "../components/Invitations"
import AcceptedEvents from "../components/AcceptedEvents";
import HostingEvents from "../components/HostingEvents";


export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hostedEvents, setHostedEvents] = useState([]);
    const [invitedEvents, setInvitedEvents] = useState([]);
    const [acceptedEvents, setAcceptedEvents] = useState([]);
  
    const token = JSON.parse(localStorage.getItem("user"))?.accessToken;
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [hostRes, invitedRes, acceptedRes] = await Promise.all([
            axios.get("http://localhost:4000/api/events/hosting", { headers: { Authorization: `Bearer ${token}` } }),
            axios.get("http://localhost:4000/api/events/invited", { headers: { Authorization: `Bearer ${token}` } }),
            axios.get("http://localhost:4000/api/events/accepted", { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          setHostedEvents(hostRes.data.events);
          setInvitedEvents(invitedRes.data.events);
          setAcceptedEvents(acceptedRes.data.events);
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }, [token]);
  
    const handleRSVP = (eventId, guestId, status) => {
      if (status === "accepted") {
        const acceptedEvent = invitedEvents.find(ev => ev._id === eventId);
        if (acceptedEvent) setAcceptedEvents(prev => [...prev, acceptedEvent]);
      }
      setInvitedEvents(prev => prev.filter(ev => ev._id !== eventId));
    };
  
    return (
      <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <DashboardBanner />
  
        {/* Invitations + AcceptedEvents */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: "0 0 49%", minWidth: "320px", maxHeight: "100%", }}>
            <Invitations events={invitedEvents} onRSVP={handleRSVP} />
          </div>
          <div style={{ flex: "0 0 49%", minWidth: "320px", maxHeight: "100%", }}>
            <AcceptedEvents events={acceptedEvents} />
          </div>
        </div>
  
        {/* HostingEvents */}
        <div style={{ width: "100%", marginTop: "32px" }}>
          <HostingEvents
            hostedEvents={hostedEvents}
            isModalOpen={isModalOpen}
            onOpen={() => setIsModalOpen(true)}
            onClose={() => setIsModalOpen(false)}
            onEventCreated={newEvent => setHostedEvents(prev => [...prev, newEvent])}
          />
        </div>
      </div>
    );
  }