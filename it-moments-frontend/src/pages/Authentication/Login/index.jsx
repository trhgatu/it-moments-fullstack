import { useState } from 'react';
import axios from 'axios'; // Import axios
import { Button, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const { setUser } = useUser();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); // Bắt đầu quá trình đăng nhập
        try {
            const response = await axios.post(
                'http://localhost:3000/api/v1/auth/login',
                {
                    email: email,
                    password: password
                },
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                console.log("Đăng nhập thành công:", response.data);
                const tokenResponse = await axios.post(
                    "http://localhost:3000/api/v1/auth/verify-token",
                    {},
                    {
                        withCredentials: true,
                    }
                );

                if (tokenResponse.status === 200) {
                    setUser(tokenResponse.data.user);
                    console.log(tokenResponse.data.user);

                    setTimeout(() => {
                        navigate("/");
                    }, 500);
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.');
                } else if (error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Có lỗi xảy ra. Vui lòng thử lại.');
                }
            } else {
                setError('Có lỗi xảy ra, vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false); // Kết thúc quá trình đăng nhập
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

                        {/* Hiển thị thông báo lỗi nếu có */}
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
