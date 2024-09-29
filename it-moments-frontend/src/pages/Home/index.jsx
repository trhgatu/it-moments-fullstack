import React, { useState } from 'react';
import Slider from './components/Slider';
import 'swiper/css';
import './Home.module.scss';
import slide1 from '../../assets/images/slider_1.jpg';
import slide2 from '../../assets/images/slider_2.jpg';
import slide3 from '../../assets/images/slider_3.jpg';
import PopularPerformances from './components/PopularPerformances';
import PostSection from './components/PostSection';
import NewPost from './components/NewPost';
import EventSection from './components/EventSection';

export default function Home() {
    const slides = [
        { src: slide1, alt: "Image 1", title: "Lưu giữ những khoảnh khắc" },
        { src: slide2, alt: "Image 2", title: "Những sự kiện mới" },
        { src: slide3, alt: "Image 3", title: "Các hoạt động văn nghệ" },
    ];

    const performances = [
        { title: "Tiết mục 1", views: 250 },
        { title: "Tiết mục 2", views: 300 },
        { title: "Tiết mục 3", views: 150 },
        { title: "Tiết mục 4", views: 400 },
        { title: "Tiết mục 5", views: 500 },
        { title: "Tiết mục 6", views: 600 },
    ];

    const postData = {
        'Mới': [
            { title: "Bài viết Mới 1", description: "Mô tả ngắn cho bài viết này." },
            { title: "Bài viết Mới 2", description: "Mô tả ngắn cho bài viết này." },
            { title: "Bài viết Mới 3", description: "Mô tả ngắn cho bài viết này." },
            { title: "Bài viết Mới 4", description: "Mô tả ngắn cho bài viết này." }
        ],
        'Liên quan': [
            { title: "Bài viết liên quan 1", description: "Mô tả ngắn cho bài viết liên quan này." },
            { title: "Bài viết liên quan 2", description: "Mô tả ngắn cho bài viết liên quan này." },
            { title: "Bài viết liên quan 3", description: "Mô tả ngắn cho bài viết liên quan này." },
            { title: "Bài viết liên quan 4", description: "Mô tả ngắn cho bài viết liên quan này." }
        ],
        'Nhiều like': [
            { title: "Bài viết nhiều like 1", description: "Mô tả ngắn cho bài viết nhiều like này." },
            { title: "Bài viết nhiều like 2", description: "Mô tả ngắn cho bài viết nhiều like này." },
            { title: "Bài viết nhiều like 3", description: "Mô tả ngắn cho bài viết nhiều like này." },
            { title: "Bài viết nhiều like 4", description: "Mô tả ngắn cho bài viết nhiều like này." }
        ]
    };

    const [activeTab, setActiveTab] = useState('Mới');

    return (
        <>
            <Slider slides={slides} />
            <div className="text-black font-bold mx-auto" style={{ paddingLeft: '10rem', paddingRight: '10rem' }}>
                <div className="posts-content">
                    <div className="text-black font-bold mx-auto px-4 md:px-0">
                        <div className="w-full my-8">
                            <p className="text-2xl md:text-4xl">VĂN NGHỆ</p>
                        </div>

                        <div className="main-content">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <NewPost />
                                <PostSection postData={postData} activeTab={activeTab} setActiveTab={setActiveTab} />
                            </div>
                        </div>
                        <div className="h-full">
                            <PopularPerformances performances={performances} />
                        </div>
                    </div>
                </div>

                <div className="event-section">
                    <EventSection />
                </div>
            </div>
        </>
    );
}
