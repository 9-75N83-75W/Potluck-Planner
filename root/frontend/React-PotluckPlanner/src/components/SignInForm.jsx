//imports
import { Stack, Box, TextField } from "@mui/material"
import Paper from '@mui/material/Paper';


export default function SignInForm() {
    return (
        <div>
            <>
            <Paper elevation={10}>
                <Box sx={{ width: 300 }}>
                    <Stack
                        margin="20px"
                        padding={6}
                        spacing={{ xs: 1, sm: 2 }}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: 'wrap' }}>
                            <TextField required id="standard-required" label="Email." variant="standard" />
                            <TextField required id="standard-required" label="Password" variant="standard" />
                    </Stack>
                </Box>
            </Paper>
        </>
        </div>
    )
}