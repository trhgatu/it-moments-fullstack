import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useClientUser } from '../../../context/ClientUserContext';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import axios from 'axios';
import { API_URL } from '../../../config/config';
import styles from './Login.module.scss';

export default function Login() {
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
                setUser(data.user);
                setError("");
                showNotification("success", "Đăng nhập thành công!", "Bạn sẽ được chuyển hướng trong giây lát.");

                setTimeout(() => {
                    window.location.href = "/";
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
