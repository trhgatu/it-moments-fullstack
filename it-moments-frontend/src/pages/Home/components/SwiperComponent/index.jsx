import React, { forwardRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Link } from "react-router-dom";

const SwiperComponent = forwardRef(({ items = [], slidesPerView, autoPlay }, ref) => {
    return (
        <div className="w-full">
            <Swiper
                ref={ref}
                slidesPerView={slidesPerView}
                autoplay={autoPlay ? { delay: 3000, disableOnInteraction: false } : false}
                spaceBetween={30}
                navigation
                loop={true}
                modules={[Navigation, Autoplay]}
                className="mySwiper"
            >
                {items.map((item) => (
                    <SwiperSlide key={item._id}>
                        <div className="relative text-white bg-cover bg-center overflow-hidden h-96"
                            style={{
                                backgroundImage: `url(${item.thumbnail})`,
                            }}
                        >
                            <div className="absolute z-10 w-full bottom-0 bg-black bg-opacity-50 p-4">
                                <div className="flex flex-wrap">
                                    <Link to="posts/su-kien"
                                        className="text-white text-xl uppercase hover:text-blue-600 duration-300">{item.post_category_id.title}
                                    </Link>
                                    <p className="text-white text-2xl ml-3 mr-3 font-light">/</p>
                                    <p className="text-white text-xl font-light">{item.date || '28/9/24'}</p>
                                </div>
                                <h3 className="font-normal text-3xl mb-2 text-white line-clamp-2">{item.title}</h3>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
});

export default SwiperComponent;
