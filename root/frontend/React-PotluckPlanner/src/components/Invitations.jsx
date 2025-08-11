// imports

import {useState, useEffect} from "react";
import axios from "axios";
import { Paper, Link, Modal, Box, IconButton, Stack, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 4, };

export default function Invitations () {

    const [invitations, setInvitations] = useState([]);
    const [selectedInvite, setSelectedInvite] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        if (!userEmail) return;

        const fetchInvitations = async () => {
            try {

                // const response = await axios.get(`http://localhost:4000/api/events/invited?email=${encodeURIComponent(userEmail)}`);
                const response = await axios.get('http://localhost:4000/api/events/invited', { params: { email: userEmail } });

                console.log("Fetched invitations:", response.data.invitedEvents);
                setInvitations(response.data.invitedEvents || []);
            } catch (err) {
                console.error("Error fetching invitations:", err);
            }
        };

        fetchInvitations();
    }, [userEmail]);

    const handleOpenModal = (event) => {
        setSelectedInvite(event);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedInvite(null);
        setModalOpen(false);
    };

    const handleResponse = async (accepted) => {
        if (!selectedInvite) return;

        try {
            // Update members array: set attending status for current user
            const updatedMembers = selectedInvite.members.emails.map((member) => member.email === userEmail ? { email: userEmail, attending: accepted} : member);

            // If user email is not in memebrs, add it with attending status
            if (!updatedMembers.find((m) => m.email === userEmail)) 
                {updatedMembers.push({ email: userEmail, attending: accepted });}

            await axios.put(`http://localhost:4000/api/event/${selectedInvite._id}/rsvp`, { members: { emails: updatedMembers }});
            // await axios.put(`http://localhost:4000/api/inviteEvent/${selectedInvite._id}`, { members: { emails: updatedMembers }});


            alert(`You have ${accepted ? "accepted" : "declined"} the invitation to ${selectedInvite.eventName}`);

            handleCloseModal();

            if (accepted) {
                // Remove accepted event from invitations list
                setInvitations((prev) => prev.filter((inv) => inv._id != selectedInvite._id));
            } else {
                // For declined, we can keep it or remove invitation from display here
            }
        }   catch (error) {
            console.error("Error updating RVSP:", error,response?.data || error.message);
            alert("Failed to update RSVP. Please try again.");
        }
    };


    return (

        <div>
            <Paper elevation={6} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 5 }}>
                <h2>Invitations</h2>

                {invitations.length === 0 ? (
                    <p>No invitations found. Check back later for more.</p>
                ) : (
                  invitations.map((event) => {
                    const isInvited = event.members?.emails?.some((m) => m.email === userEmail);
                    console.log(event.eventName, isInvited);
                    
                    if (!isInvited) return null;

                    return (
                        <h3 key={event._id}>
                            <Link component="button" variant="body1" onClick={() => handleOpenModal(event)}>
                                Invited ({event.eventName})
                            </Link>
                        </h3>
                    );
                  })
                )}

                <Modal open={modalOpen} onClose={handleCloseModal}>
                    <Box sx={modalStyle}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <h3>{selectedInvite?.eventName}</h3>
                            <IconButton onClick={handleCloseModal} size="small" aria-label="close">
                                <CloseIcon/>
                            </IconButton>
                        </Stack>

                        <p>
                            <strong>Date & Time:</strong>{" "}
                            {new Date(selectedInvite?.dateTime).toLocaleString()}
                        </p>
                        <p>
                            <strong>Location:</strong>{selectedInvite?.location}
                        </p>
                        <p>
                            <strong>Description:</strong>{selectedInvite?.description}
                        </p>
                        <p>
                            <strong>RSVP By:</strong>{" "}
                            {new Date(selectedInvite?.rsvpDate).toLocaleString()}
                        </p>

                        <Stack direction="row" spacing={2} justifyContent="center">
                            <button onClick={() => handleResponse(true)}>
                                Accept
                            </button>
                            <button onClick={() => handleResponse(false)}>
                                Decline
                            </button>
                        </Stack>

                    </Box>
                </Modal>
            </Paper>
        </div>
    )
}