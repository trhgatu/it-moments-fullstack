import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './Slider.module.scss';

import slide1 from '../../../../assets/images/slider_1.jpg';
import slide2 from '../../../../assets/images/slider_2.jpg';
import slide3 from '../../../../assets/images/slider_3.jpg';

const slides = [
    { src: slide1, alt: "Image 1", title: "Lưu giữ những khoảnh khắc" },
    { src: slide2, alt: "Image 2", title: "Những sự kiện mới" },
    { src: slide3, alt: "Image 3", title: "Các hoạt động văn nghệ" },
];

const Slider = () => {
    const swiperRef = useRef(null);

    useEffect(() => {
        const swiperInstance = swiperRef.current.swiper;
        const handleSlideChange = () => {
            document.querySelectorAll('.swiper-slide .slide-title').forEach(title => {
                title.classList.remove(styles['animate']);
                void title.offsetWidth;
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
            modules={[Navigation, Pagination, Autoplay]}
            speed={800}
            loop={true}
            autoplay={true}
            navigation
            pagination={{
                clickable: true,
            }}
            className="mySwiper"
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index} className={styles['swiper-slide']}>
                    <div
                        className={styles['bg-slide']}
                        style={{ backgroundImage: `url(${slide.src})` }}
                    >
                        <div className={styles['overlay']}></div>
                    </div>

                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default Slider;
