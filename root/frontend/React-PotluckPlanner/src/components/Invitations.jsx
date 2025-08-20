// // imports
// import {useState, useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Paper, Link, Modal, Box, IconButton, Stack, } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";


// // Modal Styling
// const modalStyle = {position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 4, };


// export default function Invitations () {

//     // stores array of invitation objects fetched from backend
//     const [invitations, setInvitations] = useState([]);
//     // stores currently selected inivitation to view details in pop-up
//     const [selectedInvite, setSelectedInvite] = useState(null);
//     // stores whether pop-up is open (true) or closed (false)
//     const [modalOpen, setModalOpen] = useState(false);

//     const [upcomingEvents, setUpcomingEvents] = useState([]);

//     // stores userEmail in local storage
//     const userEmail = localStorage.getItem("userEmail");

//     const navigate = useNavigate();

//     // when userEmail changes...
//     useEffect(() => {
//         // if email is undefined or null, stop
//         if (!userEmail) return;
        
//         // defining async function to get /api/events/invited by passing userEmail
//         const fetchInvitations = async () => {
//             try {

//                 const response = await axios.get(`http://localhost:4000/api/events/invited?email=${encodeURIComponent(userEmail)}`);

//                 // logs invitations returned from backend
//                 console.log("Fetched invitations:", response.data.invitedEvents);
//                 // updates invitations state with backend response or empty array if null or empty
//                 setInvitations(response.data.invitedEvents || []);
//               // if api request fails, error is logged.  
//             } catch (err) {
//                 console.error("Error fetching invitations:", err);
//             }
//         };

//         // calling fetchInvitations function
//         fetchInvitations();
//     }, [userEmail]);


//     // state-handling functions controlling modal (pop-up)
//     // open
//     const handleOpenModal = (event) => {
//         setSelectedInvite(event);
//         setModalOpen(true);
//     };
//     // close
//     const handleCloseModal = () => {
//         setSelectedInvite(null);
//         setModalOpen(false);
//     };

//     // handleResponse function is essentially "accept/decline" invitation logic
//     const handleResponse = async (accepted) => {
//         // if there is no invitation selected in modal, do nothing
//         if (!selectedInvite) return;

//         // creates updated members list
//         try {
//             // // takes existing list of members (selectedInvite.members?.email) and for current user, updates "attending" property to true (if accepted) or false (if declined); everyone else stays same
//             // const updatedMembers = (selectedInvite.members?.email || []).map(member =>
//             //     member.email === userEmail
//             //       ? { ...member, attending: accepted }
//             //       : member
//             //   );

//             // copy current arrays to avoid mutation
//             const emails = [...(selectedInvite.members?.emails || [])];
//             const attending = [...(selectedInvite.members?.attending || [])];

//             // find index of current user email
//             const idx = emails.indexOf(userEmail);

//             if(idx !== -1) {
//                 // user already invites, update attending status
//                 attending[idx] = accepted;
//             } else {
//                 // user not invited yet, add them
//                 emails.push(userEmail);
//                 attending.push(accepted);
//             }
              
//             // // If the user is not already in members, add them with RSVP status
//             // if (!updatedMembers.some( email => email === userEmail)) {
//             //     updatedMembers.push({ email: userEmail, attending: accepted });
//             //   }

//             // makes a put request to api endpoint, passes updated members list so backend can store RSVP status
//             // await axios.put(`http://localhost:4000/api/inviteEvent/${selectedInvite._id}`, { members: { invited: updatedMembers }});

//             // const emails = updatedMembers.map(m => m.email);
//             // const attending = updatedMembers.map(m => m.attending);
//             console.log("Sending update with emails:", emails);
//             console.log("Sending update with attending:", attending);
//             await axios.put(`http://localhost:4000/api/inviteEvent/${selectedInvite._id}`, { members: { emails, attending }});
            


