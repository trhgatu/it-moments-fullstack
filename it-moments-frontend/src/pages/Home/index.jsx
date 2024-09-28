import React, { useState, useRef } from 'react';
import Slider from './components/Slider';
import 'swiper/css';
import './Home.module.scss';
import slide1 from '../../assets/images/slider_1.jpg';
import slide2 from '../../assets/images/slider_2.jpg';
import slide3 from '../../assets/images/slider_3.jpg';
import PopularPerformances from './components/PopularPerformances';
import PostSection from './components/PostSection';
import NewPost from './components/NewPost';
export default function Home() {


    const slides = [
        { src: slide1, alt: "Image 1", title: "Lưu giữ những khoảnh khắc" },
        { src: slide2, alt: "Image 2", title: "Những sự kiện mới" },
        { src: slide3, alt: "Image 3", title: "Các hoạt động văn nghệ" },
    ];

    // Dữ liệu cho tiết mục văn nghệ nhiều lượt xem
    const performances = [
        { title: "Tiết mục 1", views: 250 },
        { title: "Tiết mục 2", views: 300 },
        { title: "Tiết mục 3", views: 150 },
        { title: "Tiết mục 4", views: 400 },
        { title: "Tiết mục 5", views: 500 },
        { title: "Tiết mục 6", views: 600 },
    ];

    // Dữ liệu bài viết dựa trên từng tab
    const postData = {
        'nhiều comment': [
            { title: "Bài viết có nhiều comment 1", description: "Mô tả ngắn cho bài viết này." },
            { title: "Bài viết có nhiều comment 2", description: "Mô tả ngắn cho bài viết này." },
            { title: "Bài viết có nhiều comment 3", description: "Mô tả ngắn cho bài viết này." },
            { title: "Bài viết có nhiều comment 4", description: "Mô tả ngắn cho bài viết này." }
        ],
        'liên quan': [
            { title: "Bài viết liên quan 1", description: "Mô tả ngắn cho bài viết liên quan này." },
            { title: "Bài viết liên quan 2", description: "Mô tả ngắn cho bài viết liên quan này." },
            { title: "Bài viết liên quan 3", description: "Mô tả ngắn cho bài viết liên quan này." },
            { title: "Bài viết liên quan 4", description: "Mô tả ngắn cho bài viết liên quan này." }
        ],
        'mới': [
            { title: "Bài viết mới 1", description: "Mô tả ngắn cho bài viết mới này." },
            { title: "Bài viết mới 2", description: "Mô tả ngắn cho bài viết mới này." },
            { title: "Bài viết mới 3", description: "Mô tả ngắn cho bài viết mới này." },
            { title: "Bài viết mới 4", description: "Mô tả ngắn cho bài viết mới này." }
        ]
    };

    const [activeTab, setActiveTab] = useState('nhiều comment');

    const renderContent = () => {
        return postData[activeTab].map((post, index) => (
            <div className="border p-4" key={index}>
                <h4 className="font-semibold">{post.title}</h4>
                <p className="text-gray-600">{post.description}</p>
            </div>
        ));
    };

    return (
        <>
            <Slider slides={slides} />
            <div className="text-black font-bold mx-auto" style={{ paddingLeft: '10rem', paddingRight: '10rem' }}>
                <div className="w-full my-8">
                    <p className="text-4xl">VĂN NGHỆ</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <NewPost/>


                    <PostSection postData={postData} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="h-full">
                    <PopularPerformances performances={performances} />
                </div>

            </div>
        </>
    );
}
