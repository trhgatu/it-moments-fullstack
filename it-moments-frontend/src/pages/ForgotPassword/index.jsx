import React, { useState } from "react";
import axios from "axios";
import { message, Input, Button, Form } from "antd";
import slide1 from '../../assets/images/slider_1.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      message.warning("Vui lòng nhập email của bạn.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
        email,
      });

      if (response.data.success) {
        message.success("Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.");
      } else {
        message.error(response.data.message || "Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
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
          maxWidth: "600px", // Tăng kích thước form
          padding: "32px", // Thêm khoảng cách bên trong
        }}
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">Quên Mật Khẩu</h1>
        <p className="text-gray-600 text-center mb-8">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn." },
              { type: "email", message: "Email không hợp lệ." },
            ]}
          >
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large" // Tăng kích thước input
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
            size="large" // Tăng kích thước nút
          >
            Gửi liên kết đặt lại mật khẩu
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
