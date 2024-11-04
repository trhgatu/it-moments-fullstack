import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'aos/dist/aos.css'; // Import CSS của AOS
import AOS from 'aos'; // Import AOS
import styles from './Slider.module.scss';

const Slider = ({ slides }) => {
    const swiperRef = useRef(null);
    const progressCircle = useRef(null);
    const progressContent = useRef(null);

    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };

    useEffect(() => {
        // Khởi tạo AOS
        AOS.init();

        const swiperInstance = swiperRef.current.swiper;

        const handleSlideChange = () => {
            // Gọi lại AOS khi slide thay đổi
            AOS.refresh();

            // Cập nhật lại các tiêu đề để hiện hiệu ứng
            document.querySelectorAll('.swiper-slide .slide-title').forEach(title => {
                // Thay đổi kiểu hiển thị tiêu đề
                title.classList.remove(styles['animate']);
                void title.offsetWidth; // Đảm bảo trình duyệt cập nhật
                title.classList.add(styles['animate']);
            });
        };

        swiperInstance.on('slideChange', handleSlideChange);

        return () => {
            swiperInstance.off('slideChange', handleSlideChange);
        };
    }, []);

    return (
        <Swiper
            ref={swiperRef}
            loop={true}
            centeredSlides={true}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            speed={1000}
            slidesPerView={1}
            allowTouchMove={false}
            simulateTouch={false}
            modules={[Autoplay, Pagination]}
            className="h-screen relative"
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index} className="flex items-center justify-center w-full h-full">
                    <div
                        className="bg-cover bg-center h-full"
                        style={{ backgroundImage: `url(${slide.src})` }}
                    >
                        <div className="overlay absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
                        {/* Tiêu đề với AOS animation */}
                        <h2 className="slide-title text-white text-3xl absolute bottom-10 left-5" data-aos="fade-up" data-aos-duration="800">
                            {slide.title}
                        </h2>
                    </div>
                </SwiperSlide>
            ))}
            <div className={styles.autoplayProgress} slot="container-end">
                <svg viewBox="0 0 48 48" ref={progressCircle}>
                    <circle cx="24" cy="24" r="20"></circle>
                </svg>
                <span ref={progressContent}></span>
            </div>
        </Swiper>
    );
};

export default Slider;
