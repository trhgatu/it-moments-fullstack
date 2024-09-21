import { Typography, Box } from '@mui/material';
import React from 'react';
import UserMenu from '../../components/UserMenu';
import Slider from './components/Slider';


export default function Home() {
    return <>
        <Slider />
        <div className="text-black font-bold">
            Home
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'right', mb: '10px' }}>
            <UserMenu />
        </Box>
    </>
}
