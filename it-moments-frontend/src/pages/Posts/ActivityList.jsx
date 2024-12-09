import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import Pagination from './Pagination';
import styles from './ActivityList.module.scss';
import PostItem from './PostItem';
import Category from './Category';
import { Input, Spin, Button, Dropdown, Menu } from 'antd';
import { API_URL } from '../../config/config';
import { SearchOutlined, LoadingOutlined, DownOutlined } from '@ant-design/icons';

const ActivityList = ({ posts, totalPages, onPageChange, currentPage, loading }) => {
    const { category } = useParams();
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [sortOption, setSortOption] = useState({ sortKey: 'createdAt', sortValue: 'desc' });
    const navigate = useNavigate();

    const handleSearch = async () => {
        setIsSearching(true);
        setSearchLoading(true);
        const { sortKey, sortValue } = sortOption;
        try {
            const response = await fetch(`${API_URL}/posts?category=${category}&keyword=${keyword}&sortKey=${sortKey}&sortValue=${sortValue}`);
            const data = await response.json();
            if(data.success) {
                setSearchResults(data.data.posts);
            }
        } catch(error) {
            console.error("Lỗi khi tìm kiếm:", error);
        } finally {
            setSearchLoading(false);
        }
    };
    const displayedPosts = isSearching ? searchResults : posts;
    const handleSortChange = (key, value) => {
        setSortOption({ sortKey: key, sortValue: value });
        handleSearch();
    };

    const sortMenu = (
        <Menu>
            <Menu.Item key="newest" onClick={() => handleSortChange('createdAt', 'desc')}>
                Mới nhất
            </Menu.Item>
            <Menu.Item key="oldest" onClick={() => handleSortChange('createdAt', 'asc')}>
                Cũ nhất
            </Menu.Item>
            <Menu.Item key="most_viewed" onClick={() => handleSortChange('views', 'desc')}>
                Xem nhiều nhất
            </Menu.Item>
            <Menu.Item key="most_commented" onClick={() => handleSortChange('comments', 'desc')}>
                Bình luận nhiều nhất
            </Menu.Item>
        </Menu>
    );
    return (
        <>
            <div className={`col-span-12 md:col-span-9 bg-white p-6 rounded-lg`}>
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
                    <div className="flex items-center justify-between">
                        <div className='flex items-center'>
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
                        <Dropdown overlay={sortMenu} trigger={['click']}>
                            <Button>
                                Bộ lọc:  <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>

                </div>

                <div className={`flex flex-col space-y-8 p-10 bg-gray-100 rounded-lg mb-36`}>
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
                    {!keyword && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    )}
                </div>

            </div>
            <div className={"col-span-12 md:col-span-3 space-y-8 rounded-lg"}>
                <Category onCategoryChange={(categorySlug) => navigate(`/posts/${categorySlug}`)} />
            </div>
        </>
    );
};

export default ActivityList;
