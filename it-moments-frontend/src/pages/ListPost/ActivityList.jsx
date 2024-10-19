import React from 'react';
import styles from './ActivityList.module.scss';
import Filter from './Filter';
import Category from './Category';
import PostItem from './PostItem';
import Pagination from './Pagination';

// Import các ảnh từ thư mục assets/images
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
        <div className={styles.activityListContainer}>
            <div className={styles.breadcrumb}>Trang chủ &gt; Danh sách hoạt động</div>

            <div className={styles.activityFilterContainer}>
                <Filter />
            </div>

            <div className={styles.activityList}>
                <div className={styles.posts}>
                    {posts.map((post) => (
                        <PostItem 
                            key={post.id} 
                            title={post.title} 
                            author={post.author} 
                            date={post.date} 
                            imageUrl={post.imageUrl} 
                            category={post.category} 
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
