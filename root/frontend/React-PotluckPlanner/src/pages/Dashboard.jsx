import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import NewEventForm from "../components/NewEventForm";
//import SideBar from "../atoms/SideBar";

export default function Dashboard() {

    const nav = useNavigate();

    // Navigation with 'path' variable passed
    const navigate= (path)=> {
      nav(path);
    };

    return (
        <div>
            <NavBar/>
            <div>
                <div style={{ margin: "10px", padding: "10px" }}>   
                    <NewEventForm/>
                </div>
                <h2>Events.</h2>
            </div>
        </div>
    );
};
