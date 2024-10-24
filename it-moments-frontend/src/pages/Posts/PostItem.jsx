// PostItem.js
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './PostItem.module.scss';
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
const PostItem = ({ title, author, date, imageUrl, id }) => {
    const navigate = useNavigate();

    const handlePostItemClick = () => {
        navigate(`/posts/detail/${id}`);
    };


    return (
        <div className={styles.postItem} onClick={handlePostItemClick}>
            <div className={styles.postImage}>
                <img src={imageUrl} alt={title} loading="lazy" />
            </div>
            <div className={styles.postContent}>

                <h3 className={styles.postTitle} style={{ cursor: 'pointer' }}>
                    {title}
                </h3>
                <p className={styles.postDescription}>Mô tả ngắn về bài viết để thu hút người đọc...</p>
                <div className={styles.postMeta}>
                    <span className={styles.postAuthor}><IoPersonOutline className={styles.personIcon}/>{author}</span>
                    <span className={styles.postDate}><FaRegCalendarAlt className={styles.calendarIcon}/>{date}</span>
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
    id: PropTypes.string.isRequired,
};

export default PostItem;
