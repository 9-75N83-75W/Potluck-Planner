//imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardBanner from "../atoms/DashboardBanner"
import NewEventForm from "../components/NewEventForm";
import Invitations from "../components/Invitations"
import AcceptedEvents from "../components/AcceptedEvents";
import HostingEvents from "../components/HostingEvents";
//import SideBar from "../atoms/SideBar";

export default function Dashboard() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    return (

        <div>
            <div>
                <DashboardBanner/>
            </div>

            {/* Invitations + AcceptedEvents side by side */}
            <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", margin: "16px 0", alignItems: "stretch" }}>
                <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", }}>
                    <Invitations/>
                </div>
                <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", }}>
                    <AcceptedEvents/>
                </div>
            </div>
            {/* <div style={{ flex: 1, minWidth: "300px" }}>
                <Invitations/>
            </div>
            <div>
                <AcceptedEvents/>
            </div> */}
            <div>
                <HostingEvents/>
            </div>
        </div>
    );
};
