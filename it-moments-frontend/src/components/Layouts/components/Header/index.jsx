import { useEffect, useState } from 'react';
import styles from './Header.module.scss';

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('/');

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = (link) => {
        setActiveLink(link);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`flex items-center justify-between px-5 py-3 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`} style={{ height: 'var(--header-height)' }}>

            <a className="flex gap-2 items-center" href={'/'}>
                <span className={`${styles.textLogo} text-2xl transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-white'}`}>
                    IT Moments
                </span>
            </a>

            <div className="md:hidden" onClick={toggleMenu}>
                <button className="focus:outline-none">
                    <svg
                        className={`w-6 h-6 ${isScrolled ? 'text-black' : 'text-white'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            <nav className={`hidden md:flex gap-32 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                <a href="/" onClick={() => handleLinkClick('/')} className={`${styles.navLink} transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-white'} ${activeLink === '/' ? 'underline text-[#2E6C7B]' : ''}`}>Trang chủ</a>
                <a href="/about" onClick={() => handleLinkClick('/about')} className={`${styles.navLink} transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-white'} ${activeLink === '/about' ? 'underline text-[#2E6C7B]' : ''}`}>Sự kiện</a>
                <a href="/service" onClick={() => handleLinkClick('/service')} className={`${styles.navLink} transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-white'} ${activeLink === '/service' ? 'underline text-[#2E6C7B]' : ''}`}>Hoạt động</a>
                <a href="/contact" onClick={() => handleLinkClick('/contact')} className={`${styles.navLink} transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-white'} ${activeLink === '/contact' ? 'underline text-[#2E6C7B]' : ''}`}>Học thuật</a>
                <a href="/introduce" onClick={() => handleLinkClick('/introduce')} className={`${styles.navLink} transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-white'} ${activeLink === '/introduce' ? 'underline text-[#2E6C7B]' : ''}`}>Giới thiệu</a>
            </nav>


            <div className="hidden md:flex gap-4 items-center">
                <a
                    className={`px-2 md:px-4 py-1 transition-all duration-300 ${isScrolled ? 'bg-[var(--primary)] text-white border border-[#2E6C7B] hover:bg-[#2E6C7B] hover:text-white' : 'bg-transparent text-white border border-white hover:bg-[var(--primary)] hover:text-white'}`}
                    href="/login"
                >
                    Đăng nhập
                </a>
                <a
                    className={`px-2 md:px-4 py-1 transition-all duration-300 ${isScrolled ? 'bg-white text-[var(--primary)] border border-white hover:bg-white' : 'bg-transparent text-[var(--primary)] border border-[var(--primary)] hover:bg-white hover:text-[var(--primary)]'}`}
                    href="/register"
                >
                    Đăng ký
                </a>
            </div>
            {isMenuOpen && (
                <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-md z-40">
                    <nav className="flex flex-col items-center">
                        <a href="/" onClick={() => handleLinkClick('/')} className="text-[#2E6C7B] py-2">Home</a>
                        <a href="/about" onClick={() => handleLinkClick('/about')} className="text-[#2E6C7B] py-2">About</a>
                        <a href="/service" onClick={() => handleLinkClick('/service')} className="text-[#2E6C7B] py-2">Service</a>
                        <a href="/contact" onClick={() => handleLinkClick('/contact')} className="text-[#2E6C7B] py-2">Contact</a>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
