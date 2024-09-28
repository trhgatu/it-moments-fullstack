import React from 'react';
import SwiperComponent from '../SwiperComponent';
import SwiperNavigation from '../SwiperNavigation';

const PopularPerformances = ({ performances }) => {
    return (
        <div className="h-full">
            <div className="flex justify-between">
                <p className="text-4xl my-4">Tiết mục nhiều lượt xem</p>
                <SwiperNavigation />
            </div>
            <SwiperComponent popularPerformances={performances} />
        </div>
    );
};

export default PopularPerformances;
