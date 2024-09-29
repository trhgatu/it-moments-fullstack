import React from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const SwiperNavigation = ({ onNext, onPrev }) => {
    return (
        <div className="flex space-x-4 items-center">
            <div
                className="swiper-button-prev border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 p-2 rounded cursor-pointer transition duration-300"
                onClick={onPrev}>
                <NavigateBeforeIcon fontSize="large" />
            </div>
            <div
                className="swiper-button-next border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 p-2 rounded cursor-pointer transition duration-300"
                onClick={onNext}>
                <NavigateNextIcon fontSize="large" />
            </div>
        </div>
    );
};

export default SwiperNavigation;
