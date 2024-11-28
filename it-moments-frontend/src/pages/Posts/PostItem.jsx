// PostItem.js
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './PostItem.module.scss';
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";

const PostItem = ({ title, description, author, date, imageUrl, slug, category }) => {
    const navigate = useNavigate();

    const handlePostItemClick = () => {
        navigate(`/posts/${category}/${slug}`);
    };

    return (
        <div className={`${styles.postItem} group border-2`} onClick={handlePostItemClick}>
            <div className={`${styles.postImage} group-hover:opacity-70 transition-all duration-300`}>
                <img src={imageUrl} alt={title} loading="lazy" />
                <div className={styles.overlay}></div>
            </div>
            <div className={styles.postContent}>
                <h3
                    className="text-lg font-semibold line-clamp-2 cursor-pointer group-hover:text-blue-500 transition-all duration-300"
                    style={{ cursor: 'pointer' }}
                >
                    {title}
                </h3>

                <div className="line-clamp-2"
                    dangerouslySetInnerHTML={{
                        __html: description,
                    }}
                />
                <div className={`${styles.postMeta} pt-4`}>
                    <span className={styles.postAuthor}><IoPersonOutline className={styles.personIcon} />{author}</span>
                    <span className={styles.postDate}><FaRegCalendarAlt className={styles.calendarIcon} />{date}</span>
                </div>
            </div>
        </div>
    );
};

PostItem.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired
};

export default PostItem;
