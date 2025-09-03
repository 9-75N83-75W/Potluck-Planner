import React, { useState } from "react";
import { Box, RadioGroup, FormControlLabel, Radio, TextField, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RestrictionsForm() {
    const navigate = useNavigate();

    const categories = [
        { key: "airborne_allergy", label: "Airborne Allergies" },
        { key: "dietary_allergy", label: "Dietary Allergies" },
        { key: "dietary_restriction", label: "Dietary Restrictions" },
        { key: "preference_dislikes", label: "Food Dislikes" },
        { key: "preference_likes", label: "Food Likes" },
    ];

    const initialFormData = categories.reduce((acc, category) => {
        acc[category.key] = { hasConstraint: "no", details: "" };
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);

    const handleRadioChange = (category, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: { 
                ...prev[category], 
                hasConstraint: value,
                details: value === "no" ? "" : prev[category].details
            },
        }));
    };

    const handleDetailsChange = (category, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: { ...prev[category], details: value },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.accessToken) throw new Error("User not authenticated.");

            const userId = user.id;
            const accessToken = user.accessToken;
            const requests = [];

            categories.forEach(({ key }) => {
                if (formData[key].hasConstraint === "yes" && formData[key].details) {
                    const constraints = formData[key].details.split(",").map(i => i.trim()).filter(Boolean);
                    if (constraints.length) {
                        requests.push(
                            fetch(`http://localhost:4000/api/${userId}/constraints/${key}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${accessToken}`,
                                },
                                body: JSON.stringify({ constraints }),
                            }).then(res => {
                                if (!res.ok) throw new Error(`Failed to update ${key}`);
                                return res;
                            })
                        );
                    }
                }
            });

            await Promise.all(requests);
            alert("Profile updated successfully!");
            navigate("/Dashboard");
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: "50%",
                padding: "70px",
                paddingTop: "15px",
                mx: "auto",
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
                mt: 4,
            }}
        >
            <h2 style={{ fontSize: "48px", fontWeight: 600, color: "#1f2937", marginBottom: "24px" }}>
                Finish Setting Up Your Dietary Profile.
            </h2>
            <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "24px", letterSpacing: "-0.5px" }}>
                Answer the following to help us tailor event meals and assist you in avoiding allergens. Select "Yes" if you have any constraints or preferences, then provide details separated by commas.
            </p>

            {categories.map(({ key, label }) => (
                <Box key={key} sx={{ mb: 4, p: 2, border: "1px solid #e2e8f0", borderRadius: "12px", backgroundColor: "#f9fafb" }}>
                    <p style={{ fontsize:"16px", fontWeight: 600, marginBottom: "8px" }}>{label}</p>
                    <RadioGroup
                        row
                        value={formData[key].hasConstraint}
                        onChange={(e) => handleRadioChange(key, e.target.value)}
                        sx={{ mb: 1 }}
                    >
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
                            helperText="Separate multiple items with commas"
                        />
                    )}
                </Box>
            ))}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                        backgroundColor: "#8B7E96",
                        width: 300,
                        borderRadius: "16px",
                        fontWeight: 600,
                        fontSize: 16,
                        "&:hover": { backgroundColor: "#75697e" },
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save"}
                </button>
            </Box>
        </Box>
    );
}
