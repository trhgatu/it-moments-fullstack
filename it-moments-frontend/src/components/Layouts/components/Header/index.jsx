import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Import thêm useLocation
import cx from 'classnames'; // Import classnames
import styles from './Header.module.scss';

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); // Lấy pathname từ location

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (location.pathname === '/') {
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
                    to="/event"
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
                    to="/posts"
                    className={({ isActive }) =>
                        cx(styles.navLink, 'transition-colors duration-300', {
                            'text-black': (isScrolled || location.pathname !== '/') && !isActive,
                            'text-white': !isScrolled && location.pathname === '/' && !isActive,
                            'text-blue-500': isActive
                        })
                    }
                >
                    Hoạt động
                </NavLink>
                <NavLink
                    to="academic"
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
                <NavLink
                    className={cx(
                        'px-2 md:px-4 py-1 transition-all duration-300',
                        {
                            'bg-[var(--primary)] text-white border border-[#2E6C7B] hover:bg-[#2E6C7B] hover:text-white':
                                isScrolled || location.pathname !== '/',
                            'bg-transparent text-white border border-white hover:bg-[var(--primary)] hover:text-white':
                                !isScrolled && location.pathname === '/'
                        }
                    )}
                    to="/login"
                >
                    Đăng nhập
                </NavLink>
                <NavLink
                    className={cx(
                        'px-2 md:px-4 py-1 transition-all duration-300',
                        {
                            'bg-white text-[var(--primary)] border border-white hover:bg-white':
                                isScrolled || location.pathname !== '/',
                            'bg-transparent text-[var(--primary)] border border-[var(--primary)] hover:bg-white hover:text-[var(--primary)]':
                                !isScrolled && location.pathname === '/'
                        }
                    )}
                    to="/register"
                >
                    Đăng ký
                </NavLink>
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
