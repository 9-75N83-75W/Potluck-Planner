//imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardBanner from "../atoms/DashboardBanner"
import NewEventForm from "../components/NewEventForm";
import Invitations from "../components/Invitations"
import AcceptedEvents from "../components/AcceptedEvents";
//import SideBar from "../atoms/SideBar";

export default function Dashboard() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    // const nav = useNavigate();

    // // Navigation with 'path' variable passed
    // const navigate= (path)=> {
    //   nav(path);
    // };

    return (

        <div>
            <div>
                <DashboardBanner/>
            </div>
            <div>
                <Invitations/>
            </div>
            <div>
                <AcceptedEvents/>
            </div>
            <div>
                {/* Button to open modal */}
                <button onClick={handleOpen}>
                    Create Event
                </button>

                {/* Modal Form */}
                <NewEventForm open={isModalOpen} onClose={handleClose} />
            </div>
        </div>
    );
};
