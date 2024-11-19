import { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import styles from './Header.module.scss';
import { useClientUser } from '../../../../context/ClientUserContext';
import { Avatar, Dropdown, Menu, Button, Modal, notification, Badge } from 'antd';
import NotificationComponent from '../../../../components/Notification';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../../../config/config';

export const Header = () => {
    const navigate = useNavigate();
    const { user, setUser, loading } = useClientUser(); // Assumes loading state is provided
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal
    const location = useLocation();
    const navRef = useRef([]);


    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });

            // Show success notification
            notification.success({
                message: 'Đăng xuất thành công',
                description: 'Bạn đã đăng xuất khỏi tài khoản.',
                placement: 'bottomRight',
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch(error) {
            console.error('Đăng xuất thất bại:', error);
        }
    };


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        handleLogout();
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const menu = (
        <Menu className={styles.dropdownMenu}>
            <Menu.Item key="profile" onClick={() => navigate('/profile')}>
                Profile
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" onClick={showModal}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if(location.pathname === '/') {
            window.addEventListener('scroll', handleScroll);
        }
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.pathname]);

    const navItems = [
        { path: '/', label: 'Trang chủ' },
        { path: '/posts/su-kien', label: 'Sự kiện' },
        { path: '/posts/van-nghe', label: 'Văn nghệ' },
        { path: '/posts/hoc-thuat', label: 'Học thuật' },
        { path: '/about', label: 'Giới thiệu' },
    ];
    const activeIndex = navItems.findIndex(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
    const hoveredItem = navRef.current[activeIndex];
    const hoveredItemWidth = hoveredItem ? hoveredItem.offsetWidth : 0;
    const hoveredItemLeft = hoveredItem ? hoveredItem.offsetLeft : 0;

    return (
        <header
            className={cx(
                'flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32', // Tăng padding cho các màn hình lớn hơn
                {
                    'bg-white shadow-md': isScrolled || location.pathname !== '/',
                    'bg-transparent': !isScrolled && location.pathname === '/',
                }
            )}
            style={{ height: 'var(--header-height)' }}
        >
            <NavLink className="flex gap-2 items-center ml-4 w-[200px]" to="/" onClick={() => setHoveredIndex(0)}>
                <span
                    className={cx(
                        styles.textLogo,
                        'text-2xl transition-transform duration-300 ease-in-out hover:scale-110',
                        {
                            'text-black hover:text-blue-500': isScrolled || location.pathname !== '/',
                            'text-white hover:text-blue-500 hover:font-semibold': !isScrolled && location.pathname === '/',
                        }
                    )}
                >
                    IT Moments
                </span>
            </NavLink>

            <div className="md:hidden" onClick={toggleMenu}>
                <button className="focus:outline-none">
                    {isMenuOpen ? (
                        <svg className={cx('w-6 h-6', { 'text-black': isScrolled || location.pathname !== '/', 'text-white': !isScrolled && location.pathname === '/' })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className={cx('w-6 h-6', { 'text-black': isScrolled || location.pathname !== '/', 'text-white': !isScrolled && location.pathname === '/' })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button>
            </div>

            <nav className={cx('hidden md:flex gap-20 relative h-full')}>
                {navItems.map((item, index) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        ref={el => navRef.current[index] = el}
                        className={({ isActive }) =>
                            cx('flex items-center relative transition-colors duration-300 h-full', {
                                'text-white': !isScrolled && location.pathname === '/',
                                'text-black': isScrolled || location.pathname !== '/',
                                'hover:text-blue-500': !isActive && location.pathname === '/',
                            })
                        }
                    >
                        <span className={cx(styles.textNav, )}>{item.label}</span>
                    </NavLink>
                ))}

                <motion.div
                    className="absolute bottom-0 h-[4px] bg-blue-500"
                    style={{
                        width: hoveredItemWidth,
                        left: hoveredItemLeft,
                        zIndex: -1,
                    }}
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(6px)" }}
                    animate={{
                        width: hoveredItemWidth,
                        left: hoveredItemLeft,
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)"
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                        mass: 0.8,
                        duration: 0.6
                    }}
                />
            </nav>

            <div className="hidden md:flex gap-4 items-center mr-4 w-[200px]">
                {loading ? (
                    <div className="loader">Loading...</div>
                ) : user ? (
                    <div className='flex items-center'>
                        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                            <Avatar
                                src={user.avatar}
                                icon={!user.avatar && <UserOutlined />}
                                size={40}
                                style={{
                                    backgroundColor: '#f0f0f0',
                                    color: '#000000',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s, color 0.3s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e6f7ff';
                                    e.currentTarget.style.color = '#1890ff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                    e.currentTarget.style.color = '#000000';
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.backgroundColor = '#b3d8ff';
                                    e.currentTarget.style.color = '#0050b3';
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e6f7ff';
                                    e.currentTarget.style.color = '#1890ff';
                                }}
                            />

                        </Dropdown>
                        <NotificationComponent/>

                    </div>


                ) : (
                    <>
                        <Button
                            className={cx(styles.loginButton, {
                                [styles.scrolled]: isScrolled || location.pathname !== '/',
                            })}
                            type="primary"
                            size="large"
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            className={cx(styles.registerButton, {
                                [styles.scrolled]: isScrolled || location.pathname !== '/',
                            })}
                            type="default"
                            size="large"
                            onClick={() => navigate('/register')}
                        >
                            Đăng ký
                        </Button>
                    </>
                )}
            </div>

            {/* Modal xác nhận đăng xuất */}
            <Modal
                title="Xác nhận đăng xuất"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Đăng xuất"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn đăng xuất không?</p>
            </Modal>

            {/* Menu Di Động Khi Mở */}
            {isMenuOpen && (
                <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-md z-40 p-4">
                    <nav className="flex flex-col items-center">
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                    cx('text-[#2E6C7B] py-2 text-lg font-semibold transition-colors duration-300', {
                                        'text-blue-500': isActive
                                    })
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        {/* Nếu không có user thì hiển thị nút đăng nhập và đăng ký */}
                        {!user ? (
                            <div className="flex flex-col items-center mt-4">
                                <Button
                                    className="mb-2 w-full" // Đặt chiều rộng toàn bộ
                                    type="primary"
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng nhập
                                </Button>
                                <Button
                                    className="w-full" // Đặt chiều rộng toàn bộ
                                    type="default"
                                    onClick={() => navigate('/register')}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center mt-4">
                                <Avatar
                                    src={user.avatar}
                                    icon={!user.avatar && <UserOutlined />}
                                    size={50}
                                    style={{
                                        backgroundColor: '#f0f0f0',
                                        color: '#8c8c8c',
                                        border: '1px solid #d9d9d9',
                                        cursor: 'pointer',
                                    }}
                                />
                                <span className="mt-2 text-lg font-semibold">{user.name || 'Người dùng'}</span>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
