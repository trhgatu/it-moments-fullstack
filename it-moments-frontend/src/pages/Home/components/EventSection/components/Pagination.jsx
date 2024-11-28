import React from 'react';

export default function Pagination({ swiperRef, activeSlideIndex, totalSlides }) {
    return (
        <div className="flex justify-center gap-2 mt-10">
            {[...Array(totalSlides)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => swiperRef.current?.swiper.slideToLoop(index)}
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out
                  ${activeSlideIndex === index ? 'bg-blue-500 scale-125' : 'bg-gray-300'}`}
                >
                </button>

            ))}
        </div>
    );
}
