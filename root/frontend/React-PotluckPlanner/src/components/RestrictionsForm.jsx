// //imports
// import React, { useState } from "react";
// import { Box, RadioGroup, FormControlLabel, Radio, TextField, Button, CircularProgress } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// export default function RestrictionsForm() {

//     // Hook to handle programmatic navigation
//     const navigate = useNavigate();

//     // Define the categories to match the backend schema's 'category' enum
//     const categories = [
//         { key: "airborne_allergy", label: "Airborne Allergies" },
//         { key: "dietary_allergy", label: "Dietary Allergies" },
//         { key: "dietary_restriction", label: "Dietary Restrictions" },
//         { key: "preference_dislikes", label: "Food Dislikes" },
//         { key: "preference_likes", label: "Food Likes" },
//     ];

//     // State to hold the form data for all categories
//     const initialFormData = categories.reduce((acc, category) => {
//         // Initialize each category with a 'no' selection and an empty details string
//         acc[category.key] = { hasConstraint: "no", details: "" };
//         return acc;
//     }, {});

//     const [formData, setFormData] = useState(initialFormData);
//     const [loading, setLoading] = useState(false);

//     /**
//      * Handles changes to the radio buttons for each category.
//      * When a radio button is clicked, this function updates the 'hasConstraint'
//      * field for that category in the state.
//      * @param {string} category The key of the category being changed.
//      * @param {string} value "yes" or "no" from the radio button.
//      */
//     const handleRadioChange = (category, value) => {
//         // Use a functional update to ensure we have the latest state
//         setFormData((prev) => {
//             const newState = {
//                 ...prev,
//                 [category]: { 
//                     ...prev[category], 
//                     hasConstraint: value, 
//                     // Reset details if user changes to "no"
//                     details: value === "no" ? "" : prev[category].details 
//                 },
//             };
//             return newState;
//         });
//     };

//     /**
//      * Handles changes to the text field for each category's details.
//      * @param {string} category The key of the category being changed.
//      * @param {string} value The value from the text field.
//      */
//     const handleDetailsChange = (category, value) => {
//         setFormData((prev) => ({
//             ...prev,
//             [category]: { ...prev[category], details: value },
//         }));
//     };

//     /**
//      * Handles the form submission by sending a PUT request for each category with data.
//      * @param {object} e The form submission event.
//      */
//     const handleSubmit = async (e) => {
        
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const user = JSON.parse(localStorage.getItem("user"));
//             if (!user || !user.accessToken) {
//                 throw new Error("User not authenticated. Please log in again.");
//             }

//             const userId = user.id;
//             const accessToken = user.accessToken; // Retrieve the access token
//             const requests = [];
//             console.log("Auth:", userId)
//             console.log("Auth2:", accessToken)

//             categories.forEach(({ key }) => {
//                 if (formData[key].hasConstraint === "yes" && formData[key].details) {
//                     const constraints = formData[key].details.split(",").map((item) => item.trim()).filter(Boolean);
                    
//                     if (constraints.length > 0) {
//                         const bodyPayLoad = { constraints };
                        
//                         const endpoint = `http://localhost:4000/api/${userId}/constraints/${key}`;
                        
//                         requests.push(
//                             fetch(endpoint, {
//                                 method: "PUT",
//                                 headers: {
//                                     "Content-Type": "application/json",
//                                     "Authorization": `Bearer ${accessToken}`,
//                                 },
//                                 body: JSON.stringify(bodyPayLoad),
//                             })
//                             // Crucial fix: Check for the response status and content type
//                             .then(response => {
//                                 // If the response is not a 200 OK, it's an error
//                                 if (!response.ok) {
//                                     // Check if the response is JSON before trying to parse it
//                                     const contentType = response.headers.get("content-type");
//                                     if (contentType && contentType.includes("application/json")) {
//                                         return response.json().then(err => { throw new Error(err.message || `Failed to update ${key}`); });
//                                     } else {
//                                         // If it's not JSON, throw a generic error
//                                         throw new Error(`Server returned a non-JSON error page.`);
//                                     }
//                                 }
//                                 return response;
//                             })
//                         );
//                     }
//                 }
//             });

//             await Promise.all(requests);
            
//             console.log("All updates successful.");
//             alert("Your profile has been updated successfully!");
//             navigate("/Dashboard");

//         } catch (err) {
//             console.error("Error submitting:", err.message);
//             alert(`Something went wrong: ${err.message}. Please try again.`);
//         } finally {
//             setLoading(false);
//         }
//     };


//     return (
//         <div>
//             <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
//                 {categories.map(({ key, label }) => (
//                     <Box key={key} sx={{ mb: 3 }}>
//                         <p>{label}</p>
//                         <RadioGroup row value={formData[key].hasConstraint} onChange={(e) => handleRadioChange(key, e.target.value)}>
//                             <FormControlLabel value="yes" control={<Radio sx={{ "&.Mui-checked": { color: "#8B7E96" } }} />} label="Yes" />
//                             <FormControlLabel value="no" control={<Radio sx={{ "&.Mui-checked": { color: "#8B7E96" } }} />} label="No" />
//                         </RadioGroup>
//                         {formData[key].hasConstraint === "yes" && (
//                             <TextField 
//                                 label={`Enter ${label}`} 
//                                 variant="outlined" 
//                                 fullWidth 
//                                 size="small" 
//                                 value={formData[key].details} 
//                                 onChange={(e) => handleDetailsChange(key, e.target.value)} 
//                                 sx={{ mt: 1 }} 
//                                 helperText="Note: Please separate by commas."
//                             />
//                         )}
//                     </Box>
//                 ))}

//                 <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
//                     {loading ? <CircularProgress size={24} /> : "Save"}
//                 </Button>
//             </Box>
//         </div>
//     );
// }

import React, { useState } from "react";
import { Box, RadioGroup, FormControlLabel, Radio, TextField, Button, CircularProgress } from "@mui/material";
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
                maxWidth: "70%",
                padding: "80px",
                mx: "auto",
                p: 3,
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
                mt: 4,
            }}
        >
            <h2 style={{ fontSize: "48px", fontWeight: 600, color: "#1f2937", marginBottom: "24px" }}>
                Finish Setting Up Your Dietary Profile
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
                Answer the following to help us tailor event meals and avoid allergens. Select "Yes" if you have any constraints or preferences, and provide details separated by commas.
            </p>

            {categories.map(({ key, label }) => (
                <Box key={key} sx={{ mb: 4, p: 2, border: "1px solid #e2e8f0", borderRadius: "12px", backgroundColor: "#f9fafb" }}>
                    <p style={{ fontWeight: 500, marginBottom: "8px" }}>{label}</p>
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