//             // shows a pop-up message confirming "accept" or "decline" action
//             alert(`You have ${accepted ? "accepted" : "declined"} the invitation to ${selectedInvite.eventName}`);

//             // clears selectedInvite and hides modal
//             handleCloseModal();

//             // if accepted, remove event from pending invitations list
//             if (accepted) {
//                 // Remove accepted event from invitations list
//                 setInvitations((prev) => prev.filter((inv) => inv._id != selectedInvite._id));

//                 // Add to upcomingEvents if not already there
//                 setUpcomingEvents(prev => {
//                     if (!prev.find(event => event._id === selectedInvite._id)) {
//                         return [...prev, selectedInvite];
//                     }
//                     return prev;
//                 });
//             } else {
//                 // For declined, we can keep it or remove invitation from display here
//             }
//         }   catch (error) {
//             console.error("Error updating RVSP:", error.response?.data || error.message);
//             alert("Failed to update RSVP. Please try again.");
//         }
//     };

//     // Separate events into upcoming (accepted) and pending invitations
//     const attending = invitations.filter((event) => {
//         const emails = event.members?.emails || [];
//         const attending = event.members?.attending || [];
//         const idx = emails.indexOf(userEmail);
//         return idx !== -1 && attending[idx] === true;
//     });

//     const pendingInvitations = invitations.filter((event) => {
//         const emails = event.members?.emails || [];
//         const attending = event.members?.attending || [];
//         const idx = emails.indexOf(userEmail);
//         return idx !== -1 && attending[idx] !== true;
//     });


//     return (

//         // <div>
//         //     <Paper elevation={6} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 5 }}>

//         //         <h2>Invitations</h2>

//         //         {/* if there are no events in invitations array -> show "no invitations" message */}
//         //         {invitations.length === 0 ? (
//         //             <p>No invitations found. Check back later for more.</p>
//         //         // otherwise...
//         //         ) : (
//         //           // loop through each event in invitations
//         //           invitations.map((event) => {
//         //             // for each event, checks logged-in user's email is in event's invited members list - this is redundant
//         //             const isInvited = event.members?.emails?.some(memberEmail => {
//         //                 console.log("Checking member email:", memberEmail, "against userEmail:", userEmail);
//         //                 return memberEmail === userEmail;
//         //               });
//         //               console.log("isInvited?", isInvited);
//         //             //   if (!isInvited) return null;


//         //             return (
//         //                 <h3 key={event._id}>
//         //                     <Link component="button" variant="body1" onClick={() => handleOpenModal(event)}>
//         //                         Invited ({event.eventName})
//         //                     </Link>
//         //                 </h3>
//         //             );
//         //           })
//         //         )}

//         //         <Modal open={modalOpen} onClose={handleCloseModal}>
//         //             <Box sx={modalStyle}>
//         //                 <Stack direction="row" justifyContent="space-between" alignItems="center">
//         //                     <h3>{selectedInvite?.eventName}</h3>
//         //                     <IconButton onClick={handleCloseModal} size="small" aria-label="close">
//         //                         <CloseIcon/>
//         //                     </IconButton>
//         //                 </Stack>

//         //                 <p>
//         //                     <strong>Date & Time:</strong>{" "}
//         //                     {new Date(selectedInvite?.dateTime).toLocaleString()}
//         //                 </p>
//         //                 <p>
//         //                     <strong>Location:</strong>{selectedInvite?.location}
//         //                 </p>
//         //                 <p>
//         //                     <strong>Description:</strong>{selectedInvite?.description}
//         //                 </p>
//         //                 <p>
//         //                     <strong>RSVP By:</strong>{" "}
//         //                     {new Date(selectedInvite?.rsvpDate).toLocaleString()}
//         //                 </p>

//         //                 <Stack direction="row" spacing={2} justifyContent="center">
//         //                     <button onClick={() => handleResponse(true)}>
//         //                         Accept
//         //                     </button>
//         //                     <button onClick={() => handleResponse(false)}>
//         //                         Decline
//         //                     </button>
//         //                 </Stack>

