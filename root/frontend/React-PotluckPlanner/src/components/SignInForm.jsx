//imports
import { useNavigate } from "react-router-dom";
import {useState } from 'react';
import { Stack, Box, TextField, CircularProgress } from "@mui/material"


export default function SignInForm({}) {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Pass credentials as query parameters for GET
            const response = await fetch(`http://localhost:4000/api/existingUser/?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
                {method: "GET"}
            );

            const data = await response.json();

            if(!response.ok) {
                setError(data.message || "Login failed.");
                setLoading(false);
                return;
            }

            // Save user info
            localStorage.setItem("user", JSON.stringify(data.existingUser));

            // Save just the email separately for easy access
            localStorage.setItem("userEmail", data.existingUser.email);

            // Redirect to Dashboard
            navigate("/Dashboard");
        }   catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }   finally {
            setLoading(false);
        }
};

    return (
        <div>
            <Box sx={{ width: 300 }}>
                <form onSubmit={handleSubmit}>
                    <Stack margin="20px" padding={2} spacing={{ xs:2 }} direction="column" useFlexGap>
                        {error && (<p style={{color: "red", marginBottom: "0.5rem" }}>{error}</p>)}

                        <TextField 
                            required
                            label="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField 
                            required
                            label="Password" 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Sign In"}
                        </button>
                    </Stack>
                </form>
            </Box>
        </div>
    );
}