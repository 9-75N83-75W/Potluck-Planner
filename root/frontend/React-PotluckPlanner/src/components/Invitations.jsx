// imports
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Paper, Link, Modal, Box, IconButton, Stack, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


// Modal Styling
const modalStyle = {position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 4, };


export default function Invitations () {

    // stores array of invitation objects fetched from backend
    const [invitations, setInvitations] = useState([]);
    // stores currently selected inivitation to view details in pop-up
    const [selectedInvite, setSelectedInvite] = useState(null);
    // stores whether pop-up is open (true) or closed (false)
    const [modalOpen, setModalOpen] = useState(false);

    const [upcomingEvents, setUpcomingEvents] = useState([]);

    // stores userEmail in local storage
    const userEmail = localStorage.getItem("userEmail");

    const navigate = useNavigate();

    // when userEmail changes...
    useEffect(() => {
        // if email is undefined or null, stop
        if (!userEmail) return;
        
        // defining async function to get /api/events/invited by passing userEmail
        const fetchInvitations = async () => {
            try {

                const response = await axios.get(`http://localhost:4000/api/events/invited?email=${encodeURIComponent(userEmail)}`);

                // logs invitations returned from backend
                console.log("Fetched invitations:", response.data.invitedEvents);
                // updates invitations state with backend response or empty array if null or empty
                setInvitations(response.data.invitedEvents || []);
              // if api request fails, error is logged.  
            } catch (err) {
                console.error("Error fetching invitations:", err);
            }
        };

        // calling fetchInvitations function
        fetchInvitations();
    }, [userEmail]);


    // state-handling functions controlling modal (pop-up)
    // open
    const handleOpenModal = (event) => {
        setSelectedInvite(event);
        setModalOpen(true);
    };
    // close
    const handleCloseModal = () => {
        setSelectedInvite(null);
        setModalOpen(false);
    };

    // handleResponse function is essentially "accept/decline" invitation logic
    const handleResponse = async (accepted) => {
        // if there is no invitation selected in modal, do nothing
        if (!selectedInvite) return;

        // creates updated members list
        try {
            // // takes existing list of members (selectedInvite.members?.email) and for current user, updates "attending" property to true (if accepted) or false (if declined); everyone else stays same
            // const updatedMembers = (selectedInvite.members?.email || []).map(member =>
            //     member.email === userEmail
            //       ? { ...member, attending: accepted }
            //       : member
            //   );

            // copy current arrays to avoid mutation
            const emails = [...(selectedInvite.members?.emails || [])];
            const attending = [...(selectedInvite.members?.attending || [])];

            // find index of current user email
            const idx = emails.indexOf(userEmail);

            if(idx !== -1) {
                // user already invites, update attending status
                attending[idx] = accepted;
            } else {
                // user not invited yet, add them
                emails.push(userEmail);
                attending.push(accepted);
            }
              
            // // If the user is not already in members, add them with RSVP status
            // if (!updatedMembers.some( email => email === userEmail)) {
            //     updatedMembers.push({ email: userEmail, attending: accepted });
            //   }

            // makes a put request to api endpoint, passes updated members list so backend can store RSVP status
            // await axios.put(`http://localhost:4000/api/inviteEvent/${selectedInvite._id}`, { members: { invited: updatedMembers }});

            // const emails = updatedMembers.map(m => m.email);
            // const attending = updatedMembers.map(m => m.attending);
            console.log("Sending update with emails:", emails);
            console.log("Sending update with attending:", attending);
            await axios.put(`http://localhost:4000/api/inviteEvent/${selectedInvite._id}`, { members: { emails, attending }});
            


            // shows a pop-up message confirming "accept" or "decline" action
            alert(`You have ${accepted ? "accepted" : "declined"} the invitation to ${selectedInvite.eventName}`);

            // clears selectedInvite and hides modal
            handleCloseModal();

            // if accepted, remove event from pending invitations list
            if (accepted) {
                // Remove accepted event from invitations list
                setInvitations((prev) => prev.filter((inv) => inv._id != selectedInvite._id));

                // Add to upcomingEvents if not already there
                setUpcomingEvents(prev => {
                    if (!prev.find(event => event._id === selectedInvite._id)) {
                        return [...prev, selectedInvite];
                    }
                    return prev;
                });
            } else {
                // For declined, we can keep it or remove invitation from display here
            }
        }   catch (error) {
            console.error("Error updating RVSP:", error.response?.data || error.message);
            alert("Failed to update RSVP. Please try again.");
        }
    };

    // Separate events into upcoming (accepted) and pending invitations
    const attending = invitations.filter((event) => {
        const emails = event.members?.emails || [];
        const attending = event.members?.attending || [];
        const idx = emails.indexOf(userEmail);
        return idx !== -1 && attending[idx] === true;
    });

    const pendingInvitations = invitations.filter((event) => {
        const emails = event.members?.emails || [];
        const attending = event.members?.attending || [];
        const idx = emails.indexOf(userEmail);
        return idx !== -1 && attending[idx] !== true;
    });


    return (

        // <div>
        //     <Paper elevation={6} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 5 }}>

        //         <h2>Invitations</h2>

        //         {/* if there are no events in invitations array -> show "no invitations" message */}
        //         {invitations.length === 0 ? (
        //             <p>No invitations found. Check back later for more.</p>
        //         // otherwise...
        //         ) : (
        //           // loop through each event in invitations
        //           invitations.map((event) => {
        //             // for each event, checks logged-in user's email is in event's invited members list - this is redundant
        //             const isInvited = event.members?.emails?.some(memberEmail => {
        //                 console.log("Checking member email:", memberEmail, "against userEmail:", userEmail);
        //                 return memberEmail === userEmail;
        //               });
        //               console.log("isInvited?", isInvited);
        //             //   if (!isInvited) return null;


        //             return (
        //                 <h3 key={event._id}>
        //                     <Link component="button" variant="body1" onClick={() => handleOpenModal(event)}>
        //                         Invited ({event.eventName})
        //                     </Link>
        //                 </h3>
        //             );
        //           })
        //         )}

        //         <Modal open={modalOpen} onClose={handleCloseModal}>
        //             <Box sx={modalStyle}>
        //                 <Stack direction="row" justifyContent="space-between" alignItems="center">
        //                     <h3>{selectedInvite?.eventName}</h3>
        //                     <IconButton onClick={handleCloseModal} size="small" aria-label="close">
        //                         <CloseIcon/>
        //                     </IconButton>
        //                 </Stack>

        //                 <p>
        //                     <strong>Date & Time:</strong>{" "}
        //                     {new Date(selectedInvite?.dateTime).toLocaleString()}
        //                 </p>
        //                 <p>
        //                     <strong>Location:</strong>{selectedInvite?.location}
        //                 </p>
        //                 <p>
        //                     <strong>Description:</strong>{selectedInvite?.description}
        //                 </p>
        //                 <p>
        //                     <strong>RSVP By:</strong>{" "}
        //                     {new Date(selectedInvite?.rsvpDate).toLocaleString()}
        //                 </p>

        //                 <Stack direction="row" spacing={2} justifyContent="center">
        //                     <button onClick={() => handleResponse(true)}>
        //                         Accept
        //                     </button>
        //                     <button onClick={() => handleResponse(false)}>
        //                         Decline
        //                     </button>
        //                 </Stack>

        //             </Box>
        //         </Modal>
        //     </Paper>
        // </div>

        <div>
      <Paper elevation={6} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 5 }}>
        <h2>Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <p>No upcoming events yet.</p>
        ) : (
          upcomingEvents.map((event) => (
            <h3 key={event._id}>
              <button onClick={() => navigate(`/Event/${event._id}`)}>
                {event.eventName}
              </button>
            </h3>
          ))
        )}

        <h2>Invitations</h2>
        {invitations.length === 0 ? (
          <p>No invitations found. Check back later for more.</p>
        ) : (
          invitations.map((event) => {
            const isInvited = event.members?.emails?.some(
              (memberEmail) => memberEmail === userEmail
            );

            if (!isInvited) return null;

            return (
              <h3 key={event._id}>
                <Link
                  component="button"
                  variant="body1"
                  onClick={() => handleOpenModal(event)}
                >
                  Invited ({event.eventName})
                </Link>
              </h3>
            );
          })
        )}

        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <h3>{selectedInvite?.eventName}</h3>
              <IconButton
                onClick={handleCloseModal}
                size="small"
                aria-label="close"
              >
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
              <button onClick={() => handleResponse(true)}>Accept</button>
              <button onClick={() => handleResponse(false)}>Decline</button>
            </Stack>
          </Box>
        </Modal>
      </Paper>
    </div>
        

    )
}