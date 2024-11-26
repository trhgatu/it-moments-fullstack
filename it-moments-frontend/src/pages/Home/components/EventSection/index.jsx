import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Pagination from './components/Pagination';
import { Autoplay } from 'swiper/modules';
import { FaRegClock } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { API_URL } from "../../../../config/config"
import { Link } from 'react-router-dom';

export default function EventSection() {
    const [events, setEvents] = useState([]);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts?category=su-kien`);
                const fetchedEvents = response.data.data.posts
                    .map(post => ({
                        title: post.title,
                        description: post.description,
                        image: post.thumbnail,
                        badge: post.post_category_id?.title,
                        date: new Date(post.createdAt).toLocaleDateString(),
                        accountFullName: post.accountFullName,
                        slug: post.slug,
                        categorySlug: post.post_category_id?.slug,
                    }));
                setEvents(fetchedEvents);
            } catch(error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="h-full w-full relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-3">
                    <Swiper
                        ref={swiperRef}
                        spaceBetween={10}
                        slidesPerView={1}
                        loop={true}
                        speed={800}
                        onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
                        className="mySwiper"
                    >
                        {[...Array(Math.ceil(events.length / 3))].map((_, slideIndex) => (
                            <SwiperSlide key={slideIndex}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {events.slice(slideIndex * 3, slideIndex * 3 + 3).map((event, index) => (
                                        <div
                                            key={index}
                                            className="relative p-8 rounded-3xl overflow-hidden bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.05),inset_0px_0px_0px_1px_rgb(209,213,219)]"
                                        >
                                            <Link
                                                to={`/posts/${event.categorySlug}/${event.slug}`}
                                                className="block h-full"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={event.image}
                                                        alt={event.title}
                                                        className="w-full h-96 object-cover rounded-3xl"
                                                    />
                                                    {event.badge && (
                                                        <span className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 z-10">
                                                            {event.badge}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-black pt-6">
                                                    <h3 className="text-2xl font-bold text-black line-clamp-2">{event.title}</h3>
                                                    <div className='line-clamp-2 text-gray-600'
                                                        dangerouslySetInnerHTML={{
                                                            __html: event.description,
                                                        }}
                                                    />
                                                    <div className='flex justify-between mt-4'>
                                                        <div className='flex items-center'>
                                                            <FaRegClock style={{ fontSize: "17px" }} />
                                                            <p className="text-sm mb-0 text-black items-center ml-2">{event.date}</p>
                                                        </div>
                                                        <div className='flex items-center'>
                                                            <IoIosPerson style={{ fontSize: "18px" }} />
                                                            <p className="text-sm mb-0 text-black items-center ml-2 mt-1">{event.accountFullName}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Pagination
                        swiperRef={swiperRef}
                        activeSlideIndex={activeSlideIndex}
                        totalSlides={Math.ceil(events.length / 3)}
                    />
                </div>
            </div>
        </div>
    );
}
