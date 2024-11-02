import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
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
