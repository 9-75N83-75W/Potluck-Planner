import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Checkbox, FormGroup, FormControlLabel, Chip, Autocomplete, Alert, } from "@mui/material";
import axios from "axios";
import RecipeImage from "../atoms/RecipeImage";

const styleModal = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
  maxWidth: "90vw",         // keeps it within screen width
  maxHeight: "90vh",        // keeps it within screen height
  overflowY: "auto",        // scroll inside modal if content is too tall
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function RecipesForm({ open, onClose, eventId, onRecipeCreated }) {

  const [loading, setLoading] = useState(false);
  const [constraints, setConstraints] = useState({
    airborneAllergies: [],
    dietaryAllergies: [],
    dietaryRestrictions: [],
    preferenceDislikes: [],
    preferenceLikes: [],
  });

  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [airborneChecked, setAirborneChecked] = useState([]);
  const [dietaryChecked, setDietaryChecked] = useState([]);
  const [dietaryAllergens, setDietaryAllergens] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {

    const fetchConstraints = async () => {
      if ( !eventId || !open ) return; // only fetch when modal opens with eventId

      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.accessToken) {
          throw new Error("User not authenticated. Please log in again.");
        }

        const res = await axios.get(`http://localhost:4000/api/event/${eventId}/constraints`, 
          { 
            headers: { Authorization: `Bearer ${user.accessToken}` }, 
          }
        ); 

        const data = res.data
        setConstraints({
          airborneAllergies: data.airborne_allergy,
          dietaryAllergies: data.dietary_allergy,
          dietaryRestrictions: data.dietary_restriction,
          preferenceDislikes: data.preference_dislikes,
          preferenceLikes: data.preference_likes,
        })
        console.log("Fetched constraints by category:", res.data);
      } catch (err) {
        console.error("Error fetching constraints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConstraints();
  }, [eventId, open]);

  useEffect(() => {
    // Disable submit if any airborne allergy is checked
    if (airborneChecked.length > 0) {
      setSubmitDisabled(true);
      setAlertVisible(true);
    } else {
      setSubmitDisabled(false);
      setAlertVisible(false);
    }
  }, [airborneChecked]);

  const handleAirborneChange = (event) => {
    const { value, checked } = event.target;
    setAirborneChecked((prev) => 
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const handleDietaryChange = (event) => {
    const { value, checked } = event.target;
    setDietaryChecked((prev) =>
    checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.accessToken) {
          throw new Error("User not authenticated. Please log in again.");
        }

        // Prepare all selected constraints
        const selectedConstraints = [
          ...airborneChecked.map(c => ({ constraint: String(c), category: "airborne_allergy" })),
          ...dietaryChecked.map(c => ({ constraint: String(c), category: "dietary_restriction" })),
          ...dietaryAllergens.map(c => ({ constraint: String(c), category: "dietary_allergy" })),
        ];

        console.log(selectedConstraints)

        // Get IDs for all constraints from backend
        const constraintIds = await Promise.all(
          selectedConstraints.map(async (c) => {
            const res = await axios.post("http://localhost:4000/api/foodConstraint/findOrCreate", c,
              { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );
            return res.data._id;
          })
        );

        // Build payload to send to backend
        const payload = {
          recipeName,
          description,
          event: eventId,
          date: new Date(),
          foodConstraints: constraintIds,
        };

        // Create recipe
        const res = await axios.post("http://localhost:4000/api/createRecipe", payload,
          { headers: {Authorization: `Bearer ${user.accessToken}`,},}
        );

        const recipe = res.data.recipe;
        console.log("Recipe created:", recipe);

        alert("Recipe created successfully!");

        if (onRecipeCreated) onRecipeCreated();

        onClose(); //Close modal after success

    } catch (err) {
      console.error("Error submitting recipe:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          ...styleModal,
          width: "45%",
          height: "60%",
          padding: "80px",
          borderRadius: "16px",
        }}
      >
        {/* Header */}
        <div style={{ fontSize: "42px", fontWeight: 600, marginBottom: "8px" }}>
          New Recipe Form.
        </div>
  
        {/* Alert */}
        {alertVisible && (
          <Alert
            severity="error"
            style={{ marginBottom: "16px", borderRadius: "8px" }}
          >
            ⚠️ Please remove any ingredients under "airborne allergen" as they are unsafe for some guests.
          </Alert>
        )}
  
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "2px" }}>
          <TextField
            label="Recipe Name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            fullWidth
            required
            margin="normal"
            sx={{ borderRadius: "8px" }}
          />
  
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            sx={{ borderRadius: "8px" }}
          />

          {/* Airborne Allergies */}

          <div style={{ fontSize: "20px", fontWeight: 600, paddingTop: "16px"}}>Airborne Allergies</div>

          <h3 style={{ fontSize: "16px", fontWeight: 400, color: "#1f2937", margin: 0, letterSpacing: "-0.5px" }}>
            Are any of the following an ingredient in your dish? Please select all that apply.
          </h3>

          <FormGroup>
            {constraints.airborneAllergies.map((a) => (
              <FormControlLabel
                key={a}
                control={
                  <Checkbox
                    value={a}
                    checked={airborneChecked.includes(a)}
                    onChange={handleAirborneChange}
                  />
                }
                label={a}
                sx={{ borderRadius: "8px" }}
              />
            ))}
          </FormGroup>

          {/* Dietary Restrictions */}

          <div style={{ fontSize: "20px", fontWeight: 600, paddingTop: "16px" }}>Dietary Restrictions</div>

          <h3 style={{ fontSize: "16px", fontWeight: 400, color: "#1f2937", margin: 0, letterSpacing: "-0.5px" }}>
            Does your dish adhere to any of these dietary restrictions? Please select all that apply.
          </h3>
  
          <FormGroup>
            {constraints.dietaryRestrictions.map((d) => (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    value={d}
                    checked={dietaryChecked.includes(d)}
                    onChange={handleDietaryChange}
                  />
                }
                label={d}
                sx={{ borderRadius: "8px" }}
              />
            ))}
          </FormGroup>

          {/* Dietary Allergens */}
          <div style={{ fontSize: "20px", fontWeight: 600, paddingTop: "16x"}}>Dietary Allergens</div>

          <h3 style={{ fontSize: "16px", fontWeight: 400, color: "#1f2937", margin: 0, letterSpacing: "-0.5px" }}>
            Please add any ingredients from this list that you will be using.
          </h3>
  
          <Autocomplete
            multiple
            freeSolo
            options={constraints.dietaryAllergies}
            value={dietaryAllergens}
            onChange={(e, newValue) => setDietaryAllergens(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key: chipKey, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={chipKey}
                    label={option}
                    {...tagProps}
                    sx={{
                      backgroundColor: "#FDF9C5",
                      borderRadius: "16px",
                      margin: "2px",
                    }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Allergens" sx={{ borderRadius: "8px" }} />
            )}
          />
          <div style={{ paddingTop: "16px" }}>
            <RecipeImage/>
          </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
              <button
                type="submit"
                disabled={loading || submitDisabled}
                style={{
                  backgroundColor: "#8B7E96",
                  width: "300px",          // fixed typo
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: "16px",
                  fontWeight: 600,
                  fontSize: "16px",
                  border: "none",
                  cursor: loading || submitDisabled ? "not-allowed" : "pointer",
                }}
              >
                Submit
              </button>
            </div>
        </form>
      </Box>
    </Modal>
  );
  
}