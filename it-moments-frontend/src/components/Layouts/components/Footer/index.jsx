import React from 'react';
import { NavLink } from 'react-router-dom';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, GithubOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Space } from 'antd';
import cx from 'classnames';
import styles from './Footer.module.scss';

const { Paragraph } = Typography;

function Footer() {
  return (
    <footer className="bg-black text-white py-12 w-full">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <Row gutter={[16, 16]} justify="center">
          {/* About Section */}
          <Col xs={24} sm={8} className="text-center">
            <div className="text-center mb-6">
              <NavLink to="/">
                <span className={cx(styles.textLogo, 'text-6xl')}>IT Moments</span>
              </NavLink>
            </div>
            <Paragraph className="text-white">
              Website được thực hiện bởi 3 sinh viên của Trường Đại học Công thương Thành Phố Hồ Chí Minh.
            </Paragraph>
          </Col>

          {/* Links Section */}
          <Col xs={24} sm={8} className="text-center">
            <h4 className="text-2xl font-bold text-white mb-4">Liên kết</h4>
            <Space direction="vertical" size="middle" className="text-white">
              <NavLink to="/" className="hover:text-blue-400 transition duration-300">Trang chủ</NavLink>
              <NavLink to="/about" className="hover:text-blue-400 transition duration-300">Về chúng tôi</NavLink>
              <NavLink to="/posts/su-kien" className="hover:text-blue-400 transition duration-300">Sự kiện</NavLink>
              <NavLink to="/posts/van-nghe" className="hover:text-blue-400 transition duration-300">Văn nghệ</NavLink>
              <NavLink to="/posts/hoc-thuat" className="hover:text-blue-400 transition duration-300">Học thuật</NavLink>
            </Space>
          </Col>

          <Col xs={24} sm={8} className='text-center'>
            <h4 className="text-2xl font-bold text-white mb-4 text-center">Thông tin liên hệ</h4>
            <Space direction="vertical" size="middle" className="text-white">
              <div className="flex items-center">
                <EnvironmentOutlined className="text-white hover:text-blue-400 transition duration-300 w-6 h-6" />
                <span className="ml-2 text-white">140 Lê Trọng Tấn, Phường Tây Thạnh, Quận Tân Phú, TP.HCM</span>
              </div>
              {/* Phone */}
              <div className="flex items-center">
                <PhoneOutlined className="text-white hover:text-blue-400 transition duration-300 w-6 h-6" />
                <span className="ml-2 text-white">+84 123 456 789</span>
              </div>
              {/* Email */}
              <div className="flex items-center">
                <MailOutlined className="text-white hover:text-blue-400 transition duration-300 w-6 h-6" />
                <span className="ml-2 text-white">contact@vannghe.vn</span>
              </div>
            </Space>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition duration-300">
                <FacebookOutlined className="text-white hover:text-blue-400 transition duration-300 w-8 h-8" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition duration-300">
                <TwitterOutlined className="text-white hover:text-blue-400 transition duration-300 w-8 h-8" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition duration-300">
                <InstagramOutlined className="text-white hover:text-blue-400 transition duration-300 w-8 h-8" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition duration-300">
                <GithubOutlined className="text-white hover:text-blue-400 transition duration-300 w-8 h-8" />
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright Section */}
        <div className="text-center text-gray-400 mt-12 pt-8 border-t border-gray-700">
          <Paragraph className="text-white">© 2024 IT Moments.</Paragraph>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
