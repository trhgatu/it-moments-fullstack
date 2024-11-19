import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Link } from 'react-scroll';
import slide1 from '../../../../assets/images/slider_1.jpg';
import slide2 from '../../../../assets/images/slider_2.jpg';
import slide3 from '../../../../assets/images/slider_3.jpg';
import slide4 from '../../../../assets/images/slider_3.jpg';
import { motion } from 'framer-motion';
import 'swiper/css';
import styles from './Background.module.scss';
import TypingEffect from 'react-typing-effect';
import { FacebookOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';

const Background = () => {
    const [showDescription, setShowDescription] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        { image: slide1, title: 'Lưu giữ', subtitle: 'những khoảnh khắc', description: 'Mỗi khoảnh khắc đều quý giá và đáng nhớ.' },
        { image: slide2, title: 'Hoạt động Văn nghệ', subtitle: 'Chúc mừng các sự kiện sắp tới', description: 'Bình chọn cho các tiết mục bạn ưa thích.' },
        { image: slide3, title: 'Sự kiện', subtitle: 'Khám phá các hoạt động sôi nổi', description: 'Cập nhật nhanh chóng các sự kiện đặc sắc đang diễn ra.' },
        { image: slide4, title: 'Học thuật', subtitle: 'thế giới', description: 'Mở rộng tầm nhìn và khám phá những điều mới mẻ.' },
    ];

    useEffect(() => {
        const timer = setTimeout(() => setShowDescription(true), 800);
        return () => clearTimeout(timer);
    }, [currentSlide]);

    const handleSlideChange = (swiper) => {
        setCurrentSlide(swiper.activeIndex);
        setShowDescription(false);
    };

    return (
        <div className="relative w-full h-[100vh]">
            <Swiper
                allowTouchMove={false}
                simulateTouch={false}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                pagination={{
                    clickable: true,
                    el: `.${styles.swiperPagination}`,
                }}
/*                 autoplay={{
                    delay: 3000,
                }} */
                modules={[Pagination]}
                direction="vertical"
                className="h-full mySwiper"
                onSlideChange={handleSlideChange}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="bg-cover bg-center h-full"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="overlay absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

                            <div className="absolute left-4 top-1/2 sm:left-10 md:left-28 lg:left-28 xl:left-28" style={{ marginTop: '-10rem' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 50 }}
                                    transition={{ duration: 1 }}
                                    className="text-white uppercase"
                                >
                                    <span className={`${styles.backgroundTitle} text-2xl sm:text-3xl md:text-4xl font-light block ml-1`}>{slide.title}</span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 50 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="text-white uppercase"
                                >
                                    <span className={`${styles.backgroundTitle} text-3xl sm:text-4xl md:text-5xl font-bold block mt-6`}>{slide.subtitle}</span>
                                </motion.div>

                                {showDescription && currentSlide === index && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className={` ${styles.backgroundTitle} text-white text-lg sm:text-xl md:text-2xl mt-8`}
                                    >
                                        <TypingEffect
                                            text={[slide.description]}
                                            speed={70}
                                            typingDelay={500}
                                            eraseSpeed={0}
                                            cursor="|"
                                            displayText="none"
                                        />
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className={styles.swiperPagination}></div>

            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 py-10 flex flex-col sm:flex-row justify-between items-center z-10 px-10 sm:px-10 md:px-20 lg:px-20 xl:px-20">
                <div className="flex gap-8 w-full sm:w-2/3 justify-start flex-wrap sm:flex-nowrap">
                    <Link to="vanNgheSection"
                        smooth={true}
                        duration={500}
                        className='w-full sm:w-1/3'
                    >
                        <motion.div
                            className="bg-blue-700 text-black p-6 shadow-lg transform transition-all cursor-pointer border-white border-4 relative"
                            initial={{ opacity: 0, y: -150 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-white">Văn nghệ</h3>
                            <span className="text-white">Thưởng thức và tham gia bình chọn cho tiết mục bạn yêu thích</span>
                        </motion.div>
                    </Link>

                    <Link to="suKienSection"
                        smooth={true}
                        duration={500}
                        className='w-full sm:w-1/3'
                    >
                        <motion.div
                            className="bg-blue-700 text-black p-6 shadow-lg transform transition-all cursor-pointer border-white border-4 relative"
                            initial={{ opacity: 0, y: -150 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        >
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-white">Sự Kiện</h3>
                            <span className="text-white">Cập nhật thông tin về các sự kiện sôi nổi đang diễn ra.</span>
                        </motion.div>
                    </Link>

                    <Link to="hocThuatSection"
                        smooth={true}
                        duration={500}
                        className='w-full sm:w-1/3'
                    >
                        <motion.div
                            className="bg-blue-700 text-black p-6 shadow-lg transform transition-all cursor-pointer border-white border-4 relative"
                            initial={{ opacity: 0, y: -150 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                        >
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-white">Học thuật</h3>
                            <span className="text-white">Cập nhật thông tin về các hoạt động học thuật</span>
                        </motion.div>
                    </Link>
                </div>
                <div className="flex flex-col items-center gap-3 w-full sm:w-1/3 z-20 text-white sm:mt-0 mt-8">
                    <div className="text-white text-lg font-semibold mb-2 text-center sm:text-left">Cập nhật các thông tin mới nhất tại:</div>
                    <div className="flex flex-wrap gap-6 justify-evenly w-full">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-500">
                            <FacebookOutlined className="text-xl sm:text-2xl" />
                            <span className="text-sm sm:text-base">Facebook</span>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-500">
                            <InstagramOutlined className="text-xl sm:text-2xl" />
                            <span className="text-sm sm:text-base">Instagram</span>
                        </a>
                        <a href="https://www.youtube.com/@ITMoments-x4i" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-red-500">
                            <YoutubeOutlined className="text-xl sm:text-2xl" />
                            <span className="text-sm sm:text-base">YouTube</span>
                        </a>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Background;