//         //             </Box>
//         //         </Modal>
//         //     </Paper>
//         // </div>

//         <div>
//       <Paper elevation={6} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 5 }}>
//         <h2>Upcoming Events</h2>
//         {upcomingEvents.length === 0 ? (
//           <p>No upcoming events yet.</p>
//         ) : (
//           upcomingEvents.map((event) => (
//             <h3 key={event._id}>
//               <button onClick={() => navigate(`/Event/${event._id}`)}>
//                 {event.eventName}
//               </button>
//             </h3>
//           ))
//         )}
// s
//         <h2>Invitations</h2>
//         {invitations.length === 0 ? (
//           <p>No invitations found. Check back later for more.</p>
//         ) : (
//           invitations.map((event) => {
//             const isInvited = event.members?.emails?.some(
//               (memberEmail) => memberEmail === userEmail
//             );

//             if (!isInvited) return null;

//             return (
//               <h3 key={event._id}>
//                 <Link
//                   component="button"
//                   variant="body1"
//                   onClick={() => handleOpenModal(event)}
//                 >
//                   Invited ({event.eventName})
//                 </Link>
//               </h3>
//             );
//           })
//         )}

//         <Modal open={modalOpen} onClose={handleCloseModal}>
//           <Box sx={modalStyle}>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <h3>{selectedInvite?.eventName}</h3>
//               <IconButton
//                 onClick={handleCloseModal}
//                 size="small"
//                 aria-label="close"
//               >
//                 <CloseIcon />
//               </IconButton>
//             </Stack>

//             <p>
//               <strong>Date & Time:</strong>{" "}
//               {new Date(selectedInvite?.dateTime).toLocaleString()}
//             </p>
//             <p>
//               <strong>Location:</strong> {selectedInvite?.location}
//             </p>
//             <p>
//               <strong>Description:</strong> {selectedInvite?.description}
//             </p>
//             <p>
//               <strong>RSVP By:</strong>{" "}
//               {new Date(selectedInvite?.rsvpDate).toLocaleString()}
//             </p>

//             <Stack direction="row" spacing={2} justifyContent="center">
//               <button onClick={() => handleResponse(true)}>Accept</button>
//               <button onClick={() => handleResponse(false)}>Decline</button>
//             </Stack>
//           </Box>
//         </Modal>
//       </Paper>
//     </div>
        

//     )
// }

// imports
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Link, Modal, Box, IconButton, Stack, Button, CircularProgress, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


// Modal Styling
const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};


