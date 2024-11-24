import React, { useState } from "react";
import axios from "axios";
import { message, Input, Button, Form, Divider } from "antd";
import { MailOutlined } from "@ant-design/icons";
import slide1 from "../../assets/images/slider_1.jpg";
import { API_URL } from "../../config/config";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import styles from './ForgotPassword.module.scss'
const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setSubmitted(true);

      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email: values.email }
      );

      if(response.data.code === 200) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        setSubmitted(false);  // Đặt lại trạng thái submitted thành false nếu có lỗi
      }
    } catch(error) {
      console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
      setSubmitted(false); // Đặt lại trạng thái submitted thành false nếu có lỗi
    } finally {
      setLoading(false);  // Đặt lại trạng thái loading thành false khi quá trình hoàn thành
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${slide1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="bg-white rounded shadow-lg"
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "32px",
        }}
      >
        <h1 className={`${styles.titleForgot} text-4xl font-extrabold text-center uppercase text-gray-900`}>
          Quên mật khẩu
        </h1>
        <Divider />
        <p className="text-gray-600 text-center">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ email: "" }}
        >
          <Form.Item
          className="font-bold"
            label="Email:"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn." },
              { type: "email", message: "Email không hợp lệ." },
            ]}
          >
            <Input
            className="rounded-full"
              prefix={<MailOutlined className="px-4" />}
              placeholder="Nhập email của bạn"
              size="small"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
            disabled={loading || submitted}
            size="large"
          >
            Gửi liên kết đặt lại mật khẩu
          </Button>
        </Form>
        <div className="mt-4 text-center flex">
          <Button
            type="link"
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </Button>
          <br />
          <Button
            type="link"
            onClick={() => navigate("/register")}
          >
            Tạo tài khoản mới
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
