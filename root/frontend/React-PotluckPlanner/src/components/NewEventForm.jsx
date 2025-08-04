import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useNavigate } from "react-router-dom";
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function NewEventForm() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const nav = useNavigate();

    // Navigation with 'path' variable passed
    const navigate= (path)=> {
      nav(path);
    };

  return (
    <div>
      <button onClick={handleOpen}>New Event.</button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <p>Include New Event Details Here.</p>
            <Box>
                    <Stack
                        margin="20px"
                        padding={6}
                        spacing={{ xs: 1, sm: 2 }}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: 'wrap' }}>
                            <TextField required id="standard-required" label="Event Name." variant="standard" />
                            <TextField required id="standard-required" label="Date" variant="standard" />
                            <TextField required id="standard-required" label="Location" variant="standard" />
                    </Stack>
            </Box>
            <button
                onClick={() => navigate("/Event")}
            >
                Create New Event.
            </button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}