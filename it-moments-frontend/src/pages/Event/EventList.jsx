import React from 'react';
import EventItem from '../Event/EventItem';
import Pagination from '../Posts/Pagination';
import Category from './Category';
import styles from './EventList.module.scss';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const EventList = ({ posts, category, totalPages, onPageChange, currentPage, onCategoryChange }) => {
    return (
        <div className={styles.eventListContainer}>
            <div className={`${styles.breadcrumb} bg-gray-100`}>
                <a href={`/posts/${category}`} className="hover:text-blue-600 transition-colors duration-200">
                    Sự kiện
                </a>
            </div>
            <div className={`${styles.eventList} flex`}>
                <div className="flex-1 flex flex-wrap gap-4">
                    {posts.map((post) => (
                        <EventItem
                            key={post._id}
                            title={post.title}
                            description={post.description}
                            author={post.accountFullName}
                            date={new Date(post.createdAt).toLocaleDateString()}
                            imageUrl={post.thumbnail || 'https://via.placeholder.com/150'}
                            slug={post.slug}
                            category={category}
                        />
                    ))}
                </div>
                <div className="w-[300px] flex-shrink-0"> {}
                    <Category onCategoryChange={onCategoryChange} />
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default EventList;
