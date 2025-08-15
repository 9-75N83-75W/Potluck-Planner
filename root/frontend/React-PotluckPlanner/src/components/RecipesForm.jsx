import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Modal,
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import RecipesCards from "../components/RecipesCards";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "90vw",         // keeps it within screen width
  maxHeight: "90vh",        // keeps it within screen height
  overflowY: "auto",        // scroll inside modal if content is too tall
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function RecipesForm() {
  const [open, setOpen] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [allergyOptions, setAllergyOptions] = useState({});
  const [selectedAllergies, setSelectedAllergies] = useState({
    AirborneQuestion: [],
    DietaryQuestion: [],
    DietaryRestrictionsQuestion: [],
    PreferencesQuestion: [],
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const location = useLocation();

  const email = localStorage.getItem("userEmail");

  // Extract ID from URL after "/Event/"
  const id = location.pathname.split("/Event/")[1] || "";

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        console.error("No event ID found in URL");
        return;
      }

      try {
        console.log("Event ID from URL:", id);

        // 1. Fetch event by ID
        const eventRes = await fetch(`http://localhost:4000/api/Event/${id}`);
        if (!eventRes.ok) throw new Error(`Event fetch failed: ${eventRes.status}`);
        const eventData = await eventRes.json();

        // const invitedEmails = eventData.invitedEmails || [];
        // console.log("Invited Emails:", invitedEmails);
        // const invitedEmails = eventData.event?.invitedEmails || [];
        // console.log("Invited Emails:", invitedEmails);
        // const invitedEmails = eventData.invitedEmails || [];

        // // Only add if userEmail exists and isn't already in the array
        // if (email && !invitedEmails.includes(email)) {invitedEmails = [...invitedEmails, email]; }

        // console.log("Invited Emails", invitedEmails)

        const invitedEmails = eventData.invitedEmails || [];
        const updatedInvitedEmails = (email && !invitedEmails.includes(email))
          ? [...invitedEmails, email]
          : invitedEmails;

        console.log("Invited Emails", updatedInvitedEmails);

        // 2. Fetch all users
        const usersRes = await fetch("http://localhost:4000/api/getAllUsers");
        if (!usersRes.ok) throw new Error(`Users fetch failed: ${usersRes.status}`);
        const allUsers = await usersRes.json();

        // 3. Filter for invited users
        const invitedUsers = allUsers.filter((u) =>
          updatedInvitedEmails.includes(u.email)
        );

        // 4. Merge and deduplicate allergies
        const mergedAllergies = {
          AirborneQuestion: [],
          DietaryQuestion: [],
          DietaryRestrictionsQuestion: [],
          PreferencesQuestion: [],
        };

        invitedUsers.forEach((user) => {
          if (user.allergies?.AirborneAllergy)
            mergedAllergies.AirborneQuestion.push(...user.allergies.AirborneAllergy);
          if (user.allergies?.DietaryAllergy)
            mergedAllergies.DietaryQuestion.push(...user.allergies.DietaryAllergy);
          if (user.allergies?.DietaryRestrictions)
            mergedAllergies.DietaryRestrictionsQuestion.push(...user.allergies.DietaryRestrictions);
          if (user.allergies?.Preferences)
            mergedAllergies.PreferencesQuestion.push(...user.allergies.Preferences);
        });

        // Remove duplicates
        Object.keys(mergedAllergies).forEach((key) => {
          mergedAllergies[key] = [...new Set(mergedAllergies[key])];
        });

        setAllergyOptions(mergedAllergies);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();

    
  }, [id]);

  useEffect(() => {
    if (selectedAllergies.AirborneQuestion.length > 0) {
      setIsSubmitDisabled(true);
      alert("You cannot submit a recipe if any Airborne allergies are selected.");
    } else {
      setIsSubmitDisabled(false);
    }
  }, [selectedAllergies.AirborneQuestion]);

  const handleCheckboxChange = (category, value) => {
    setSelectedAllergies((prev) => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleSubmit = async () => {
    const email = localStorage.getItem("userEmail");
    const payload = {
      email,
      recipeName,
      description,
      questions: {
        AirborneQuestion: { AirAnswer: selectedAllergies.AirborneQuestion },
        DietaryQuestion: { DietaryAnswer: selectedAllergies.DietaryQuestion },
        DietaryRestrictionsQuestion: { DRAnswer: selectedAllergies.DietaryRestrictionsQuestion },
        PreferencesQuestion: { PreferencesAnswer: selectedAllergies.PreferencesQuestion },
      },
    };

    try {
      const res = await fetch("http://localhost:4000/api/createRecipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Recipe Created!");
        setOpen(false);
        setRecipeName("");
        setDescription("");
        setSelectedAllergies({
          AirborneQuestion: [],
          DietaryQuestion: [],
          DietaryRestrictionsQuestion: [],
          PreferencesQuestion: [],
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error creating recipe:", err);
    }
  };


  // Map backend keys to human-friendly display names
  const displayNames = {
    AirborneQuestion: "Airborne",
    DietaryQuestion: "Dietary",
    DietaryRestrictionsQuestion: "Restrictions",
    PreferencesQuestion: "Preferences"
    };


  return (
    <div>
      <button onClick={() => setOpen(true)}>Add Recipe</button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <h2>Add a Recipe</h2>

          <TextField
            fullWidth
            label="Recipe Name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
          />

          {Object.keys(allergyOptions).map((category) => (
            <div key={category}>
              {/* <h2>{category}</h2> */}
              <h3>{displayNames[category] || category}</h3>
              <FormGroup>
                {allergyOptions[category].map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={selectedAllergies[category].includes(option)}
                        onChange={() => handleCheckboxChange(category, option)}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
            </div>
          ))}

          {/* <button onClick={handleSubmit} style={{ marginTop: "16px" }}> */}
          <button onClick={handleSubmit} style={{ marginTop: "16px" }} disabled={isSubmitDisabled} >
            Submit Recipe
          </button>
        </Box>
      </Modal>

      <div>
        <RecipesCards/>
      </div>

    </div>
  );
}

