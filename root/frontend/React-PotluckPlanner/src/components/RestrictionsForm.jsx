//imports
import React, { useState } from "react";
import { Box, RadioGroup, FormControlLabel, Radio, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RestrictionsForm() {

    // to redirect new user to Dashboard
    const navigate = useNavigate();

    const categories = [
        { key: "AirborneAllergy", label: "Airborne Allergies" },
        { key: "DietaryAllergy", label: "Dietary Allergies" },
        { key: "DietaryRestrictions", label: "Dietary Restrictions" },
        { key: "Preferences", label: "Preferences" },

    ];

    const [formData, setFormData] = useState({
        AirborneAllergy: { hasAllergy: "no", details: ""},
        DietaryAllergy: { hasAllergy: "no", details: ""},
        DietaryRestrictions: { hasAllergy: "no", details: ""},
        Preferences: { hasAllergy: "no", details: ""},
    })

    const handleRadioChange = (category, value) => {
        setFormData((prev) => ({
            ...prev,
            [category]: {...prev[category], hasAllergy: value, details: value === "no" ? "" : prev[category].details },
        }));
    };

    const handleDetailsChange = (category, value) => {
        setFormData((prev) => ({
            ...prev,
            [category]: { ...prev[category], details: value },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allergiesPayLoad = {};
        categories.forEach(({ key }) => {
            allergiesPayLoad[key] = formData[key].hasAllergy === "yes" ? formData[key].details.split(",").map((item) => item.trim()).filter(Boolean): [];
        });

        // Get email from local storage
        const email = localStorage.getItem("userEmail");
        if (!email) {
            alert("User email not found. Please log in again.");
            return;
        }

        const bodyPayLoad = {
            email,
            allergies: allergiesPayLoad
        };

        try {
            const response = await fetch("http://localhost:4000/api/updateAllergies", {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify(bodyPayLoad),
            });
            const data = await response.json();
            console.log("Response:", data);

            if(response.ok) {
                console.log("Update successful." )
                navigate("/Dashboard");
            } else {
                alert(data.message || "Failed to update allergies, restrictions, and preferences.")
            }
        } catch (err) {
            console.error("Error submitting:", err);
            alert("Something went wrong.")
        }
    };


    return (
        <div>
            <Box component ="form" onSubmit={handleSubmit} sx={{maxWidth: 600, mx: "auto", p:3 }}>
                {categories.map(({ key, label }) => (
                    <Box key={key} sx={{ mb: 3 }}>
                        <p>
                            {label}
                        </p>
                        <RadioGroup row value={formData[key].hasAllergy} onChange={(e) => handleRadioChange(key, e.target.value)}>
                            <FormControlLabel value="yes" control={<Radio sx={{"&.Mui-checked": {color: "#8B7E96"}}} />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio sx={{"&.Mui-checked": {color: "#8B7E96"}}} />} label="No" />
                        </RadioGroup>
                        {formData[key].hasAllergy === "yes" && (
                            <TextField label={`Enter ${label}`} variant="outlined" fullWidth size="small" value={formData[key].details} onChange={(e) => handleDetailsChange(key, e.target.value)} sx={{ mt: 1 }} helperText = "Note: Please seperate by commas."/>
                        )}
                    </Box>
                ))}

                <button type="submit">
                    Save
                </button>
            </Box>
        </div>
    );
}