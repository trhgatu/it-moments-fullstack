import React, { useState } from 'react';
import EventItem from '../Event/EventItem';
import Pagination from '../Posts/Pagination';
import EventCategory from './EventCategory';
import { Link } from 'react-router-dom';
import { Input, Spin, Button, Dropdown, Menu } from 'antd';
import { IoIosArrowForward } from 'react-icons/io';
import { API_URL } from '../../config/config';
import { SearchOutlined, LoadingOutlined, DownOutlined } from '@ant-design/icons';

const EventList = ({ posts, category, totalPages, onPageChange, currentPage, onCategoryChange, loading }) => {
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [sortOption, setSortOption] = useState({ sortKey: 'createdAt', sortValue: 'desc' });

    const handleSearch = async () => {
        setIsSearching(true);
        setSearchLoading(true);
        try {
            const { sortKey, sortValue } = sortOption;
            const response = await fetch(
                `${API_URL}/posts?category=${category}&keyword=${keyword}&sortKey=${sortKey}&sortValue=${sortValue}`
            );
            const data = await response.json();
            if(data.success) {
                setSearchResults(data.data.posts);
            }
        } catch(error) {
            console.error('Lỗi khi tìm kiếm:', error);
        } finally {
            setSearchLoading(false);
        }
    };

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


    const displayedPosts = isSearching ? searchResults : posts;

    return (
        <>
            <div className="col-span-12 md:col-span-8 bg-white p-6 rounded-lg">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-4 flex items-center mb-8">
                    <Link to="/" className="font-semibold hover:text-blue-600 transition duration-300">
                        <span>Trang chủ</span>
                    </Link>
                    <IoIosArrowForward />
                    <span className="font-semibold text-white">
                        <span>Sự kiện</span>
                    </span>
                </div>
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className='flex items-center'>
                            {/* Search Input */}
                            <Input
                                placeholder="Tìm kiếm bài viết..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onPressEnter={handleSearch}
                                className="w-80 md:w-96 lg:w-[400px] h-10"
                                style={{ height: '40px' }}
                            />
                            {/* Search Button */}
                            <Button
                                className="ml-2"
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
                                        <Spin
                                            indicator={
                                                <LoadingOutlined style={{ fontSize: '20px', color: 'white' }} />
                                            }
                                        />
                                    ) : (
                                        <SearchOutlined style={{ fontSize: '20px' }} />
                                    )
                                }
                            />
                            {/* Sort Dropdown */}
                        </div>
                        <Dropdown overlay={sortMenu} trigger={['click']}>
                            <Button>
                                Bộ lọc:  <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex flex-col space-y-8 p-6 rounded-lg mb-36">
                    {searchLoading || loading ? (
                        <div className="flex justify-center items-center min-h-64">
                            <Spin size="large" />
                        </div>
                    ) : displayedPosts.length === 0 ? (
                        <div className="text-center text-gray-500">Không có bài viết nào được tìm thấy.</div>
                    ) : (
                        <div>
                            {displayedPosts.map((post) => (
                                <EventItem
                                    className="flex rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-200 border-2"
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
                            ))}
                        </div>
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
