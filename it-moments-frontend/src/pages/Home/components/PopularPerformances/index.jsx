import React, { useEffect, useRef, useState } from 'react';
import SwiperComponent from '../SwiperComponent';
import SwiperNavigation from '../SwiperNavigation';

const PopularPerformances = ({ mostViewPostPerformances }) => {
    const swiperRef = useRef(null);
    const [slidesPerView, setSlidesPerView] = useState(1);
    const getSlidesPerView = () => {
        if (window.innerWidth >= 1024) {
            return 4;
        } else if (window.innerWidth >= 768) {
            return 3;
        } else {
            return 1;
        }
    };

    useEffect(() => {
        setSlidesPerView(getSlidesPerView());

        const handleResize = () => {
            setSlidesPerView(getSlidesPerView());
        };

        window.addEventListener('resize', handleResize);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleNext = () => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const handlePrev = () => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    return (
        <div className="h-full">
            <div className="w-full h-full my-6">
                <div className="flex justify-between">
                    <p className="text-4xl my-4">Tiết mục nhiều lượt xem</p>
                    <SwiperNavigation onNext={handleNext} onPrev={handlePrev} />
                </div>
            </div>
            <SwiperComponent ref={swiperRef} items={mostViewPostPerformances} slidesPerView={slidesPerView} autoPlay={true} />
        </div>
    );
};

export default PopularPerformances;
