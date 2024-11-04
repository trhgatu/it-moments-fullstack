import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/config';
import Slider from './components/Slider';
import PopularPerformances from './components/PopularPerformances';
import PostSection from './components/PostSection';
import NewPost from './components/NewPost';
import EventSection from './components/EventSection';
import 'swiper/css';
import styles from './Home.module.scss';
import slide1 from '../../assets/images/slider_1.jpg';
import slide2 from '../../assets/images/slider_2.jpg';
import slide3 from '../../assets/images/slider_3.jpg';

export default function Home() {
    const [mostViewPostPerformances, setMostViewPostPerformances] = useState([]);
    const [newPostPerformances, setnewPostPerformances] = useState([]);
    const [mostVotePostPerformances, setMostVotePostPerformances] = useState([]);
    const [events, setEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('Mới');


   /*  Lỗi */
    useEffect(() => {
        axios.get(`${API_URL}/posts?category=van-nghe&isFeatured=true&isLatest=true`)
            .then((response) => setnewPostPerformances(response.data.data.posts))
            .catch((error) => console.error("Error fetching Văn nghệ posts:", error));
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/posts?category=su-kien`)
            .then((response) => setEvents(response.data.data.posts))
            .catch((error) => console.error("Error fetching Sự kiện posts:", error));
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/posts?category=van-nghe&isFeatured=true&sortKey=views&sortValue=desc`)
            .then((response) => setMostViewPostPerformances(response.data.data.posts))
            .catch((error) => console.error("Error fetching Tiết mục nhiều lượt xem posts:", error));
    }, []);
    useEffect(() => {
        axios.get(`${API_URL}/posts?category=van-nghe&isFeatured=true&sortKey=votes&sortValue=desc`)
            .then((response) => setMostVotePostPerformances(response.data.data.posts))
            .catch((error) => console.error("Error fetching Tiết mục nhiều lượt xem posts:", error));
    }, []);


    const slides = [
        { src: slide1, alt: "Image 1", title: "Lưu giữ những khoảnh khắc" },
        { src: slide2, alt: "Image 2", title: "Những sự kiện mới" },
        { src: slide3, alt: "Image 3", title: "Các hoạt động văn nghệ" },
    ];

    return (
        <>
            <div className="w-full">
                <div className={styles.sliderContainer}>
                    <Slider slides={slides} />
                </div>

                <div className="text-black mx-auto container">
                    <div className={styles.mainContent}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8">
                            <div className="flex flex-col col-span-2 h-full">
                                <NewPost />
                            </div>
                            <div className="flex flex-col h-full">
                                <PostSection postData={{
                                    'Mới': newPostPerformances,
                                    'Nhiều lượt bình chọn': mostVotePostPerformances,
                                    'Nhiều lượt xem': mostViewPostPerformances
                                }} activeTab={activeTab} setActiveTab={setActiveTab} />
                            </div>
                        </div>
                        <div className="my-6">
                            <PopularPerformances mostViewPostPerformances={mostViewPostPerformances} />
                        </div>

                        {/* Sự kiện Section */}
                        <div className="event-section">
                            <EventSection events={events} />
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
}
