import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Row, Col, Typography, Form, Input, message } from "antd";
import signinbg from "../../../assets/images/img-signin.jpg";
import { useUser } from '../../../../context/UserContext';
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
