//imports
import React, { useState } from "react";
import { Box, RadioGroup, FormControlLabel, Radio, TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RestrictionsForm() {

    // Hook to handle programmatic navigation
    const navigate = useNavigate();

    // Define the categories to match the backend schema's 'category' enum
    const categories = [
        { key: "airborne_allergy", label: "Airborne Allergies" },
        { key: "dietary_allergy", label: "Dietary Allergies" },
        { key: "dietary_restriction", label: "Dietary Restrictions" },
        { key: "preference_dislikes", label: "Food Dislikes" },
        { key: "preference_likes", label: "Food Likes" },
    ];

    // State to hold the form data for all categories
    const initialFormData = categories.reduce((acc, category) => {
        // Initialize each category with a 'no' selection and an empty details string
        acc[category.key] = { hasConstraint: "no", details: "" };
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);

    /**
     * Handles changes to the radio buttons for each category.
     * When a radio button is clicked, this function updates the 'hasConstraint'
     * field for that category in the state.
     * @param {string} category The key of the category being changed.
     * @param {string} value "yes" or "no" from the radio button.
     */
    const handleRadioChange = (category, value) => {
        // Use a functional update to ensure we have the latest state
        setFormData((prev) => {
            const newState = {
                ...prev,
                [category]: { 
                    ...prev[category], 
                    hasConstraint: value, 
                    // Reset details if user changes to "no"
                    details: value === "no" ? "" : prev[category].details 
                },
            };
            return newState;
        });
    };

    /**
     * Handles changes to the text field for each category's details.
     * @param {string} category The key of the category being changed.
     * @param {string} value The value from the text field.
     */
    const handleDetailsChange = (category, value) => {
        setFormData((prev) => ({
            ...prev,
            [category]: { ...prev[category], details: value },
        }));
    };

    /**
     * Handles the form submission by sending a PUT request for each category with data.
     * @param {object} e The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.accessToken) {
                throw new Error("User not authenticated. Please log in again.");
            }

            const userId = user.id;
            const accessToken = user.accessToken; // Retrieve the access token
            const requests = [];

            categories.forEach(({ key }) => {
                if (formData[key].hasConstraint === "yes" && formData[key].details) {
                    const constraints = formData[key].details.split(",").map((item) => item.trim()).filter(Boolean);
                    
                    if (constraints.length > 0) {
                        const bodyPayLoad = { constraints };
                        
                        const endpoint = `http://localhost:4000/api/${userId}/constraints/${key}`;
                        
                        requests.push(
                            fetch(endpoint, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${accessToken}`,
                                },
                                body: JSON.stringify(bodyPayLoad),
                            })
                            // Crucial fix: Check for the response status and content type
                            .then(response => {
                                // If the response is not a 200 OK, it's an error
                                if (!response.ok) {
                                    // Check if the response is JSON before trying to parse it
                                    const contentType = response.headers.get("content-type");
                                    if (contentType && contentType.includes("application/json")) {
                                        return response.json().then(err => { throw new Error(err.message || `Failed to update ${key}`); });
                                    } else {
                                        // If it's not JSON, throw a generic error
                                        throw new Error(`Server returned a non-JSON error page.`);
                                    }
                                }
                                return response;
                            })
                        );
                    }
                }
            });

            await Promise.all(requests);
            
            console.log("All updates successful.");
            alert("Your profile has been updated successfully!");
            navigate("/Dashboard");

        } catch (err) {
            console.error("Error submitting:", err.message);
            alert(`Something went wrong: ${err.message}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
                {categories.map(({ key, label }) => (
                    <Box key={key} sx={{ mb: 3 }}>
                        <p>{label}</p>
                        <RadioGroup row value={formData[key].hasConstraint} onChange={(e) => handleRadioChange(key, e.target.value)}>
                            <FormControlLabel value="yes" control={<Radio sx={{ "&.Mui-checked": { color: "#8B7E96" } }} />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio sx={{ "&.Mui-checked": { color: "#8B7E96" } }} />} label="No" />
                        </RadioGroup>
                        {formData[key].hasConstraint === "yes" && (
                            <TextField 
                                label={`Enter ${label}`} 
                                variant="outlined" 
                                fullWidth 
                                size="small" 
                                value={formData[key].details} 
                                onChange={(e) => handleDetailsChange(key, e.target.value)} 
                                sx={{ mt: 1 }} 
                                helperText="Note: Please separate by commas."
                            />
                        )}
                    </Box>
                ))}

                <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
                    {loading ? <CircularProgress size={24} /> : "Save"}
                </Button>
            </Box>
        </div>
    );
}