import { useState, useEffect } from 'react';
import styles from './Register.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../../../config/config";
import axios from "axios"; // Import axios
import { message, Divider } from 'antd';

function Register() {
    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

    // State cho form
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

        if(password !== confirmPassword) {
            message.error('Mật khẩu không khớp');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                fullName,
                email,
                password,
            });

            if(response.status === 200) {
                message.success(response.data.message || 'Đăng ký thành công');
                navigate('/login'); // Điều hướng đến trang login sau khi đăng ký thành công
            } else {
                message.error(response.data.message || 'Đăng ký thất bại');
            }
        } catch(error) {
            console.error("Lỗi:", error);
            message.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    return (
        <div className={styles.registerBackground}>
            <div className={styles.registerContainer}>
                <div className={styles.registerForm}>
                    <h1 className={`${styles.titleRegister} text-4xl font-extrabold text-center uppercase text-gray-900 `}>
                        Đăng ký tài khoản
                    </h1>
                    <Divider />
                    <form onSubmit={handleSubmit}>
                        <label className='ml-2 text-black text-2xl flex pb-6'>Họ tên: </label>
                        <div className={styles.inputIcon}>
                            <input
                                type="text"
                                placeholder="Họ tên"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <span className={styles.icon}>
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                        </div>
                        <label className='ml-2 text-black text-2xl flex pb-6'>Email: </label>
                        <div className={styles.inputIcon}>

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span className={styles.icon}>
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                        </div>
                        <label className='ml-2 text-black text-2xl flex pb-6'>Mật khẩu:</label>
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
                        <label className='ml-2 text-black text-2xl flex pb-6'>Nhập lại mật khẩu: </label>
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

                        <button type="submit">Đăng ký</button>
                    </form>

                    <div className='py-4 text-center'>
                        <span className="signup text-2xl">
                            Bạn đã có tài khoản?{" "}
                            <span
                                onClick={() => navigate('/login')}
                                className="text-blue-500 cursor-pointer hover:underline ml-4"
                            >
                                Đăng nhập
                            </span>
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Register;
