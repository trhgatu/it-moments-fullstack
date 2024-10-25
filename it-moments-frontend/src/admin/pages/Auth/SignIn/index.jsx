import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Row, Col, Typography, Form, Input, message } from "antd";
import signinbg from "../../../assets/images/img-signin.jpg";
import { useUser } from '../../../../context/UserContext';

const { Title } = Typography;
const { Content } = Layout;

const SignIn = () => {
    const { user, setUser, setRole } = useUser();
    const navigate = useNavigate();

    // Kiểm tra nếu người dùng đã đăng nhập và chuyển hướng
    useEffect(() => {
        if (user) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    // Hàm xử lý khi form được submit
    const onFinish = async (values) => {
        try {
            const response = await fetch("http://localhost:3000/api/v1/admin/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
                credentials: "include",
            });

            const data = await response.json();

            // Kiểm tra nếu response ok
            if (response.ok) {
                message.success("Đăng nhập thành công!");
                setUser(data.user);
                setRole(data.user.role_id);
                navigate("/admin/dashboard");
            } else {
                // Hiển thị thông báo lỗi từ server
                message.error(data.message || "Đăng nhập thất bại!");
            }
        } catch (error) {
            // Xử lý lỗi khi không kết nối được tới server
            message.error("Đã xảy ra lỗi khi đăng nhập.");
            console.error("Lỗi đăng nhập:", error);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Thất bại:", errorInfo);
    };

    return (
        <Layout className="layout-default layout-signin">
            <Content className="signin">
                <Row gutter={[24, 0]} justify="space-around">
                    <Col xs={{ span: 24, offset: 0 }} lg={{ span: 6, offset: 2 }} md={{ span: 12 }}>
                        <Title className="mb-15">Đăng nhập</Title>
                        <Form onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical" className="row-col">
                            <Form.Item
                                className="username"
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                className="username"
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                            >
                                <Input type="password" placeholder="Mật khẩu" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col className="sign-img" style={{ padding: 12 }} xs={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }}>
                        <img src={signinbg} alt="" />
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default SignIn;
