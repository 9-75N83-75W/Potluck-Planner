//imports
import { useNavigate } from "react-router-dom";
import { useState } from "react";
//materialUI imports
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';

 
export default function CreateUserForm() {

    // to redirect new user to UserProfile to add allergies / finish setting up profile
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      });

    // For loading state while createUser request is being processed
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
    
    // Handle form submit
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      setLoading(true);
    
      try {
        const response = await fetch("http://localhost:4000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          // Only sending fields backend is expecting
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          }),
        });
    
        const data = await response.json();

        if (response.ok) {

          // Store the access and refresh tokens
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          alert("User created successfully!");
          console.log(data.user); // optional

          localStorage.setItem("userId", data.user.Id);

          navigate("/SetupProfile");

        } else {
          alert(data.message);
        }
        } catch (err) {
          console.error("Error:", err);
          alert("Something went wrong.");
        } finally {
          setLoading(false);
        }
    };

    return (
        <div>
            <>
            <Box sx={{ width: 300}}>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 400 }}>
                    <TextField
                        required
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <button variant="contained" type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </Box>
            </Box>
        </>
        </div>
    )
}