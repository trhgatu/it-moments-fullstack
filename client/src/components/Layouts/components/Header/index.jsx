import { useState, useEffect, useRef } from 'react'
import styles from './Header.module.scss'
import classNames from 'classnames/bind'
import { UserOutlined, SearchOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles)

function Header() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [showSearch, setShowSearch] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    const searchButtonRef = useRef(null)
    const searchContainerRef = useRef(null)

    const handleClickOutside = event => {
        if(
            searchButtonRef.current &&
            !searchButtonRef.current.contains(event.target) &&
            searchContainerRef.current &&
            !searchContainerRef.current.contains(event.target)
        ) {
            setShowSearch(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 50) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const handleSearchClick = () => {
        setShowSearch(prev => !prev)
    }

    const handleClick = index => {
        setActiveIndex(index)
    }
    const handleInputClick = event => {
        event.stopPropagation()
    }

    return (
        <header className={cx('wrapper', { scrolled: isScrolled })}>
            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <a href="#">
                        <h2 className={cx('logo_text')}>IT Moments</h2>
                    </a>
                </div>
                <div className={cx('navbar')}>
                    <ul className={cx('list')}>
                        {[
                            { name: 'Trang chủ', path: '/' },
                            { name: 'Sự kiện', path: '/event' },
                            { name: 'Hoạt động', path: '/activities' },
                            { name: 'Học thuật', path: '/academics' },
                            { name: 'Giới thiệu', path: '/about' },
                            { name: 'Liên hệ', path: '/contact' },
                        ].map((item, index) => (
                            <li key={index} className={cx('item')}>
                                <a
                                    href={item.path}
                                    className={cx('link', {
                                        active: activeIndex === index,
                                    })}
                                    onClick={() => handleClick(index)}>
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className={cx('actions-wrapper')}>
                        <div className={cx('actions')} ref={searchButtonRef}>
                            <button className={cx('search')} onClick={handleSearchClick}>
                                <span className={cx('icon')}>
                                    <SearchOutlined />
                                </span>
                            </button>
                            <button className={cx('noti')}>
                                {/* Noti */}
                            </button>
                            <button className={cx('profile')}>
                                <span className={cx('icon')}>
                                    <UserOutlined />
                                </span>
                            </button>
                        </div>
                        <div
                            className={cx('search-container', {
                                show: showSearch,
                            })}
                            ref={searchContainerRef}>
                            <input
                                type="text"
                                className={cx('search-input')}
                                placeholder="Tìm kiếm..."
                                onClick={handleInputClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
