//imports
import { useState } from "react";
//materialUI imports
import { Stack, TextField } from "@mui/material";
import Box from '@mui/material/Box';

 
export default function CreateUserForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        // allergies: {
        //   AirborneAllergy: [],
        //   DietaryAllergy: [],
        //   DietaryRestrictions: [],
        //   Preferences: [],
        //   NoAllergy: [],
        // },
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch("http://localhost:4000/api/createUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          const data = await response.json();
          if (response.ok) {
            alert("User created successfully!");
            console.log(data.user); // optional
          } else {
            alert(data.message);
          }
        } catch (err) {
          console.error("Error:", err);
          alert("Something went wrong.");
        }
      };

    return (
        <div>
            <>
            <Box sx={{ width: 300}}>
                {/* <Stack
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

                </Stack> */}
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
                    {/* <TextField
                        // required
                        label="Allergies"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                    /> */}

                    {/* Optional allergy fields can be added later */}

                    <button variant="contained" type="submit">
                        Create Account
                    </button>
                </Box>
                {/* <div
                    margin="30px"
                    justify-content="center">
                    <button>
                        Create Account.
                    </button>
                </div> */}
            </Box>
        </>
        </div>
    )
}