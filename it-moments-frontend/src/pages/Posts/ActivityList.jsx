import React, { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Pagination from './Pagination';
import styles from './ActivityList.module.scss';
import PostItem from './PostItem';
import Category from './Category';
import { API_URL } from '../../config/config';

const ActivityList = ({ category, totalPages, onPageChange, currentPage }) => {

    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [breadcrumb, setBreadcrumb] = useState(['Văn nghệ']);
    const updateBreadcrumb = (newCategory) => {
        const updatedBreadcrumb = ['Văn nghệ', ...newCategory];
        setBreadcrumb(updatedBreadcrumb);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${API_URL}/posts?category=${selectedCategory}&page=${currentPage}&limit=6`);
                const data = await response.json();
                if (data.success) {
                    setPosts(data.data.posts);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        if (selectedCategory) {
            fetchPosts();
        }
    }, [selectedCategory, currentPage]);

    const handleCategoryChange = (categorySlug, categoryTitle, parentCategorySlug = null) => {
        setSelectedCategory(categorySlug);
        if (parentCategorySlug) {
            updateBreadcrumb([parentCategorySlug, categoryTitle]);
        } else {
            updateBreadcrumb([categoryTitle]);
        }
    };

    return (
        <div className={styles.activityListContainer}>
            <div className={`${styles.breadcrumb} bg-gray-100 text-gray-700 p-3 shadow`}>
                {breadcrumb.map((crumb, index) => (
                    <span key={index}>
                        {index > 0 && ' > '}
                        {index === breadcrumb.length - 1 ? (
                            crumb // Phần cuối không có link
                        ) : (
                            <a href={`/posts/${crumb}`} className="hover:text-blue-600 transition-colors duration-200">
                                {crumb}
                            </a>
                        )}
                    </span>
                ))}
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
                            category={selectedCategory}
                        />
                    ))}
                </div>
                <div className={styles.category}>
                    <Category onCategoryChange={handleCategoryChange} />
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

export default ActivityList;
