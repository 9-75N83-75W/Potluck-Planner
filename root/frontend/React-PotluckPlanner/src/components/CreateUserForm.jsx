//imports
//import TextField from '@mui/material/TextField';
import { Stack, TextField } from "@mui/material";
import Box from '@mui/material/Box';

 
export default function CreateUserForm() {
    return (
        <div>
            <>
            <Box sx={{ width: 300}}>
                <Stack
                    margin="30px"
                    spacing={{ xs: 1, sm: 2 }}
                    direction="row"
                    useFlexGap
                    sx={{ flexWrap: 'wrap' }}>
                        <TextField required id="standard-required" label="Name." variant="standard" />
                        <TextField required id="standard-required" label="Phone." variant="standard" />
                        <TextField required id="standard-required" label="Email." variant="standard" />
                        <TextField required id="standard-required" label="Password." variant="standard" />
                        <TextField required id="standard-required" label="Confirm Password." variant="standard" />

                </Stack>
            </Box>
        </>
        </div>
    )
}