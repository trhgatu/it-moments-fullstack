// src/components/EventItem.js
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import styles from './EventItem.module.scss';

const EventItem = ({ title, description, author, date, imageUrl, slug, category }) => {
    const navigate = useNavigate();

    const handleEventItemClick = () => {
        navigate(`/posts/${category}/${slug}`);
    };

    return (
        <div
            className={`${styles.eventItem} flex bg-white rounded-lg shadow-md overflow-hidden cursor-pointer`}
            onClick={handleEventItemClick}
        >
            {/* Hình ảnh bên trái */}
            <div className={`${styles.eventImage} w-1/3`}>
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            <div className="p-4 flex flex-col justify-between w-2/3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <p className="text-gray-600 mt-2">{description}</p>
                </div>

                <div className="mt-4 text-sm text-gray-500 flex items-center gap-4">
                    <span className="flex items-center">
                        <IoPersonOutline className="mr-1" /> {author}
                    </span>
                    <span className="flex items-center">
                        <FaRegCalendarAlt className="mr-1" /> {date}
                    </span>
                </div>
            </div>
        </div>
    );
};

EventItem.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
};

export default EventItem;
