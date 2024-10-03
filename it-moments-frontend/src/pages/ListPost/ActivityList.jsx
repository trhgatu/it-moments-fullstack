import React from 'react';
import styles from './ActivityList.module.scss';
import Filter from './Filter';
import Category from './Category';
import PostItem from './PostItem';
import Pagination from './Pagination';
import slider1 from '../../assets/images/slider_1.jpg';
import slider2 from '../../assets/images/slider_2.jpg';
import slider3 from '../../assets/images/slider_3.jpg';

const ActivityList = () => {
    const posts = [
        { id: 1, title: 'Tiêu đề bài viết 1', author: 'Admin', date: '2/9/2024', imageUrl: slider1, category: 'Danh mục 1' },
        { id: 2, title: 'Tiêu đề bài viết 2', author: 'Admin', date: '3/9/2024', imageUrl: slider2, category: 'Danh mục 2' },
        { id: 3, title: 'Tiêu đề bài viết 3', author: 'Admin', date: '4/9/2024', imageUrl: slider3, category: 'Danh mục 3' },
        { id: 4, title: 'Tiêu đề bài viết 4', author: 'Admin', date: '5/9/2024', imageUrl: slider1, category: 'Danh mục 4' },
        { id: 5, title: 'Tiêu đề bài viết 5', author: 'Admin', date: '6/9/2024', imageUrl: slider2, category: 'Danh mục 5' },
        { id: 6, title: 'Tiêu đề bài viết 6', author: 'Admin', date: '7/9/2024', imageUrl: slider3, category: 'Danh mục 1' },
        { id: 7, title: 'Tiêu đề bài viết 7', author: 'Admin', date: '8/9/2024', imageUrl: slider1, category: 'Danh mục 2' },
        { id: 8, title: 'Tiêu đề bài viết 8', author: 'Admin', date: '9/9/2024', imageUrl: slider2, category: 'Danh mục 3' }
    ];

    return (
        <div className="w-full max-w-[1700px] min-w-[360px] min-h-screen p-10 mx-auto bg-gray-100 pb-28 box-border overflow-y-auto overflow-x-hidden">
            {/* Breadcrumb */}
            <div className="text-md text-gray-600 mb-8 bg-gray-300 p-5 rounded w-full h-16 leading-[3.5rem]">
                Trang chủ &gt; Danh sách hoạt động
            </div>

            {/* Bộ lọc */}
            <div className="relative z-50 mb-8 p-4">
                <Filter />
            </div>

            {/* Layout chính */}
            <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-8">
                {/* Bài viết */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-[1350px] pr-6 overflow-y-auto max-h-[calc(100vh-180px)]">
                    {posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <PostItem
                                key={post.id}
                                title={post.title}
                                author={post.author}
                                date={post.date}
                                imageUrl={post.imageUrl}
                                category={post.category}
                            />
                        ))
                    ) : (
                        <p>Không có bài viết nào để hiển thị</p>
                    )}
                </div>

                {/* Danh mục */}
                <div className="flex-shrink-0 w-full lg:w-[400px]">
                    <Category />
                </div>
            </div>

            {/* Phân trang */}
            <Pagination totalPages={5} />
        </div>
    );
};

export default ActivityList;
