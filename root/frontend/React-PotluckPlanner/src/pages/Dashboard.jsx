//imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import NewEventForm from "../components/NewEventForm";
import Invitations from "../components/Invitations"
import AllEvents from "../components/AllEvents";
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
            <NavBar/>
            <div>
                {/* Button to open modal */}
                <button onClick={handleOpen}>
                    Create Event
                </button>

                {/* Modal Form */}
                <NewEventForm open={isModalOpen} onClose={handleClose} />
            </div>
            <div>
                <Invitations/>
            </div>
            <div>
                <AllEvents/>
            </div>
        </div>
        // <div>
        //     <NavBar/>
        //     <div>
        //         <div style={{ margin: "10px", padding: "10px" }}>   
        //             <NewEventForm/>
        //         </div>
        //         <button>

        //         </button>
        //         <h2>Events.</h2>
        //     </div>
        // </div>
    );
};
