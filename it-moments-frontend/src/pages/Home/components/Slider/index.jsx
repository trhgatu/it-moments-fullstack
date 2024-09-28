import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import styles from './Slider.module.scss';

const Slider = ({ slides }) => {
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
            ref={swiperRef}
            loop={true}
            centeredSlides={true}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
            }}
            effect="fade"
            speed={1000}
            slidesPerView={1}
            allowTouchMove={false}
            simulateTouch={false}
            modules={[Autoplay, Pagination, EffectFade]}
            className={styles['swiper']}
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index} className={styles['swiper-slide']}>
                    <div
                        className={styles['bg-slide']}
                        style={{ backgroundImage: `url(${slide.src})` }}
                    >
                        <div className={styles['overlay']}></div>
                    </div>
                    <div className={`${styles['slide-title']} ${styles['animate']}`}>
                        <h2>{slide.title}</h2>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default Slider;
