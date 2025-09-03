// imports for components
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import SignInForm from "../components/SignInForm";

export default function SignIn() {

    const nav = useNavigate();

    // Navigation with 'path' variable passed
    const navigate= (path)=> {
      nav(path);
    };
  
    return (
      
      <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
    >
      <h1>
        Sign In.
      </h1>
      <div>
        <SignInForm/>
      </div>

      <div>
        <h2>New to Potluck Planner? Create an account first. ⬇️ </h2>
      <button
        onClick={() => navigate("/CreateAccount")}
      >
        Create Account
      </button>
      </div>
    </Box>
    );
  };