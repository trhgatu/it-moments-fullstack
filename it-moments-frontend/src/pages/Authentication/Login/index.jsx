import { useState, useRef, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useClientUser } from '../../../context/ClientUserContext';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import axios from 'axios';
import { API_URL } from '../../../config/config';
import styles from './Login.module.scss';
import io from 'socket.io-client';
export default function Login() {
    const socket = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useClientUser();
    const navigate = useNavigate();

    const showNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
            duration: 5,
            placement: 'topRight',
        });
    };

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

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

            const data = response.data;
            if(response.status === 200) {
                localStorage.setItem('client_token', data.token);
                setUser(data.user);
                setError("");
                showNotification("success", "Đăng nhập thành công!", "Bạn sẽ được chuyển hướng trong giây lát.");

                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                showNotification("error", "Đăng nhập thất bại!", data.message || "Đã có lỗi xảy ra.");
            }
        } catch(error) {
            showNotification("error", "Đăng nhập thất bại!", "Đã xảy ra lỗi khi đăng nhập.");
            console.error("Lỗi đăng nhập:", error);
        } finally {
            setLoading(false);
        }
    };
// Kết nối WebSocket sau khi đăng nhập thành công (đảm bảo token đã có)
useEffect(() => {
    const token = localStorage.getItem('client_token');

    if (token) {
        socket.current = io('http://localhost:3000', {
            transports: ['websocket'],
            withCredentials: true,
            extraHeaders: {
                'Authorization': `Bearer ${token}`,
            }
        });

        socket.current.on('connect', () => {
            console.log("Kết nối WebSocket thành công!");
        });

        socket.current.on('notificationUpdate', (data) => {
            console.log('Thông báo nhận được:', data);
        });

        // Cleanup: Ngắt kết nối khi component unmount
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    } else {
        console.log("Không tìm thấy token để kết nối WebSocket.");
    }
}, []);  // Chỉ thực hiện lần đầu khi component mount, token đã được lưu trong localStorage


    return (
        <div className={styles.wrapper}>
            <div className={styles.loginContainer}>
                <div className={styles.loginForm}>
                    <Typography variant="h3">Đăng nhập</Typography>
                    <p>Vui lòng nhập thông tin chi tiết của bạn.</p>

                    <form onSubmit={handleLogin}>
                        <div className={styles.inputIcon}>
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span className={styles.icon}>
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                        </div>

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

                        <button type="submit" disabled={loading}>
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <p className={styles.signup}>
                        Bạn chưa có tài khoản? <a href="/register">Tạo tài khoản</a>
                    </p>

                    <Typography variant="body1" align="center" style={{ margin: '20px 0' }}>Hoặc</Typography>
                </div>
            </div>
        </div>
    );
}
