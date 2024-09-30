import React from 'react';
import PropTypes from 'prop-types';
import styles from './PostItem.module.scss';

const PostItem = ({ title, author, date, imageUrl, category }) => {
    // Chuyển category thành chữ thường để phù hợp với class
    const categoryClass = category.toLowerCase();

    return (
        <div className={styles.postItem}>
            <div className={styles.postImage}>
                <img src={imageUrl} alt={title} loading="lazy" />
                {/* Huy hiệu danh mục */}
                <div className={`${styles.postCategory} ${styles[categoryClass]}`}>
                    {category}
                </div>
            </div>
            <div className={styles.postContent}>
                <h3 className={styles.postTitle}>{title}</h3>
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
    category: PropTypes.string.isRequired
};

export default PostItem;
