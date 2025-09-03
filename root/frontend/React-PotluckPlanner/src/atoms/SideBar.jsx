// imports
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Drawer, IconButton, List, Divider, ListItem, ListItemButton, ListItemText, MenuIcon, Stack, Chip } from '@mui/material'

export default function SideBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const nav = useNavigate();
  // Navigation with 'path' variable passed
  const navigate= (path)=> {
      nav(path);
      setOpen(false);
    };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Name', 'Phone Number', 'Email'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Airborne', 'Ingestion', 'Restrictions'].map((text) => {
        // Define background color based on label
        let backgroundColor;
        switch (text) {
            case 'Airborne':
                backgroundColor = '#FF4C4C'; // red
            break;
            
            case 'Ingestion':
                backgroundColor = '#FFA500'; // orange
            break;
            case 'Restrictions':
                backgroundColor = '#FFD700'; // yellow
            break;
            default:
                backgroundColor = 'black';
    }

    return (
      <ListItem key={text} disablePadding>
        <Chip
          label={text}
          style={{
            width: '80%',
            padding: '10px 16px',
            alignSelf: 'center',
            textAlign: 'left',
            background: backgroundColor,
            color: 'white',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '4px',
            margin: '8px 0',
          }}
          onClick={() => console.log(`Clicked ${text}`)}
        />
      </ListItem>
        );
    })}
    </List>

      <Divider />
      <Stack>
        <button
            onClick={() => navigate("/Preferences")}
        >
            Preferences.
        </button>
        <button
            onClick={() => navigate("/Dashboard")}
        >
            Dashboard.
        </button>
      </Stack>
    </Box>
  );

  return (
    <div>
      <IconButton
        onClick={toggleDrawer(true)}
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ m: 1, color: '#8B7E96' }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}