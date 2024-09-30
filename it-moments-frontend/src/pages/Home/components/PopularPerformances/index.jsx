import React, { useRef } from 'react';
import SwiperComponent from '../SwiperComponent';
import SwiperNavigation from '../SwiperNavigation';

const PopularPerformances = ({ performances }) => {
    const swiperRef = useRef(null);

    const handleNext = () => {
        if(swiperRef.current) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const handlePrev = () => {
        if(swiperRef.current) {
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
            <SwiperComponent ref={swiperRef} items={performances} slidesPerView={4} autoPlay={false} />
        </div>
    );
};

export default PopularPerformances;
