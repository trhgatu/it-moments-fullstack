// UserMenu.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Avatar, Typography, Box, Menu, MenuItem } from '@mui/material';
import { getAuth } from 'firebase/auth';

export default function UserMenu() {
    const { user } = useContext(AuthContext);
    const { displayName, photoURL } = user;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const auth = getAuth();

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleLogout = () => {
        auth.signOut();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }} onClick={handleClick}>
                <Typography>{displayName}</Typography>
                <Avatar
                    alt="avatar"
                    src={photoURL}
                    sx={{ width: 24, height: 24, marginLeft: '5px' }}
                />
            </Box>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
}
