import React from 'react';
import { Facebook, Twitter, Instagram, Github, MapPin, Phone, Mail } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import styles from './Footer.module.scss';

function Footer() {
  return (
    <footer className="bg-black text-white py-16 w-full">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <NavLink to="/">
            <span className={cx(styles.textLogo, 'text-8xl')}>IT Moments</span>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <h4 className="text-2xl font-bold mb-6 border-b-2 border-blue-500 pb-2 inline-block text-white shadow-lg shadow-black">Về chúng tôi</h4>
            <p>Chúng tôi là đơn vị tiên phong trong lĩnh vực tổ chức sự kiện văn nghệ tại Việt Nam.</p>
            <p>Giờ làm việc: Thứ 2 - Thứ 6: 8:00 - 18:00, Thứ 7 - Chủ nhật: 9:00 - 17:00</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-2xl font-bold mb-6 border-b-2 border-blue-500 pb-2 inline-block text-white shadow-lg shadow-black">Dịch vụ</h4>
            <ul className="space-y-2">
              <li>Livestream các hoạt động khoa CNTTT</li>
              <li>Quản lý video, hình ảnh hoạt động khoa CNTT</li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h4 className="text-2xl font-bold mb-6 border-b-2 border-blue-500 pb-2 inline-block text-white shadow-lg shadow-black">Liên hệ</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-500" />
                <p className="ml-2">160 Lê Trọng Tấn,phường Tây Thanh, Quận Tân Phú, TP.HCM</p>
              </div>
              <div className="flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-500" />
                <p className="ml-2">+84 123 456 789</p>
              </div>
              <div className="flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-500" />
                <p className="ml-2">contact@vannghe.vn</p>
              </div>
            </div>
            {/* Social Media Icons */}
            <div className="pt-4">
              <h5 className="text-lg font-semibold mb-4">Kết nối</h5>
              <div className="flex justify-center space-x-4">
                {[
                  { platform: 'Facebook', url: 'https://facebook.com' },
                  { platform: 'Twitter', url: 'https://twitter.com' },
                  { platform: 'Instagram', url: 'https://instagram.com' },
                  { platform: 'Github', url: 'https://github.com' }
                ].map(({ platform, url }, index) => (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full">
                    {platform === 'Facebook' && <Facebook className="w-5 h-5 text-white" />}
                    {platform === 'Twitter' && <Twitter className="w-5 h-5 text-white" />}
                    {platform === 'Instagram' && <Instagram className="w-5 h-5 text-white" />}
                    {platform === 'Github' && <Github className="w-5 h-5 text-white" />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-gray-400 mt-12 pt-8 border-t border-gray-700">
          <p>© 2024 Văn Nghệ VN. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
