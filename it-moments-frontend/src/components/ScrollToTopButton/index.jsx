import { useState, useEffect } from 'react';
import { FaArrowUp } from "react-icons/fa";
const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed z-[10000] bottom-20 right-10 bg-blue-500 hover:opacity-60 text-white shadow-lg transition-all duration-300 transform ${
                visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                padding: 0,
            }}
        >
            <FaArrowUp className="text-2xl m-auto" style={{ lineHeight: '60px' }} />
        </button>
    );
};

export default ScrollToTopButton;
