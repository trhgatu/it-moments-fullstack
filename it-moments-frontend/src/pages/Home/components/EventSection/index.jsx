import React, { useState, useRef } from 'react';
import SwiperNavigation from '../SwiperNavigation';
import PostSection from '../PostSection';
import SwiperComponent from '../SwiperComponent';

export default function EventSection() {
    const [activeTab, setActiveTab] = useState('Đang diễn ra');
    const swiperRef = useRef(null);

    const ongoingEvents = [
        { title: 'Sự kiện 1', description: 'Mô tả ngắn về sự kiện 1', date: '28/09/2024', imageUrl: 'https://via.placeholder.com/600x300' },
        { title: 'Sự kiện 2', description: 'Mô tả ngắn về sự kiện 2', date: '30/09/2024', imageUrl: 'https://via.placeholder.com/600x300' },
        { title: 'Sự kiện 3', description: 'Mô tả ngắn về sự kiện 3', date: '01/10/2024', imageUrl: 'https://via.placeholder.com/600x300' },
        { title: 'Sự kiện 4', description: 'Mô tả ngắn về sự kiện 4', date: '02/10/2024', imageUrl: 'https://via.placeholder.com/600x300' },
    ];

    const pastEvents = [
        { title: 'Sự kiện Đã Kết Thúc 1', description: 'Mô tả về sự kiện đã kết thúc', date: '15/09/2024' },
        { title: 'Sự kiện Đã Kết Thúc 2', description: 'Mô tả về sự kiện đã kết thúc', date: '20/08/2024' },
    ];

    const postData = {
        'Đang diễn ra': ongoingEvents,
        'Đã kết thúc': pastEvents,
    };

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
        <div className="h-full w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2">
                    <div className="flex justify-between my-6">
                        <p className="text-4xl my-4">SỰ KIỆN</p>
                        <SwiperNavigation onNext={handleNext} onPrev={handlePrev} />
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2">
                    <SwiperComponent ref={swiperRef} items={ongoingEvents} slidesPerView={2} autoPlay={false} />
                </div>


                <div className="md:col-span-1">
                    <PostSection postData={postData} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>
        </div>
    );
}
