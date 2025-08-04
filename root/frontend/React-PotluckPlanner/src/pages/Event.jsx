//imports

import Stack from "@mui/material/Stack";
import NavBar from "../components/NavBar";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';


export  default function Event () {
    return (
        <div>
            <div>
                <NavBar/>
            </div>
            <div style={{ margin: "10px", padding: "10px" }}>
                <h1>Event Name.</h1>
                <Stack direction="row">
                    <h2 style={{ margin: "10px", padding: "10px" }}> # of Attendees</h2>
                    <AvatarGroup max={4} style={{ margin: "10px", padding: "10px" }}>
                        <Avatar alt="Remy Sharp" src="/AvatarImages/CrabAvatar.webp"/>
                        <Avatar alt="Travis Howard" src="/AvatarImages/CrabAvatar.webp" />
                        <Avatar alt="Cindy Baker" src="/AvatarImages/CrabAvatar.webp" />
                        <Avatar alt="Agnes Walker" src="/AvatarImages/CrabAvatar.webp" />
                        <Avatar alt="Trevor Henderson" src="/AvatarImages/CrabAvatar.webp" />
                    </AvatarGroup>
                    <h3 style={{ margin: "10px", padding: "10px" }} >Date</h3>
                    <h3 style={{ margin: "10px", padding: "10px" }} >Location</h3>
                </Stack>

            </div>
        </div>
    );
}