// PostItem.js
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './PostItem.module.scss';

const PostItem = ({ title, author, date, imageUrl, category, id }) => {
    const navigate = useNavigate();

    const handlePostItemClick = () => {
        navigate(`/posts/detail/${id}`);
    };

    const categoryClass = category.toLowerCase();

    return (
        <div className={styles.postItem} onClick={handlePostItemClick}>
            <div className={styles.postImage}>
                <img src={imageUrl} alt={title} loading="lazy" />
            </div>
            <div className={styles.postContent}>
                {/* Thêm onClick vào tiêu đề */}
                <h3 className={styles.postTitle} style={{ cursor: 'pointer' }}>
                    {title}
                </h3>
                <p className={styles.postDescription}>Mô tả ngắn về bài viết để thu hút người đọc...</p>
                <div className={styles.postMeta}>
                    <span className={styles.postAuthor}>{author}</span>
                    <span className={styles.postDate}>{date}</span>
                </div>
            </div>
        </div>
    );
};

PostItem.propTypes = {
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired, // Thêm id làm prop bắt buộc
};

export default PostItem;
