//imports
import Stack from "@mui/material/Stack";
import NavBar from "../components/NavBar";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Event() {
  const [event, setEvent] = React.useState(null);
  const [role, setRole] = React.useState("guest");
  const [loading, setLoading] = React.useState(true);

  const eventId = window.location.pathname.split("/").pop(); // or use useParams() from react-router
  const userEmail = localStorage.getItem("email"); // Email from local storage

  React.useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/events/${eventId}?email=${userEmail}`);
        const data = await res.json();
        if (res.ok) {
          setEvent(data.event);
          setRole(data.role);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, userEmail]);

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Event updated successfully");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <div>
      <NavBar />
      <div style={{ margin: "10px", padding: "10px" }}>
        {role === "host" ? (
          <>
            <TextField
              label="Event Name"
              value={event.eventName}
              onChange={(e) => setEvent({ ...event, eventName: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date & Time"
              type="datetime-local"
              value={event.dateTime}
              onChange={(e) => setEvent({ ...event, dateTime: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              fullWidth
              margin="normal"
              multiline
            />
            <Button variant="contained" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <h1>{event.eventName}</h1>
            <Stack direction="row" spacing={2} alignItems="center">
              <h2># of Attendees: {event.members?.emails?.length || 0}</h2>
              <AvatarGroup max={4}>
                {event.members?.emails?.map((m, i) => (
                  <Avatar key={i} alt={m.email} src="/AvatarImages/CrabAvatar.webp" />
                ))}
              </AvatarGroup>
              <h3>{new Date(event.dateTime).toLocaleString()}</h3>
              <h3>{event.location}</h3>
            </Stack>
            <p>{event.description}</p>
          </>
        )}
      </div>
    </div>
  );
}





// //imports

// import Stack from "@mui/material/Stack";
// import NavBar from "../components/NavBar";
// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import AvatarGroup from '@mui/material/AvatarGroup';


// export  default function Event () {
//     return (
//         <div>
//             <div>
//                 <NavBar/>
//             </div>
//             <div style={{ margin: "10px", padding: "10px" }}>
//                 <h1>Event Name.</h1>
//                 <Stack direction="row">
//                     <h2 style={{ margin: "10px", padding: "10px" }}> # of Attendees</h2>
//                     <AvatarGroup max={4} style={{ margin: "10px", padding: "10px" }}>
//                         <Avatar alt="Remy Sharp" src="/AvatarImages/CrabAvatar.webp"/>
//                         <Avatar alt="Travis Howard" src="/AvatarImages/CrabAvatar.webp" />
//                         <Avatar alt="Cindy Baker" src="/AvatarImages/CrabAvatar.webp" />
//                         <Avatar alt="Agnes Walker" src="/AvatarImages/CrabAvatar.webp" />
//                         <Avatar alt="Trevor Henderson" src="/AvatarImages/CrabAvatar.webp" />
//                     </AvatarGroup>
//                     <h3 style={{ margin: "10px", padding: "10px" }} >Date</h3>
//                     <h3 style={{ margin: "10px", padding: "10px" }} >Location</h3>
//                 </Stack>

//             </div>
//         </div>
//     );
// }