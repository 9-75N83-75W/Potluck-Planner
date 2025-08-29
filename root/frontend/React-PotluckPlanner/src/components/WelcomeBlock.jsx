import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function WelcomeBlock() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "40%",
        width: "75%",
        borderRadius: "18px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // medium shadow
        zIndex: 3,
        position: "relative", // needed for z-index to work
        padding: "24px",
        margin: "24px",
        marginTop: "20vh",
        marginBottom: "20vh",
      }}
    >
      {/* Welcome block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          alignItems: "flex-start",
          paddingLeft: "18px",
          fontSize: "26px",
        }}
      >
        <h1>Welcome to Potluck Planner!</h1>
      </div>

      {/* Buttons */}
      <div>
        <Grid
          container
          direction="row"
          sx={{ justifyContent: "flex-start", alignItems: "center", margin: "28px" }}
        >
          <button style={{ margin: "18px", padding: "16px 32px", fontSize: "22px", borderRadius: "12px", cursor: "pointer", }} onClick={() => navigate("/CreateAccount")}>
            Create Account
          </button>
          <button style={{ margin: "18px", padding: "16px 32px", fontSize: "22px", borderRadius: "12px", cursor: "pointer", }} onClick={() => navigate("/SignIn")}>
            Sign In
          </button>
        </Grid>
      </div>
    </div>
  );
}


