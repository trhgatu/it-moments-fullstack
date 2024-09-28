import  { useState, useContext } from 'react';
import { Button, Typography } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { AuthContext } from "../../../context/AuthProvider";
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './Login.module.scss'; // Sử dụng SCSS module

export default function Login() {

    const auth = getAuth();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Giả lập quá trình đăng nhập, với hiệu ứng spinner trong 2 giây
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const handleLoginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    if (user?.uid) {
        navigate('/');
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.loginContainer}>
                <div className={styles.loginForm}>
                    <Typography variant="h3">Đăng nhập</Typography>
                    <p>Vui lòng nhập thông tin chi tiết của bạn.</p>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputIcon}>
                            <input type="email" placeholder="E-mail" required />
                            <span className={styles.icon}>
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                        </div>

                        <div className={styles.inputIcon}>
                            <input
                                type={passwordShown ? "text" : "password"}
                                placeholder="Mật khẩu"
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

                        <button type="submit" disabled={loading}>
                            {loading ? <div className={styles.spinner}></div> : "Đăng nhập"}
                        </button>
                    </form>

                    <p className={styles.signup}>
                        Bạn chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link>
                    </p>

                    <Typography variant="body1" align="center" style={{ margin: '20px 0' }}>Hoặc</Typography>

                    {/* Đăng nhập bằng Google */}
                    <Button variant="outlined" onClick={handleLoginWithGoogle}>
                        Login with Google
                    </Button>
                </div>
            </div>
        </div>
    );
}
