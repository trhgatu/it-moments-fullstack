import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // Import thêm useLocation
import cx from 'classnames'; // Import classnames
import styles from './Header.module.scss';
import { useClientUser } from '../../../../context/ClientUserContext';
import { Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export const Header = () => {
    const navigate = useNavigate();
    const { user, setUser } = useClientUser();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); // Lấy pathname từ location

    const handleScroll = () => {
        if(window.scrollY > 50) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };
    const handleLogout = () => {
        setUser(null);
        navigate('/');
    };

    const menu = (
        <Menu className={styles.dropdownMenu}>
            <Menu.Item key="profile" onClick={() => navigate('/profile')}>
                Profile
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" onClick={handleLogout}>
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

    return (
        <header
            className={cx(
                'flex items-center justify-between px-9 py-3 fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                {
                    'bg-white shadow-md': isScrolled || location.pathname !== '/',
                    'bg-transparent': !isScrolled && location.pathname === '/'
                }
            )}
            style={{ height: 'var(--header-height)' }}
        >
            <NavLink className="flex gap-2 items-center" to="/">
                <span
                    className={cx(
                        styles.textLogo,
                        'text-2xl transition-colors duration-300',
                        {
                            'text-black': isScrolled || location.pathname !== '/',
                            'text-white': !isScrolled && location.pathname === '/'
                        }
                    )}
                >
                    IT Moments
                </span>
            </NavLink>

            <div className="md:hidden" onClick={toggleMenu}>
                <button className="focus:outline-none">
                    <svg
                        className={cx('w-6 h-6', {
                            'text-black': isScrolled || location.pathname !== '/',
                            'text-white': !isScrolled && location.pathname === '/'
                        })}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            <nav className={cx('hidden md:flex gap-32', {
                block: isMenuOpen,
                hidden: !isMenuOpen
            })}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        cx(styles.navLink, 'transition-colors duration-300', {
                            'text-black': (isScrolled || location.pathname !== '/') && !isActive,
                            'text-white': !isScrolled && location.pathname === '/' && !isActive,
                            'text-blue-500': isActive
                        })
                    }
                >
                    Trang chủ
                </NavLink>
                <NavLink
                    to="/posts/su-kien"
                    className={({ isActive }) =>
                        cx(styles.navLink, 'transition-colors duration-300', {
                            'text-black': (isScrolled || location.pathname !== '/') && !isActive,
                            'text-white': !isScrolled && location.pathname === '/' && !isActive,
                            'text-blue-500': isActive
                        })
                    }
                >
                    Sự kiện
                </NavLink>
                <NavLink
                    to="/posts/van-nghe"
                    className={({ isActive }) =>
                        cx(styles.navLink, 'transition-colors duration-300', {
                            'text-black': (isScrolled || location.pathname !== '/') && !isActive,
                            'text-white': !isScrolled && location.pathname === '/' && !isActive,
                            'text-blue-500': isActive
                        })
                    }
                >
                    Văn nghệ
                </NavLink>
                <NavLink
                    to="/posts/hoc-thuat"
                    className={({ isActive }) =>
                        cx(styles.navLink, 'transition-colors duration-300', {
                            'text-black': (isScrolled || location.pathname !== '/') && !isActive,
                            'text-white': !isScrolled && location.pathname === '/' && !isActive,
                            'text-blue-500': isActive
                        })
                    }
                >
                    Học thuật
                </NavLink>
                <NavLink
                    to="about"
                    className={({ isActive }) =>
                        cx(styles.navLink, 'transition-colors duration-300', {
                            'text-black': (isScrolled || location.pathname !== '/') && !isActive,
                            'text-white': !isScrolled && location.pathname === '/' && !isActive,
                            'text-blue-500': isActive
                        })
                    }
                >
                    Giới thiệu
                </NavLink>
            </nav>

            <div className="hidden md:flex gap-4 items-center">
                {user ? (
                    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                        <Avatar
                            src={user.avatar}
                            icon={!user.avatar && <UserOutlined />}
                            size={40}
                            style={{
                                backgroundColor: '#f0f0f0',
                                color: '#8c8c8c',
                                border: '1px solid #d9d9d9',
                                cursor: 'pointer',
                            }}
                        />
                    </Dropdown>
                ) : (
                    <>
                        <NavLink
                            className={cx(styles.loginButton, {
                                [styles.scrolled]: isScrolled || location.pathname !== '/',
                            })}
                            to="/login"
                        >
                            Đăng nhập
                        </NavLink>
                        <NavLink
                            className={cx(styles.registerButton, {
                                [styles.scrolled]: isScrolled || location.pathname !== '/',
                            })}
                            to="/register"
                        >
                            Đăng ký
                        </NavLink>
                    </>
                )}
            </div>

            {/* Menu di động khi mở */}
            {isMenuOpen && (
                <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-md z-40">
                    <nav className="flex flex-col items-center">
                        <NavLink to="/" className={({ isActive }) =>
                            cx(styles.navLink, 'transition-colors duration-300', {
                                'text-blue-500': isActive
                            })}
                        >
                            Trang chủ
                        </NavLink>
                        <NavLink to="/about" className={({ isActive }) =>
                            cx('text-[#2E6C7B] py-2', {
                                'text-blue-500': isActive
                            })}
                        >
                            Sự kiện
                        </NavLink>
                        <NavLink to="/service" className={({ isActive }) =>
                            cx('text-[#2E6C7B] py-2', {
                                'text-blue-500': isActive
                            })}
                        >
                            Hoạt động
                        </NavLink>
                        <NavLink to="/contact" className={({ isActive }) =>
                            cx('text-[#2E6C7B] py-2', {
                                'text-blue-500': isActive
                            })}
                        >
                            Học thuật
                        </NavLink>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
