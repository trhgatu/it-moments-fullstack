import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/config';
import Background from './components/Background';
import PostSection from './components/PostSection';
import NewPost from './components/NewPost';
import TopPostsSection from './components/TopPostsSection';
import AcademicSection from './components/AcademicSection';
import EventSection from './components/EventSection';
import 'swiper/css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { motion, useInView } from 'framer-motion';
import { Element } from 'react-scroll';
import styles from './Home.module.scss';

export default function Home() {
    const [mostViewPostPerformances, setMostViewPostPerformances] = useState([]);
    const [newPostPerformances, setnewPostPerformances] = useState([]);
    const [mostVotePostPerformances, setMostVotePostPerformances] = useState([]);
    const [events, setEvents] = useState([]);

    const vanNgheRef = useRef(null);
    const suKienRef = useRef(null);
    const hocThuatRef = useRef(null);
    const isInViewVanNghe = useInView(vanNgheRef, { once: false });
    const isInViewSuKien = useInView(suKienRef, { once: false });
    const isInViewHocThuat = useInView(hocThuatRef, { once: false });
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
        axios.get(`${API_URL}/posts?category=van-nghe&isFeatured=true&sortKey=views&sortValue=desc&limit=2`)
            .then((response) => setMostViewPostPerformances(response.data.data.posts))

            .catch((error) => console.error("Error fetching Tiết mục nhiều lượt xem posts:", error));
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/posts?category=van-nghe&isFeatured=true&sortKey=votes&sortValue=desc`)
            .then((response) => setMostVotePostPerformances(response.data.data.posts))
            .catch((error) => console.error("Error fetching Tiết mục nhiều lượt xem posts:", error));
    }, []);

    useEffect(() => {
        AOS.init();
    }, []);

    useEffect(() => {
        document.body.style.overflowX = 'hidden';
        return () => {
            document.body.style.overflowX = 'auto';
        };
    }, []);

    return (
        <>
            <div className="w-full overflow-x-hidden">
                <div className="">
                    <Background />
                </div>
                <div className="text-black mx-auto">
                    <div className="">
                        <Element name='vanNgheSection'>
                            <div>
                                <div
                                    className={`${styles.titleHeading} text-center text-4xl md:text-4xl font-bold pt-36`}
                                    data-aos="fade-right"
                                    data-aos-duration="800"
                                >
                                    <span className='relative uppercase' ref={vanNgheRef}>Văn nghệ
                                        {isInViewVanNghe && (
                                            <motion.span
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 1.5 }}
                                                className="absolute -bottom-10 left-0 h-1 bg-blue-500"
                                            />
                                        )}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-44 py-20">
                                    <div
                                        className="flex flex-col col-span-2 h-full"
                                        data-aos="fade-right"
                                        data-aos-duration="800"
                                        data-aos-delay="200"
                                    >
                                        <NewPost />
                                    </div>
                                    <div
                                        className="flex flex-col h-full"
                                        data-aos="fade-left"
                                        data-aos-duration="800"
                                        data-aos-delay="400"
                                    >
                                        <PostSection
                                            postData={mostViewPostPerformances}
                                        />
                                    </div>

                                </div>
                                <div className='h-full w-full bg-white px-24 py-20'>
                                    <TopPostsSection/>
                                </div>
                            </div>
                        </Element>
                        <Element name='suKienSection' className="py-20 px-56">
                            <div
                                className={`${styles.titleHeading} text-center text-4xl md:text-4xl font-bold text-black pt-20 pb-20`}
                                data-aos="fade-right"
                                data-aos-duration="800"
                            >
                                <span className='relative uppercase' ref={suKienRef}>Sự kiện
                                    {isInViewSuKien && (
                                        <motion.span
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 1.5 }}
                                            className="absolute -bottom-10 left-0 h-1 bg-blue-500"
                                        />
                                    )}
                                </span>
                            </div>
                            <div
                                className={`text-center md:text-4xl pb-10`}
                                data-aos="fade-left"
                                data-aos-duration="900"
                            >
                                {/* <span className='relative text-3xl' ref={suKienRef}>
                                    Sự kiện đặc sắc đang diễn ra!
                                </span> */}
                            </div>
                            <EventSection />
                        </Element>
                        <Element name='hocThuatSection' className='py-20 px-56 bg-white'>
                            <div
                                className={`${styles.titleHeading} text-center text-4xl md:text-4xl font-bold text-black pt-20 pb-20`}
                                data-aos="fade-right"
                                data-aos-duration="800"
                            >
                                <span className='relative uppercase' ref={hocThuatRef}>Học thuật
                                    {isInViewHocThuat && (
                                        <motion.span
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 1.5 }}
                                            className="absolute -bottom-10 left-0 h-1 bg-blue-500"
                                        />
                                    )}
                                </span>
                            </div>
                            <div
                                className={`text-center md:text-4xl pb-10`}
                                data-aos="fade-left"
                                data-aos-duration="900"
                            >
                                {/* <span className='relative text-3xl' ref={suKienRef}>
                                    Sự kiện đặc sắc đang diễn ra!
                                </span> */}
                            </div>
                            <AcademicSection />
                        </Element>
                    </div>
                </div>
            </div>
        </>
    );
}
