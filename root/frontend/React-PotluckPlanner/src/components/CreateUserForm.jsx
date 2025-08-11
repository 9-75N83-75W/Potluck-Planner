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
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmpassword: ""
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

      if (formData.password !== formData.confirmpassword) {
        alert("Passwords do not match.");
        return;
      }

      setLoading(true);
    
      try {
        const response = await fetch("http://localhost:4000/api/createUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          // Only sending fields backend is expecting
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          }),
        });
    
        const data = await response.json();
        if (response.ok) {
          alert("User created successfully!");
          console.log(data.user); // optional
          localStorage.setItem("userEmail", data.user.email);
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
                        label="Full Name"
                        name="name"
                        value={formData.name}
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
                        name="confirmpassword"
                        type="password"
                        value={formData.confirmpassword}
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