import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import Pagination from './Pagination';
import styles from './ActivityList.module.scss';
import PostItem from './PostItem';
import Category from './Category';
import { API_URL } from '../../config/config';
import { Spin } from 'antd';
const ActivityList = ({ totalPages, onPageChange, currentPage }) => {
    const { category } = useParams();
    const [posts, setPosts] = useState([]);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/posts?category=${category}&page=${currentPage}&limit=6`);
                const data = await response.json();

                if(data.success) {
                    setPosts(data.data.posts);
                    if(data.data.posts && data.data.posts.length > 0) {
                        setCategoryTitle(data.data.posts[0].post_category_id.title);
                    }
                } else {
                    setError('Không thể tải bài viết. Vui lòng thử lại sau.');
                }
            } catch(error) {
                setError('Có lỗi xảy ra khi tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };

        if(category) {
            fetchPosts();
        }
    }, [category, currentPage]);

    const handleCategoryChange = (categorySlug, categoryTitle) => {
        navigate(`/posts/${categorySlug}`, { state: { categorySlug } });
    };

    return (
        <div className={`${styles.activityListContainer} px-24 pt-36`}>
            <div className=" p-4 flex justify-between items-center mb-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                <div className='flex items-center'>
                    <Link to="/" className="font-semibold hover:text-white transition duration-300">
                        <span>Trang chủ</span>
                    </Link>
                    <IoIosArrowForward />
                    <span className="font-semibold text-white">Văn nghệ</span>
                </div>
                <Link to="/posts/van-nghe" >
                    <span className='text-white hover:underline'>Xem tất cả</span>
                </Link>
            </div>

            <div className={`${styles.activityList}`}>

                {loading ? (
                    <div className="flex justify-center items-center min-h-64">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <div className={`${styles.posts} gap-10`}>
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
                )}
                <div className={`${styles.category} bg-white rounded-lg`}>
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
