import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useClientUser } from '../../../context/ClientUserContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useClientUser();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                console.log("Đăng nhập thành công:", data.message);
                navigate("/");
            } else {

                setError(data.message || "Đăng nhập thất bại!");
            }
        } catch (error) {
            setError("Đã xảy ra lỗi khi đăng nhập.");
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
