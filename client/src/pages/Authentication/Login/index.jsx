import React, { useContext } from 'react'
import {Button, Typography} from '@mui/material'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { AuthContext } from "../../../context/AuthProvider"
import { useNavigate } from 'react-router-dom';
import './Login.module.scss';


export default function Login() {

    const auth = getAuth();
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLoginWithGoogle= async () => {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
    }
    if(user?.uid){
        navigate('/');
        return;
    }

    return (
        ////Giao diện Login
        <div className='wrapper'>
            <h3>Login</h3>
            <Button variant='outlined' onClick={handleLoginWithGoogle}>
                Login with Google
            </Button>
        </div>
    )
}
