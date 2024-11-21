import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Pagination from './Pagination';
import styles from './ActivityList.module.scss';
import PostItem from './PostItem';
import Category from './Category';
const ActivityList = ({ posts, category, totalPages, onPageChange, currentPage }) => {
    return (
        <div className={styles.activityListContainer}>
            <div className={`${styles.breadcrumb} bg-gray-100 text-gray-700 p-3 shadow`}>
                <a href="/" className="hover:text-blue-600 transition-colors duration-200">
                    Trang chủ
                </a>
                <ChevronRightIcon className="w-4 h-4 mx-2" aria-hidden="true" />
                <a href={`/posts/${category}`} className="hover:text-blue-600 transition-colors duration-200">
                    Sự kiện
                </a>
            </div>

            <div className={styles.activityList}>
                <div className={styles.posts}>
                    {posts.map((post) => (
                        <PostItem
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
                <Category />
            </div>


            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default ActivityList;
