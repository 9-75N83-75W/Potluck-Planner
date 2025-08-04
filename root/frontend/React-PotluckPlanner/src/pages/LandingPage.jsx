// imports for components
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import WelcomeBlock from "../components/WelcomeBlock";




function LandingPage() {

  const nav = useNavigate();

  // Navigation with 'path' variable passed
  const navigate= (path)=> {
    nav(path);
  };

  return (

    <div>
      {/* //Welcome text
      //logo (crab emoji for now) 🦀🦀🦀🦀🦀🦀
      //short sentence about the app: like "Plan your next potluck with ease"
      //button to create user (redirects to CreateUser.jsx)
      //button to sign in (redirects to SignIn.jsx)

      //Potential AI generated stretch goals:
      //button to contact the developer
      //button to view the privacy policy
      //button to view the terms of service
      //button to view the about page --> linktree or github!
      //Colabs with other group projects 👀 */}
    
      <div
        style={{
          display: "flex",
          flexDirection: "column",   // stack items vertically
          justifyContent: "end",  // center vertically
          alignItems: "flex-start",  // left-align content
          height: "50vh",           // take full viewport height
          paddingLeft: "10px",       // optional: push away from left edge
      }}
      >
        <WelcomeBlock/>
      </div>
      <div>
        <Grid
            container direction="row"
            sx={{justifyContent: "flex-start", alignItems: "center",}}>
        <button onClick={() => navigate('/CreateAccount')}>Create Account</button>
        <button onClick={() => navigate('/SignIn')}>Sign In</button>
        </Grid>
      </div>
    </div>
  );
}

export default LandingPage;

