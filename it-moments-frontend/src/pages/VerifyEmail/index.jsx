import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [status, setStatus] = useState('Đang xử lý...');
    const location = useLocation();
    const navigate = useNavigate();

    const getTokenFromUrl = () => {
        const params = new URLSearchParams(location.search);
        return params.get('token');
    };

    useEffect(() => {
        const token = getTokenFromUrl();

        if (token) {
            axios.get(`http://localhost:3000/api/v1/auth/verify?token=${token}`)
                .then(response => {
                    setStatus(response.data.message);
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                })
                .catch(error => {
                    setStatus(error.response?.data?.message || 'Lỗi xác thực tài khoản');

                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                });
        } else {
            setStatus('Không tìm thấy token xác thực');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    }, [location, navigate]);

    return (
        <div>
            <h2>{status}</h2>
        </div>
    );
};

export default VerifyEmail;
