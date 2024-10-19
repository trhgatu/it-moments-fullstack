import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ActivityList.module.scss';
import Filter from './Filter';
import Category from './Category';
import PostItem from './PostItem';
import Pagination from './Pagination';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
const ActivityList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/posts');
                setPosts(response.data);
                setLoading(false);
            } catch(error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);


    if(loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    return (
        <div className={styles.activityListContainer}>
            <div className={`${styles.breadcrumb} bg-gray-100 text-gray-700 p-3 shadow`}>
                <a href="/" className="hover:text-blue-600 transition-colors duration-200">
                    Trang chủ
                </a>
                <ChevronRightIcon className="w-4 h-4 mx-2" aria-hidden="true" />
                <a href="/posts" className="hover:text-blue-600 transition-colors duration-200">
                    Văn nghệ
                </a>
            </div>

            <div className={styles.activityFilterContainer}>
                <Filter />
            </div>

            <div className={styles.activityList}>
                <div className={styles.posts}>
                    {posts.map((post) => (
                        <PostItem
                            key={post._id}
                            title={post.title}
                            author={post.createdBy.account_id}
                            date={new Date(post.createdAt).toLocaleDateString()}
                            imageUrl={post.thumbnail || 'https://via.placeholder.com/150'}
                            category="Danh mục 1"
                            id={post._id}
                        />
                    ))}
                </div>
                <Category />
            </div>
            <Pagination totalPages={5} />
        </div>
    );
};

export default ActivityList;
