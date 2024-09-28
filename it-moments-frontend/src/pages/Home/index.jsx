import React, { useState } from 'react';
import Slider from './components/Slider';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import './Home.module.scss';
import SwiperPagination from './components/SwiperPagination';
import slide1 from '../../assets/images/slider_1.jpg';
import slide2 from '../../assets/images/slider_2.jpg';
import slide3 from '../../assets/images/slider_3.jpg';

export default function Home() {
    const slides = [
        { src: slide1, alt: "Image 1", title: "Lưu giữ những khoảnh khắc" },
        { src: slide2, alt: "Image 2", title: "Những sự kiện mới" },
        { src: slide3, alt: "Image 3", title: "Các hoạt động văn nghệ" },
    ];

    // Dữ liệu cho tiết mục văn nghệ nhiều lượt xem
    const popularPerformances = [
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
                    {/* Phần chính bên trái */}
                    <div className="relative overflow-hidden block md:col-span-2">
                        <div
                            className="relative overflow-hidden min-h-full"
                            style={{
                                backgroundImage: `url(${slide1})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 bg-black opacity-35"></div>
                            <span className="absolute bg-blue-500 text-white text-xl font-semibold px-6 py-1 left-5 top-5">Mới</span>

                            <div className="absolute z-10 w-full bottom-0 px-11 h-72">
                                {/* Danh mục */}
                                <div className="mb-4 flex">
                                    <Link className="text-white text-2xl uppercase hover:text-blue-600">Văn nghệ</Link>
                                    <p className="text-white text-2xl ml-2 mr-2">/</p>
                                    <p className="text-white text-2xl">28/9/24</p>
                                </div>

                                {/* Tiêu đề */}
                                <div className="mb-4">
                                    <p className="text-4xl font-semibold text-white mt-2">
                                        <Link to="/path-to-your-performances" className="hover:text-blue-500 transition-colors duration-300">
                                            GALA Chào đón tân sinh viên K15: Tiết mục "Chúng ta của hiện tại"
                                        </Link>
                                    </p>
                                </div>

                                {/* Mô tả */}
                                <div className="w-3/6 mt-4 mb-4">
                                    <p className="text-2xl text-white font-normal">
                                        Tiết mục đạt giải nhất trong sự kiện GALA Chào đón tân sinh viên k15...
                                    </p>
                                </div>

                                {/* Thông tin người đăng và lượt xem */}
                                <div className="w-full pt-9">
                                    <div className="flex justify-between text-white w-full font-normal">
                                        <span>Admin</span>
                                        <span>Views: 100</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phần bài viết bên phải */}
                    <div className="w-full">
                        {/* Thanh lựa chọn */}
                        <div className="flex space-x-4 border-b-2 pb-2 mb-4">
                            {Object.keys(postData).map((tab, index) => (
                                <button
                                    key={index}
                                    className={`text-lg font-semibold ${activeTab === tab ? 'text-blue-500 border-blue-500 border-b-2' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Nội dung dựa trên tab được chọn */}
                        <div className="flex flex-col gap-4">
                            {renderContent()}
                        </div>
                    </div>
                </div>

                {/* Phần "Tiết mục nhiều lượt xem" */}
                <div className="flex justify-between">
                    <p className="text-4xl my-4">Tiết mục nhiều lượt xem</p>
                    <SwiperPagination />
                </div>

                {/* Swiper section */}
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
            </div>
        </>
    );
}
