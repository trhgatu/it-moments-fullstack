import React, { useEffect, useRef, useState } from 'react';
import SwiperComponent from '../SwiperComponent';
import SwiperNavigation from '../SwiperNavigation';

const PopularPerformances = ({ popularPerformances }) => {
    const swiperRef = useRef(null);
    const [slidesPerView, setSlidesPerView] = useState(1); // Khởi tạo với giá trị mặc định

    // Định nghĩa hàm getSlidesPerView
    const getSlidesPerView = () => {
        if (window.innerWidth >= 1024) {
            return 4; // Large screens
        } else if (window.innerWidth >= 768) {
            return 3; // Medium screens
        } else {
            return 1; // Small screens
        }
    };

    useEffect(() => {
        // Cập nhật slidesPerView ngay khi component được mount
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
            <SwiperComponent ref={swiperRef} items={popularPerformances} slidesPerView={slidesPerView} autoPlay={true} />
        </div>
    );
};

export default PopularPerformances;
