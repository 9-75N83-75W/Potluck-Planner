// imports

import React, { useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, Modal, Box } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
  maxWidth: 500,
  width: "90%",
};

export default function RecipesCards({ recipes }) {

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleClose = () => setSelectedRecipe(null);
  console.log("Food Constraints:", recipes)

  return (
    <>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {recipes.map((recipe) => (
          <Card
            key={recipe._id}
            sx={{
              width: 250,
              height: 150,
              mb: 2,
              cursor: "pointer",
              borderRadius: 3,
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              backdropFilter: "blur(4px)",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.03)" },
            }}
            onClick={() => setSelectedRecipe(recipe)}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {recipe.recipeName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                By: {recipe.createdBy.firstName} {recipe.createdBy.lastName}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                {recipe.foodConstraints?.map((fc) => (
                  <Chip
                    key={fc._id}
                    label={fc.constraint}
                    size="small"
                    color="primary"
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Modal open={!!selectedRecipe} onClose={handleClose}>
        <Box sx={modalStyle}>
          {selectedRecipe && (
            <>
              <Typography variant="h5" gutterBottom>
                {selectedRecipe.recipeName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                By: {selectedRecipe.createdBy.firstName} {selectedRecipe.createdBy.lastName}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Email: {selectedRecipe.createdBy.email}
              </Typography>
              <Typography variant="body1" sx={{ my: 2 }}>
                {selectedRecipe.description || "No description provided."}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {selectedRecipe.foodConstraints?.map((fc) => (
                  <Chip
                    key={fc._id}
                    label={fc.constraint}
                    size="small"
                    color="primary"
                  />
                ))}
              </Stack>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

