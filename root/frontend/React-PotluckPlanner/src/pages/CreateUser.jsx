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
          <CreateUserForm/>
        </div>
        <div>
          <h2>Already have an account? Login here. ⬇️ </h2>
          <button onClick={() => navigate('/SignIn')}>Sign In</button>
        </div>
      </Box>
    );
}
  
  export default CreateUser;
  