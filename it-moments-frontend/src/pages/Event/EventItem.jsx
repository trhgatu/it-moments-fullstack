import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaRegClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from './EventItem.module.scss';

const EventItem = ({ title, description, date, imageUrl, slug, category }) => {
    const navigate = useNavigate();

    const handleEventItemClick = () => {
        navigate(`/posts/${category}/${slug}`);
    };

    return (
        <motion.div
            className={`${styles.eventItem} flex items-start mb-6`}
            onClick={handleEventItemClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Hình ảnh bên trái */}
            <div className={`${styles.eventImage} relative w-1/3 overflow-hidden rounded-lg shadow-lg`}>
                <motion.img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    loading="lazy"
                />
                <div className={styles.overlay}></div>
            </div>

            {/* Nội dung bên phải */}
            <div className="w-2/3 pl-4 flex flex-col justify-between">
                <div className="flex items-center text-gray-500 text-sm mb-1">
                    <FaRegClock className="mr-1" /> {date}
                </div>

                {/* Tiêu đề với thiết kế viền và hiệu ứng hover */}
                <motion.h3
                    className={`${styles.eventTitle} mb-2`}
                    whileHover={{ color: '#1e90ff' }}
                    transition={{ duration: 0.3 }}
                >
                    {title}
                </motion.h3>

                {/* Mô tả với thiết kế tinh tế và hiệu ứng xuất hiện */}
                <motion.p
                    className={`${styles.eventDescription} mb-4 line-clamp-3`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {description}
                </motion.p>

                {/* Nút icon thay thế cho "Read More" */}
                <motion.div
                    className={`${styles.iconButton} flex items-center justify-center`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaArrowRight className="text-white" />
                </motion.div>
            </div>
        </motion.div>
    );
};

EventItem.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
};

export default EventItem;
