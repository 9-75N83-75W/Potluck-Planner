import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Checkbox, FormGroup, FormControlLabel, Button, Chip, Autocomplete, Alert, CircularProgress} from "@mui/material";
import RecipesCards from "../components/RecipesCards";
import axios from "axios";
import FoodConstraint from "../../../../backend/models/FoodConstraint";

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

        <Box sx={ styleModal }>

          <h1>Recipe Form</h1>

          {alertVisible && (
            <Alert severity="error" sx={{ mb: 2 }}>
              ⚠️ This dish contains an ingredient extremely unsafe for some guests!
            </Alert>
          )}


          <form onSubmit={handleSubmit}>

            <TextField
              label = "Recipe Name"
              value = {recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              fullWidth
              required
              margin = "normal"
            />

            <TextField
              label = "Description"
              value = {description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multilinerows = {3}
              margin = "normal"
            />

            < h3>
              Airborne Allergies
            </h3>
            <FormGroup>
              {constraints.airborneAllergies.map((a) => (
                <FormControlLabel
                  key = {a}
                  control = {
                    <Checkbox
                      value = {a}
                      checked = {airborneChecked.includes(a)}
                      onChange = {handleAirborneChange}
                    />
                  }
                  label = {a}
                />
              ))}
            </FormGroup>

            < h3>
              Dietary Restrictions
            </h3>
            <FormGroup>
              {constraints.dietaryRestrictions.map((d) => (
                <FormControlLabel
                  key = {d}
                  control = {
                    <Checkbox
                      value = {d}
                      checked = {dietaryChecked.includes(d)}
                      onChange = {handleDietaryChange}
                    />
                  }
                  label = {d}
                />
              ))}
            </FormGroup>

            < h3>
              Dietary Allergens
            </h3>
            <Autocomplete
              multiple
              freeSolo
              options = {constraints.dietaryAllergies}
              value = {dietaryAllergens}
              onChange = {(e, newValue) => setDietaryAllergens(newValue)}
              renderTags = {(value, getTagProps) =>
                value.map((option, index) => {
                  const { key: chipKey, ...tagProps } = getTagProps({ index }); // destructure key out
                  return <Chip key={chipKey} label={option} {...tagProps} sx={{ backgroundColor: "#FDF9C5" }} />
              })
              }
              renderInput={(params) => (
                <TextField {...params} variant = "outlined" label = "Allergens" />
              )}
            />

            <button type="submit" variant="contained" disabled = {loading || submitDisabled} >
                  {loading ? <CircularProgress size={24} /> : "Add Recipe"}
            </button>
          </form>

        </Box>

      </Modal>

  )
}