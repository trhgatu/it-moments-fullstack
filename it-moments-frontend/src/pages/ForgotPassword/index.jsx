import React, { useState } from "react";
import axios from "axios";
import { message, Input, Button, Form } from "antd";
import { MailOutlined } from "@ant-design/icons";
import slide1 from "../../assets/images/slider_1.jpg";
import { API_URL } from "../../config/config";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);  // Trạng thái loading
  const [submitted, setSubmitted] = useState(false);  // Trạng thái gửi form

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setSubmitted(true);  // Đánh dấu rằng form đã được gửi

      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email: values.email }
      );

      if (response.data.code === 200) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message || "Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
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
          maxWidth: "600px",
          padding: "32px",
        }}
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">Quên Mật Khẩu</h1>
        <p className="text-gray-600 text-center mb-8">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ email: "" }} // Đặt giá trị mặc định
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn." },
              { type: "email", message: "Email không hợp lệ." },
            ]}
          >
            <Input
              prefix={<MailOutlined />} // Biểu tượng email
              placeholder="Nhập email của bạn"
              size="large"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}  // Hiển thị loading trong khi đang xử lý
            disabled={loading || submitted}  // Tắt nút khi đang gửi yêu cầu hoặc đã gửi form
            size="large"
          >
            Gửi liên kết đặt lại mật khẩu
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
