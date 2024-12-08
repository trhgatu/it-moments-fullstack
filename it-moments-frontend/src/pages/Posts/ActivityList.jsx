import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import Pagination from './Pagination';
import styles from './ActivityList.module.scss';
import PostItem from './PostItem';
import Category from './Category';
import { Input, Spin, Button } from 'antd';
import { API_URL } from '../../config/config';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';

const ActivityList = ({ posts, totalPages, onPageChange, currentPage, loading }) => {
    const { category } = useParams();
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const navigate = useNavigate();

    const handleSearch = async () => {
        setIsSearching(true);
        setSearchLoading(true);
        try {
            const response = await fetch(`${API_URL}/posts?category=${category}&keyword=${keyword}`);
            const data = await response.json();
            if (data.success) {
                setSearchResults(data.data.posts);
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
        } finally {
            setSearchLoading(false);
        }
    };
    const displayedPosts = isSearching ? searchResults : posts;

    return (
        <div className={`${styles.activityListContainer} px-24 pt-36`}>
            <div className="p-4 flex justify-between items-center mb-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                <div className="flex items-center">
                    <Link to="/" className="font-semibold hover:text-white transition duration-300">
                        <span>Trang chủ</span>
                    </Link>
                    <IoIosArrowForward />
                    <span className="font-semibold text-white">Văn nghệ</span>
                </div>
                <Link onClick={() => window.location.href = "/posts/van-nghe"}>
                    <span className="text-white hover:underline">Xem tất cả</span>
                </Link>
            </div>
            <div className="mb-6">
                <div className="flex items-center">
                    <Input
                        placeholder="Tìm kiếm bài viết..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)} // Cập nhật từ khóa tìm kiếm
                        onPressEnter={handleSearch}  // Tìm kiếm khi nhấn Enter
                        className="w-80 md:w-96 lg:w-[400px] h-10"
                        style={{ height: '40px' }}
                    />
                    <Button
                        className='ml-2'
                        type="primary"
                        onClick={handleSearch}
                        style={{
                            height: '40px',
                            width: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        icon={
                            searchLoading ? (
                                <Spin indicator={<LoadingOutlined style={{ fontSize: '20px', color: 'white' }} />} />
                            ) : (
                                <SearchOutlined style={{ fontSize: '20px' }} />
                            )
                        }
                    />
                </div>
            </div>

            <div className={`${styles.activityList}`}>
                {searchLoading || loading ? (
                    <div className="flex justify-center items-center min-h-64">
                        <Spin size="large" />
                    </div>
                ) : displayedPosts.length === 0 ? (
                    <div className="text-center text-gray-500">Không có bài viết nào được tìm thấy.</div>
                ) : (
                    <div className={`${styles.posts} gap-10`}>
                        {displayedPosts.map((post) => (
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
                    <Category onCategoryChange={(categorySlug) => navigate(`/posts/${categorySlug}`)} />
                </div>
            </div>

            {/* Chỉ hiển thị Pagination nếu không có từ khóa tìm kiếm */}
            {!keyword && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

export default ActivityList;
