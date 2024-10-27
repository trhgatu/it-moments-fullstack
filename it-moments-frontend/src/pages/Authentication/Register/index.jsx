import { useEffect, useState } from 'react';
import styles from './Register.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Register() {
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

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



    return (
        <div className={styles.registerBackground}>
            <div className={styles.registerContainer}>
                <div className={styles.registerForm}>
                    <h1>Đăng ký</h1>
                    <form>
                        <div className={styles.inputIcon}>
                            <input type="text" placeholder="Họ tên" required />
                            <span className={styles.icon}>
                                <FontAwesomeIcon icon={faUser} /></span>
                        </div>

                        <div className={styles.inputIcon}>
                            <input type="email" placeholder="Email" required />
                            <span className={styles.icon}>
                                <FontAwesomeIcon icon={faEnvelope} /></span>
                        </div>

                        <div className={styles.inputIcon}>
                            <input
                                type={passwordShown ? "text" : "password"}
                                placeholder="Mật khẩu"
                                required
                            />
                            <span className={styles.icon}
                                onClick={togglePasswordVisibility}>
                                <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                            </span>
                        </div>

                        <div className={styles.inputIcon}>
                            <input
                                type={confirmPasswordShown ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                required
                            />
                            <span className={styles.icon} onClick={toggleConfirmPasswordVisibility}>
                                <FontAwesomeIcon icon={confirmPasswordShown ? faEyeSlash : faEye} />
                            </span>
                        </div>

                        <button type="submit">Đăng ký</button>
                    </form>

                    <p className="signup">Bạn đã có tài khoản? <Link to="/">Đăng nhập</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
