import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Row, Col, Typography, Form, Input, message, Checkbox } from "antd";
import signinbg from "../../../assets/images/img-signin.jpg";
import adminIcon from "../../../assets/images/img-authen.png";
import { useUser } from "../../../../context/UserContext";
import axios from "axios";
import { API_URL } from "../../../../config/config";

const { Title } = Typography;
const { Content } = Layout;

const SignIn = () => {
    const { user, setUser, setRole } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    const onFinish = async (values) => {
        try {
            const response = await axios.post(`${API_URL}/admin/auth/login`, values, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                message.success("Đăng nhập thành công!");
                setUser(response.data.user);
                setRole(response.data.user.role_id);
                navigate("/admin/dashboard");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đăng nhập thất bại!";
            message.error(errorMessage);
            console.error("Lỗi đăng nhập:", error);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Thất bại:", errorInfo);
    };

    return (
        <Layout style={{
            height: '100vh',
            background: `url(${signinbg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <Content style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                height: '100%'
            }}>
                <div style={{
                    padding: '0',
                    width: '100%',
                    maxWidth: '900px',
                    background: '#fff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                    {/* Left side - Image */}
                    <div style={{
                        flex: '0 0 40%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',

                    }}>
                        <img
                            src={adminIcon}
alt="Admin"
                            style={{
                                width: '80%',
                                maxWidth: '240px'
                            }}
                        />
                    </div>

                    <div className="bg-blue-50" style={{
                        flex: '1',
                        padding: '40px',
                    }}>
                        <Title level={2} style={{
                            marginBottom: '30px',
                            fontSize: '28px',
                            color: '#333'
                        }}>
                            Đăng nhập
                        </Title>

                        <Form
                            name="basic"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout="vertical"
                            initialValues={{ remember: true }}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email!" },
                                    { type: 'email', message: "Email không hợp lệ!" }
                                ]}
                            >
                                <Input
                                    placeholder="Email"
                                    style={{
                                        height: '45px',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                            >
                                <Input.Password
                                    placeholder="Mật khẩu"
                                    style={{
                                        borderRadius: '8px'
                                    }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
style={{
                                        width: '100%',
                                        height: '45px',
                                        borderRadius: '8px',
                                        background: '#1890ff',
                                        fontSize: '16px'
                                    }}
                                >
                                    ĐĂNG NHẬP
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default SignIn;