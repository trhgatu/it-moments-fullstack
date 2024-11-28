import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaRegClock } from 'react-icons/fa';

const EventItem = ({ title, description, date, imageUrl, slug, category }) => {
    const navigate = useNavigate();

    const handleEventItemClick = () => {
        navigate(`/posts/${category}/${slug}`);
    };

    return (
        <div
            className="w-full flex items-start mb-6 cursor-pointer transition-all duration-300 group bg-gray-100 hover:bg-gray-300 rounded-lg p-4"
            onClick={handleEventItemClick}
        >
            <div className="relative w-1/3 h-72 overflow-hidden rounded-lg shadow-md">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 hover:bg-opacity-30"></div>
            </div>
            <div className="w-2/3 pl-4 flex flex-col justify-between">
                <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaRegClock className="mr-1" /> {date}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-500">
                    {title}
                </h3>

                <p className=" line-clamp-2 mb-4">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: description,
                        }}
                    />
                </p>
            </div>
        </div>
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
