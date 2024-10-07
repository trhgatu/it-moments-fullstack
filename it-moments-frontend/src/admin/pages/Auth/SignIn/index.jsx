import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Button, Row, Col, Typography, Form, Input, message } from "antd";
import signinbg from "../../../assets/images/img-signin.jpg";
import { useUser } from '../../../../context/UserContext';

const { Title } = Typography;
const { Content } = Layout;

const SignIn = () => {
  const { setUser } = useUser(); // Lấy setUser từ ngữ cảnh
  const navigate = useNavigate();

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
      if (response.ok) {
        console.log("Login successful:", data);
        message.success("Đăng nhập thành công!");

        // Cập nhật thông tin người dùng vào ngữ cảnh
        setUser(data.user); // Giả sử data.user chứa thông tin người dùng

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 500);
      } else {
        console.error("Login failed:", data);
        message.error(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
                label="Password"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input type="password" placeholder="Password" />
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
