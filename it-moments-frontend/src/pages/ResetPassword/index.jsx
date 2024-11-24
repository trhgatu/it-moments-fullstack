import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";  // Thêm useNavigate
import { message, Input, Button, Form } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // Import icon "mắt"
import axios from "axios";
import { API_URL } from "../../config/config";
import slide1 from "../../assets/images/slider_1.jpg"; // Import ảnh nền

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();  // Hook để chuyển hướng người dùng
    const [countdown, setCountdown] = useState(3);  // Khởi tạo thời gian đếm ngược
    const [countdownMessage, setCountdownMessage] = useState("");  // State để lưu thông điệp đếm ngược

    const [passwordVisible, setPasswordVisible] = useState(false); // Quản lý trạng thái hiển thị mật khẩu

    // Kiểm tra token ngay khi component được render
    useEffect(() => {
        if (!token) {
            message.error("Token không hợp lệ hoặc đã hết hạn.");
        }
    }, [token]);

    const handleSubmit = async (values) => {
        const { password, confirmPassword } = values;

        if (!token) {
            message.error("Token không hợp lệ hoặc đã hết hạn.");
            return;
        }

        if (password !== confirmPassword) {
            message.error("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/auth/reset-password`,
                { password, token }
            );

            if (response.data.code === 200) {
                // Hiển thị thông điệp thành công
                message.success(response.data.message);

                // Bắt đầu đếm ngược và cập nhật thông điệp mỗi giây
                let time = 3;
                const interval = setInterval(() => {
                    setCountdown(time);
                    setCountdownMessage(`Bạn sẽ được chuyển hướng đến trang đăng nhập sau ${time} giây.`);
                    time -= 1;

                    if (time < 0) {
                        clearInterval(interval);
                        navigate("/login"); // Chuyển hướng đến trang login khi đếm ngược kết thúc
                    }
                }, 1000);  // Cập nhật mỗi giây
            } else {
                message.error(response.data.message || "Đã xảy ra lỗi, vui lòng thử lại.");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Chuyển đổi trạng thái hiển thị/mất mật khẩu
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${slide1})` }} // Áp dụng ảnh nền
            >
                <div className="bg-white p-12 rounded-lg shadow-xl w-full max-w-2xl bg-opacity-80">
                    <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">Đặt Lại Mật Khẩu</h1>

                    {/* Hiển thị thông điệp đếm ngược */}
                    {countdownMessage && (
                        <div className="mt-4 text-center text-lg text-yellow-600 font-medium">
                            {countdownMessage}
                        </div>
                    )}

                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Mật khẩu mới"
                            name="password"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu mới." },
                                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." },
                            ]}
                        >
                            <Input.Password
                                placeholder="Nhập mật khẩu mới"
                                size="large"
                                className="rounded-full"
                                iconRender={(visible) =>
                                    visible ? <FaEyeSlash onClick={togglePasswordVisibility} /> :
                                    <FaEye onClick={togglePasswordVisibility} />
                                }
                                type={passwordVisible ? "text" : "password"} // Thay đổi type của input khi hiển thị/mất mật khẩu
                            />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu." },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Mật khẩu và xác nhận mật khẩu không khớp."));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                placeholder="Xác nhận mật khẩu mới"
                                size="large"
                                className="rounded-full"
                                iconRender={(visible) =>
                                    visible ? <FaEyeSlash onClick={togglePasswordVisibility} /> :
                                    <FaEye onClick={togglePasswordVisibility} />
                                }
                                type={passwordVisible ? "text" : "password"}
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full py-4 text-xl rounded-full"
                            loading={loading}
                            size="large"
                        >
                            Đặt lại mật khẩu
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
