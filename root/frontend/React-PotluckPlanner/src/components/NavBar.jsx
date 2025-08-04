//imports
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SideBar from "../atoms/SideBar";
//import {AppBar, Toolbar, Typography} from "@mui/material";

export default function NavBar() {
  const location = useLocation();

  const pageTitles = {
    '/Dashboard': 'Dashboard',
    '/Preferences': 'Preferences',
    '/Event': 'Event',
    // Add more as needed
  };

  const pageTitle = pageTitles[location.pathname] || 'Page';

    return (
    <Box sx={{ flexGrow: 1 , width: '100%'}}>
      <AppBar position="static" sx={{ width: '100%', backgroundColor: '#F1F0EB' }}>
        <Toolbar variant="dense">
          <SideBar/>
          <h1 style={{ color: '#8B7E96' }}>
            {pageTitle}
          </h1>
        </Toolbar>
      </AppBar>
    </Box>
    );
}