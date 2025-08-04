// imports for components
import { useNavigate } from "react-router-dom";
import CreateUserForm from "../components/CreateUserForm";
import { Box } from "@mui/material";

function CreateUser() {

    const nav = useNavigate();

    // Navigation with 'path' variable passed
    const navigate= (path)=> {
      nav(path);
    };
  
    return (
        //welcome text
        //sign up! text
        //form with fields:
            //first name
            //last name
            //phone number?
            //email
            //password
            //confirm password
            //button to create user (redirects to TBD -- UserSettings.jsx or UserProfile.jsx?)
            //button to go back to sign in page (redirects to SignIn.jsx)
      <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      >
        <h1>Create an account.</h1>

        <div>
          <CreateUserForm></CreateUserForm>
        </div>
        <div>
          <button> Create Account. </button>
        </div>

        <div>
          <h2>Already have an account? Login here. ⬇️ </h2>
          <button onClick={() => navigate('/SignIn')}>Sign In</button>
        </div>
      </Box>
    );
}
  
  export default CreateUser;
  