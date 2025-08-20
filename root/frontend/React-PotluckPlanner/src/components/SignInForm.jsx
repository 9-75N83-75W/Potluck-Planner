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
            const response = await fetch(`http://localhost:4000/api/login`, {
                method: "POST",
                headers: {
                    // Specify the content type as JSON
                    "Content-Type": "application/json",
                },
                // Send email and password in the request body as a JSON string
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if(!response.ok) {
                setError(data.message || "Login failed.");
                setLoading(false);
                return;
            }

            // If login is successful, save user info to localStorage
            // Save the full user object including accessToken & refreshToken
            localStorage.setItem("user", JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            })
      );

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