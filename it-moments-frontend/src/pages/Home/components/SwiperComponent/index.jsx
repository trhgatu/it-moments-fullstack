import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';

const SwiperComponent = ({ popularPerformances }) => {
    return (
        <div className="w-full">
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                autoplay={true}
                loop={true}
                modules={[Navigation, Autoplay]}
                className="mySwiper"
            >
                {popularPerformances.map((performance, index) => (
                    <SwiperSlide key={index}>
                        <div className="border p-4 text-center">
                            <h3 className="font-semibold">{performance.title}</h3>
                            <p className="text-gray-600">Lượt xem: {performance.views}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default SwiperComponent;
