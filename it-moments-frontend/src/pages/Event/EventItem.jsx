import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaRegClock } from 'react-icons/fa';
import { Tag } from 'antd';

const EventItem = ({ title, description, date, imageUrl, slug, category, eventStatus }) => {
    const navigate = useNavigate();

    const handleEventItemClick = () => {
        navigate(`/posts/${category}/${slug}`);
    };

    return (
        <div
            className=" flex items-start mb-6 cursor-pointer transition-all duration-300 group bg-white hover:bg-gray-300 rounded-lg p-4"
            onClick={handleEventItemClick}
        >
            <div className="relative w-1/3 h-60 overflow-hidden rounded-lg shadow-md">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300"
                    loading="lazy"
                />

            </div>
            <div className="w-2/3 pl-4 flex flex-col justify-between">
                <div className="flex items-center text-gray-500 text-sm mb-4 justify-between">
                    <span className="flex items-center">
                        <FaRegClock className="mr-1" /> {date}
                    </span>
                    <Tag
                        color={
                            eventStatus === "completed"
                                ? "red"
                                : eventStatus === "pending"
                                    ? "blue"
                                    : "green"
                        }
                        className="text-lg py-2 px-4"
                    >
                        {eventStatus === "completed"
                            ? "Sự kiện đã kết thúc"
                            : eventStatus === "pending"
                                ? "Đang chờ"
                                : "Đang diễn ra"}
                    </Tag>
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
