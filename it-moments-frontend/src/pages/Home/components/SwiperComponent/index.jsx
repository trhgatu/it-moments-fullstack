import React, { forwardRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import slide1 from "../../../../assets/images/slider_1.jpg";
import { Link } from "react-router-dom";

const SwiperComponent = forwardRef(({ items = [], slidesPerView, autoPlay }, ref) => {
    return (
        <div className="w-full">
            <Swiper
                ref={ref}
                slidesPerView={slidesPerView}
                autoplay={autoPlay}
                spaceBetween={30}
                navigation
                loop={true}
                modules={[Navigation, Autoplay]}
                className="mySwiper"
            >
                {items.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative p-4 text-white bg-cover bg-center overflow-hidden h-96"
                            style={{
                                backgroundImage: `url(${slide1})`,
                            }}
                        >
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className="relative z-10 p-4">
                                <div className="mb-4 flex">
                                    <Link className="text-white text-2xl uppercase hover:text-blue-600">Văn nghệ</Link>
                                    <p className="text-white text-2xl ml-2 mr-2">/</p>
                                    <p className="text-white text-2xl">{item.date || '28/9/24'}</p>
                                </div>
                                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                                <p className="text-sm line-clamp-2">{item.description}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
});

export default SwiperComponent;
