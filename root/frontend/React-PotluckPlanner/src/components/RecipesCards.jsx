// import React, { useEffect, useState } from "react";
// import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

// export default function AllRecipes() {
//   const [recipes, setRecipes] = useState([]);

//   useEffect(() => {
//     async function fetchRecipes() {
//       try {
//         const res = await fetch("http://localhost:4000/api/recipesAll");
//         console.log("HTTP status:", res.status);
//         const text = await res.text();
//         console.log("Response text:", text); // see what the backend is actually returning
//         const data = JSON.parse(text);
        
//         // const data = await res.json();
//         setRecipes(data);
//       } catch (err) {
//         console.error("Error fetching recipes help:", err);
//       }
//     }

//     fetchRecipes();
//   }, []);

//   return (
//     <Box sx={{ padding: 2 }}>
//       <Grid container spacing={2}>
//         {recipes.map((recipe) => (
//           <Grid item xs={12} sm={6} md={4} key={recipe._id}>
//             <Card sx={{ minHeight: "200px" }}>
//               <CardContent>
//                 <h2>
//                   {recipe.recipeName}
//                 </h2>
//                 <p>
//                   Description: {recipe.description}
//                 </p>

//                 <h3>Airborne:</h3>
//                 <h4>
//                   {recipe.questions.AirborneQuestion?.AirAnswer?.join(", ") || "None"}
//                 </h4>

//                 <h3>Dietary:</h3>
//                 <h4>
//                   {recipe.questions.DietaryQuestion?.DietaryAnswer?.join(", ") || "None"}
//                 </h4>

//                 <h3>Restrictions:</h3>
//                 <h4>
//                   {recipe.questions.DietaryRestrictionsQuestion?.DRAnswer?.join(", ") || "None"}
//                 </h4>

//                 <h3>Preferences:</h3>
//                 <h4>
//                   {recipe.questions.PreferencesQuestion?.PreferencesAnswer?.join(", ") || "None"}
//                 </h4>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }


import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("http://localhost:4000/api/recipesAll");
        console.log("HTTP status:", res.status);
        const text = await res.text();
        console.log("Response text:", text);
        const data = JSON.parse(text);
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes help:", err);
      }
    }

    fetchRecipes();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        {recipes.map((recipe) => {
          const q = recipe.questions || {};

          return (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <Card sx={{ width: "300px", minHeight: "200px" }}>
                <CardContent>
                  <h2>{recipe.recipeName}</h2>
                  <h4>
                    Description: {recipe.description}
                  </h4>

                  {/* Render each allergy type only if it exists and has items */}
                  {q.AirborneQuestion?.AirAnswer?.length > 0 && (
                    <>
                      <h3>Airborne:</h3>
                      <p>
                        {q.AirborneQuestion.AirAnswer.join(", ")}
                      </p>
                    </>
                  )}

                  {q.DietaryQuestion?.DietaryAnswer?.length > 0 && (
                    <>
                      <h3>Dietary:</h3>
                      <p>
                        {q.DietaryQuestion.DietaryAnswer.join(", ")}
                      </p>
                    </>
                  )}

                  {q.DietaryRestrictionsQuestion?.DRAnswer?.length > 0 && (
                    <>
                      <h3>Restrictions:</h3>
                      <p>
                        {q.DietaryRestrictionsQuestion.DRAnswer.join(", ")}
                      </p>
                    </>
                  )}

                  {q.PreferencesQuestion?.PreferencesAnswer?.length > 0 && (
                    <>
                      <h3>Preferences:</h3>
                      <p>
                        {q.PreferencesQuestion.PreferencesAnswer.join(", ")}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
