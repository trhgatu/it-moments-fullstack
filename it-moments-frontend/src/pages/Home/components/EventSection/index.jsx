import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SwiperNavigation from '../SwiperNavigation';
import PostSection from '../PostSection';
import SwiperComponent from '../SwiperComponent';
import { API_URL } from '../../../../config/config';

export default function EventSection() {
    const [activeTab, setActiveTab] = useState('Đang diễn ra');
    const [events, setEvents] = useState({ ongoing: [], past: [] });
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts?category=su-kien`);
                if (response.data.success) {
                    const ongoing = response.data.data.posts.filter(event => event.event_id && event.event_id.status === 'active');
                    const past = response.data.data.posts.filter(event => event.event_id && event.event_id.status === 'completed');
                    setEvents({ ongoing, past });
                }
            } catch (error) {
                console.error('Lỗi khi lấy sự kiện:', error);
            }
        };

        fetchEvents();
    }, []);

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

    const postData = {
        'Đang diễn ra': events.ongoing,
        'Đã kết thúc': events.past,
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
                    <SwiperComponent ref={swiperRef} items={events.ongoing} slidesPerView={2} autoPlay={false} />
                </div>

                <div className="md:col-span-1">
                    <PostSection postData={postData} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>
        </div>
    );
}