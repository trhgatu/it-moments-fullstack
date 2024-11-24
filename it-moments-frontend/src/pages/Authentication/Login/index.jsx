import { useState, useRef, useEffect } from 'react';
import { Button, Typography, message, Divider, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useClientUser } from '../../../context/ClientUserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config/config';
import io from 'socket.io-client';
import styles from './Login.module.scss';

export default function Login() {
    const socket = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useClientUser();
    const navigate = useNavigate();

    // Countdown state
    const [countdown, setCountdown] = useState(3); // Bắt đầu đếm từ 3 giây
    const [isRedirecting, setIsRedirecting] = useState(false); // Trạng thái chuyển hướng

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    // Countdown logic
    useEffect(() => {
        if(isRedirecting && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer); // Clean up the interval on unmount or when countdown finishes
        }
    }, [isRedirecting, countdown]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            }, {
                withCredentials: true,
            });

            if(response.status === 200) {
                const data = response.data;
                localStorage.setItem('client_token', data.token);
                setUser(data.user);
                setError("");

                message.success("Đăng nhập thành công!");

                if(socket.current) {
                    socket.current.disconnect();
                }

                socket.current = io('https://it-moments-backend-production.up.railway.app', {
                    transports: ['websocket'],
                    withCredentials: true,
                    extraHeaders: {
                        'Authorization': `Bearer ${data.token}`,
                    }
                });

                socket.current.on('connect', () => {
                    socket.current.emit('register', data.token);
                });

                socket.current.on('notificationUpdate', (data) => {
                    console.log('Thông báo nhận được:', data);
                });

                socket.current.on('connect_error', (err) => {
                    console.error('Lỗi kết nối WebSocket:', err);
                    message.error("Lỗi kết nối. Không thể kết nối WebSocket.");
                });

                // Start redirect countdown
                setIsRedirecting(true);
            } else {
                message.error(response.data.message || "Đã có lỗi xảy ra.");
            }
        } catch(error) {
            message.error(error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập.");
            console.error("Lỗi đăng nhập:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if(countdown === 0) {
            navigate("/");
        }
    }, [countdown, navigate]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.loginContainer}>
                <div className={styles.loginForm}>
                    <div className='relative'>
                        <h1 className={`${styles.titleLogin} text-4xl font-extrabold text-center uppercase text-gray-900 `}>
                            Đăng nhập
                        </h1>
                        <Divider/>
                    </div>
                    {isRedirecting && (
                        <div className='flex items-center justify-center'>
                            <Spin className='mr-2' spinning={true} tip="Đang chuyển hướng" size="small" />
                        <div className="text-center text-2xl text-blue-700 ">
                            <span>Chuyển hướng đến trang chủ sau {countdown}...</span>
                        </div>
                        </div>

                    )}
                    <form onSubmit={handleLogin}>
                        <label className='ml-2 text-black text-2xl flex pb-6'>Email: </label>
                        <div className={styles.inputIcon}>
                            <input
                                type="email"
                                placeholder='Nhập email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span className={styles.icon}>
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                        </div>
                        <div className='ml-2 text-black text-2xl flex pb-6'><label >Mật khẩu: </label></div>
                        <div className={styles.inputIcon}>
                            <input
                                type={passwordShown ? "text" : "password"}
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className={styles.icon} onClick={togglePasswordVisibility}>
                                <FontAwesomeIcon
                                    icon={passwordShown ? faEyeSlash : faEye}
                                    className={styles.toggleEye}
                                />
                            </span>
                        </div>

                        <div className={styles.rememberForgot}>
                            <a href="/forgot-password">Quên mật khẩu?</a>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            Đăng nhập
                        </Button>
                    </form>

                    <p className={styles.signup}>
                        Bạn chưa có tài khoản? <a href="/register">Tạo tài khoản</a>
                    </p>

                    {/* Hiển thị thông báo đếm ngược */}

                </div>
            </div>
        </div>
    );
}
