import React from 'react';
import EventItem from '../Event/EventItem';
import Pagination from '../Posts/Pagination';
import EventCategory from './EventCategory';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";

const EventList = ({ posts, category, totalPages, onPageChange, currentPage, onCategoryChange, loading }) => {
    return (
        <>
            <div className='col-span-12 md:col-span-8 bg-white p-6 rounded-lg'>
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-4 flex items-center mb-8">
                    <Link
                        to="/"
                        className="font-semibold hover:text-blue-600 transition duration-300"
                    >
                        <span>Trang chủ</span>
                    </Link>
                    <IoIosArrowForward />
                    <span className="font-semibold text-white">
                        <span>Sự kiện</span>
                    </span>
                </div>
                <div className='flex flex-col space-y-8 p-6 bg-gray-100 mb-36'>
                    {loading ? (
                        <div className="flex justify-center items-center min-h-64">
                            <Spin size="large" />
                        </div>
                    ) : (
                        posts.map((post) => (
                            <EventItem
                                className="flex bg-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-200"
                                key={post._id}
                                title={post.title}
                                eventStatus={post.event_id.status}
                                description={post.description}
                                author={post.accountFullName}
                                date={new Date(post.createdAt).toLocaleDateString()}
                                imageUrl={post.thumbnail || 'https://via.placeholder.com/150'}
                                slug={post.slug}
                                category={category}
                            />
                        ))
                    )}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
            <div className="col-span-12 md:col-span-4 space-y-8">
                <EventCategory onCategoryChange={onCategoryChange} />
            </div>
        </>
    );
};

export default EventList;
