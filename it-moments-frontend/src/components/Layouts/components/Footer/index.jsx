import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8 w-full">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cột 1: Về chúng tôi */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Về chúng tôi</h4>
                        <p className="text-gray-400">
                            Chúng tôi cung cấp các hoạt động văn nghệ và sự kiện, giúp bạn lưu giữ những khoảnh khắc đáng nhớ.
                        </p>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
                        <ul>
                            <li className="mb-2">
                                <Link to="/about" className="hover:underline text-gray-400">Giới thiệu</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/services" className="hover:underline text-gray-400">Dịch vụ</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/contact" className="hover:underline text-gray-400">Liên hệ</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Mạng xã hội */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Theo dõi chúng tôi</h4>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                <i className="fab fa-facebook-f"></i> Facebook
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                <i className="fab fa-twitter"></i> Twitter
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                <i className="fab fa-instagram"></i> Instagram
                            </a>
                        </div>
                    </div>
                </div>

                {/* Phần bản quyền */}
                <div className="text-center text-gray-400 mt-8">
                    <p>© 2024 Văn Nghệ. Bản quyền thuộc về chúng tôi.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
