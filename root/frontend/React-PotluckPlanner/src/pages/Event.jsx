// //imports
// import Stack from "@mui/material/Stack";
// import NavBar from "../components/NavBar";
// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import AvatarGroup from '@mui/material/AvatarGroup';
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";

// export default function Event() {
//   const [event, setEvent] = React.useState(null);
//   const [role, setRole] = React.useState("guest");
//   const [loading, setLoading] = React.useState(true);

//   const eventId = window.location.pathname.split("/").pop(); // or use useParams() from react-router
//   console.log('Fetching eventId:', eventId);
//   const userEmail = localStorage.getItem("userEmail"); // Email from local storage
//   console.log(userEmail)

//   React.useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const res = await fetch(`http://localhost:4000/api/events/${eventId}?email=${userEmail}`);
//         const data = await res.json();
//         if (res.ok) {
//           setEvent(data.event);
//           setRole(data.role);
//         } else {
//           console.error(data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching event:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvent();
//   }, [eventId, userEmail]);

//   const handleEditSubmit = async () => {
//     try {
//       const res = await fetch(`http://localhost:4000/api/events/${eventId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(event),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         alert("Event updated successfully");
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error("Error updating event:", error);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!event) return <p>Event not found</p>;

//   return (
//     <div>
//       <NavBar />
//       <div style={{ margin: "10px", padding: "10px" }}>
//         {role === "host" ? (
//           <>
//             <TextField
//               label="Event Name"
//               value={event.eventName}
//               onChange={(e) => setEvent({ ...event, eventName: e.target.value })}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Location"
//               value={event.location}
//               onChange={(e) => setEvent({ ...event, location: e.target.value })}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Date & Time"
//               type="datetime-local"
//               value={event.dateTime}
//               onChange={(e) => setEvent({ ...event, dateTime: e.target.value })}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Description"
//               value={event.description}
//               onChange={(e) => setEvent({ ...event, description: e.target.value })}
//               fullWidth
//               margin="normal"
//               multiline
//             />
//             <Button variant="contained" onClick={handleEditSubmit}>
//               Save Changes
//             </Button>
//           </>
//         ) : (
//           <>
//             <h1>{event.eventName}</h1>
//             <Stack direction="row" spacing={2} alignItems="center">
//               <h2># of Attendees: {event.members?.emails?.length || 0}</h2>
//               <AvatarGroup max={4}>
//                 {event.members?.emails?.map((m, i) => (
//                   <Avatar key={i} alt={m.email} src="/AvatarImages/CrabAvatar.webp" />
//                 ))}
//               </AvatarGroup>
//               <h3>{new Date(event.dateTime).toLocaleString()}</h3>
//               <h3>{event.location}</h3>
//             </Stack>
//             <p>{event.description}</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }





// //imports

// import Stack from "@mui/material/Stack";
// import NavBar from "../components/NavBar";
// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import AvatarGroup from '@mui/material/AvatarGroup';
// import RecipesForm from "../components/RecipesForm";


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

//                 <Stack>
//                     <h1>Recipes</h1>
//                     <RecipesForm/>
//                 </Stack>

//             </div>
//         </div>
//     );
// }

// //---------------------------------

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Stack from "@mui/material/Stack";
// import NavBar from "../components/NavBar";
// import Avatar from "@mui/material/Avatar";
// import AvatarGroup from "@mui/material/AvatarGroup";
// import RecipesForm from "../components/RecipesForm";

// export default function Event() {
//   const { id } = useParams();
//   const [eventData, setEventData] = useState(null);

//   useEffect(() => {
//     async function fetchEvent() {
//       try {
//         const res = await fetch(`http://localhost:4000/api/Event/${id}`);
//         if (!res.ok) throw new Error(`Failed to fetch event: ${res.status}`);
//         const data = await res.json();
//         setEventData(data.event);
//       } catch (error) {
//         console.error("Error fetching event:", error);
//       }
//     }
//     fetchEvent();
//   }, [id]);

//   if (!eventData) {
//     return (
//       <div>
//         <NavBar />
//         <p style={{ padding: "20px" }}>Loading event...</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <NavBar />
//       <div style={{ margin: "10px", padding: "10px" }}>
//         <h1>{eventData.eventName}</h1>
//         <Stack direction="row" alignItems="center">
//           <h2 style={{ margin: "10px" }}># of Attendees</h2>
//           <AvatarGroup max={4} style={{ margin: "10px" }}>
//             {eventData.members?.emails?.map((email, index) => (
//               <Avatar key={index} alt={email} src="/AvatarImages/CrabAvatar.webp" />
//             ))}
//           </AvatarGroup>
//           <h3 style={{ margin: "10px" }}>
//             {new Date(eventData.dateTime).toLocaleDateString()}
//           </h3>
//           <h3 style={{ margin: "10px" }}>{eventData.location}</h3>
//         </Stack>

//         <Stack>
//           <h1>Recipes</h1>
//           <RecipesForm />
//         </Stack>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack, Avatar, AvatarGroup, Button, Typography, Paper, Box, CircularProgress } from "@mui/material";
import NavBar from "../components/NavBar";
import RecipesForm from "../components/RecipesForm";

export default function Event() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`http://localhost:4000/api/event/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch event: ${res.status}`);
        }
        const data = await res.json();
        setEventData(data); // The event data is the top-level object, not data.event
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading event...</Typography>
      </Box>
    );
  }

  if (!eventData) {
    return (
      <div>
        <NavBar />
        <p style={{ padding: "20px" }}>Event not found.</p>
      </div>
    );
  }

  // Filter for accepted guests
  const acceptedGuests = eventData.guests.filter(guest => guest.status === "accepted");
  
  // Format the date and time
  const formattedDateTime = new Date(eventData.dateTime).toLocaleString();

  return (
    <div>
      <NavBar />
      <Paper elevation={6} sx={{ p: 3, maxWidth: 800, mx: "auto", mt: 5 }}>
        <h1>{eventData.eventName}</h1>
        <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="body1">
            <strong>Host:</strong> {eventData.host.firstName} {eventData.host.lastName} ({eventData.host.email})
          </Typography>
          <Typography variant="body1">
            <strong>Date & Time:</strong> {formattedDateTime}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {eventData.location}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {eventData.description}
          </Typography>
          <Typography variant="body1">
            <strong>RSVP By:</strong> {new Date(eventData.rsvpDate).toLocaleDateString()}
          </Typography>
        </Stack>
        
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6">Attendees ({acceptedGuests.length})</Typography>
          <AvatarGroup max={4}>
            {acceptedGuests.map((guest, index) => (
              <Avatar 
                key={index} 
                alt={guest.member ? `${guest.member.firstName} ${guest.member.lastName}` : guest.email}
                // You can replace this with a better way to get initials or an image
                src={`https://placehold.co/40x40/000000/FFFFFF?text=${guest.member ? guest.member.firstName.charAt(0) : guest.email.charAt(0)}`}
              />
            ))}
          </AvatarGroup>
        </Stack>

        <Stack sx={{ mt: 3 }}>
          <Typography variant="h5">Recipes</Typography>
          <RecipesForm />
        </Stack>
      </Paper>
    </div>
  );
}