export default function Invitations() {

    // Main state to store all events fetched from the API
    const [invitedEvents, setInvitedEvents] = useState([]);
    // State to store the currently selected event for the modal
    const [selectedInvite, setSelectedInvite] = useState(null);
    // State to control modal visibility
    const [modalOpen, setModalOpen] = useState(false);
    // State for loading status
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user?.email;
    const accessToken = user?.accessToken;

    // Fetch events the user is invited to
    useEffect(() => {
        // Log the email being used for the API call
        console.log("Fetching invitations for email:", userEmail);

        if (!userEmail || !accessToken) {
            setLoading(false);
            console.error("User email or access token missing.");
            return;
        }

        const fetchInvitedEvents = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/events/invited`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch invited events.");
                }

                const data = await response.json();
                console.log("Fetched invited events:", data.events);
                setInvitedEvents(data.events || []);
            } catch (err) {
                console.error("Error fetching events:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvitedEvents();
    }, [userEmail, accessToken]);


    // Filter events into upcoming and pending invitations
    const pendingInvitations = invitedEvents.filter(event => {
        // Find the user's guest entry
        const userGuest = event.guests.find(guest => guest.email === userEmail || guest.member === user._id);
        // An invitation is pending if the user's status is 'invited'
        return userGuest && userGuest.status === "invited";
    });

    const upcomingEvents = invitedEvents.filter(event => {
        // Find the user's guest entry
        const userGuest = event.guests.find(guest => guest.email === userEmail || guest.member === user._id);
        // An event is upcoming if the user's status is 'accepted'
        return userGuest && userGuest.status === "accepted";
    });


    // State-handling functions controlling modal (pop-up)
    const handleOpenModal = (event) => {
        setSelectedInvite(event);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedInvite(null);
        setModalOpen(false);
    };

    // handleResponse function is "accept/decline" invitation logic
    const handleResponse = async (accepted) => {
        if (!selectedInvite || !accessToken) {
            console.error("Event data or access token missing.");
            return;
        }

        try {
            // Find the correct guestId for the logged-in user within the selected event
            const userGuest = selectedInvite.guests.find(
                (guest) => guest.email === userEmail || (guest.member && guest.member._id === user._id)
            );

            if (!userGuest) {
                console.error("Could not find guest entry for the current user in this event.");
                return;
            }

            // The guestId is the unique ID of the guest object within the guests array
            const guestId = userGuest._id;
            const newStatus = accepted ? "accepted" : "declined";

            // Make the PUT request to update guest status
            const response = await fetch(`http://localhost:4000/api/${selectedInvite._id}/guests/${guestId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update RSVP.");
            }

            // Update the state to reflect the change immediately
            setInvitedEvents(prevEvents => {
                return prevEvents.map(event => {
                    if (event._id === selectedInvite._id) {
                        // Find the user's guest entry again and update its status
                        const updatedGuests = event.guests.map(guest => {
                            if (guest._id === guestId) {
                                return { ...guest, status: newStatus };
                            }
                            return guest;
                        });
                        return { ...event, guests: updatedGuests };
                    }
                    return event;
                });
            });

            console.log(`Successfully updated RSVP status to: ${newStatus}`);
            handleCloseModal();

        } catch (error) {
            console.error("Error updating RSVP:", error.message);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading invitations...</Typography>
            </Box>
        );
    }

    return (
        <div>
            <Paper elevation={6} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 5 }}>

                <h2>Upcoming Events</h2>
                {upcomingEvents.length === 0 ? (
                    <p>No upcoming events yet.</p>
                ) : (
                    upcomingEvents.map((event) => (
                        <h3 key={event._id}>
                            <Button
                                variant="text"
                                onClick={() => navigate(`/Event/${event._id}`)}
                            >
                                {event.eventName}
                            </Button>
                        </h3>
                    ))
                )}

                <h2>Invitations</h2>
                {pendingInvitations.length === 0 ? (
                    <p>No invitations found. Check back later for more.</p>
                ) : (
                    pendingInvitations.map((event) => (
                        <h3 key={event._id}>
                            <Link component="button" variant="body1" onClick={() => handleOpenModal(event)}>
                                Invited ({event.eventName})
                            </Link>
                        </h3>
                    ))
                )}

                <Modal open={modalOpen} onClose={handleCloseModal}>
                    <Box sx={modalStyle}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <h3>{selectedInvite?.eventName}</h3>
                            <IconButton onClick={handleCloseModal} size="small" aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                        <p>
                            <strong>Date & Time:</strong>{" "}
                            {new Date(selectedInvite?.dateTime).toLocaleString()}
                        </p>
                        <p>
                            <strong>Location:</strong> {selectedInvite?.location}
                        </p>
                        <p>
                            <strong>Description:</strong> {selectedInvite?.description}
                        </p>
                        <p>
                            <strong>RSVP By:</strong>{" "}
                            {new Date(selectedInvite?.rsvpDate).toLocaleString()}
                        </p>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button variant="contained" onClick={() => handleResponse(true)}>Accept</Button>
                            <Button variant="outlined" onClick={() => handleResponse(false)}>Decline</Button>
                        </Stack>
                    </Box>
                </Modal>
            </Paper>
        </div>
    );
}
