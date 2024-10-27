import { useEffect, useState } from 'react';
import styles from './Register.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Register() {
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

    // Thêm các state cho form
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        document.body.className = 'register-page';
        return () => {
            document.body.className = '';
        };
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordShown(!confirmPasswordShown);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu không khớp');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                setErrorMessage('');
            } else {
                setErrorMessage(data.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error("Lỗi:", error);
            setErrorMessage('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    return (
        <div className={styles.registerBackground}>
            <div className={styles.registerContainer}>
                <div className={styles.registerForm}>
                    <h1>Đăng ký</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputIcon}>
                            <input
                                type="text"
                                placeholder="Họ tên"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <span className={styles.icon}>
                                <FontAwesomeIcon icon={faUser} /></span>
                        </div>

                        <div className={styles.inputIcon}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span className={styles.icon}>
                                <FontAwesomeIcon icon={faEnvelope} /></span>
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
                                <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                            </span>
                        </div>

                        <div className={styles.inputIcon}>
                            <input
                                type={confirmPasswordShown ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className={styles.icon} onClick={toggleConfirmPasswordVisibility}>
                                <FontAwesomeIcon icon={confirmPasswordShown ? faEyeSlash : faEye} />
                            </span>
                        </div>

                        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

                        <button type="submit">Đăng ký</button>
                    </form>

                    <p className="signup">Bạn đã có tài khoản? <Link to="/">Đăng nhập</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
