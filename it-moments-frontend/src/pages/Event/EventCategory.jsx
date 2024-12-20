import React, { useState } from 'react';
import { FaRegClock, FaCalendarAlt } from 'react-icons/fa';

const EventCategory = ({ onCategoryChange }) => {
    const [activeCategorySlug, setActiveCategorySlug] = useState(null);

    const handleCategoryClick = (slug) => {
        setActiveCategorySlug(activeCategorySlug === slug ? null : slug);
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-2xl transition duration-300">
            <h3 className="text-4xl font-bold text-gray-800 mb-8 border-b-2 border-gray-200 pb-3 bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text text-center tracking-wide">
                Sự kiện
            </h3>
            <ul className="space-y-8">
                <li>
                    <button
                        onClick={() => {
                            onCategoryChange("ongoing");
                            handleCategoryClick("ongoing");
                        }}
                        className="flex items-center justify-start space-x-6 text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-8 py-5 rounded-lg transition duration-200 group"
                    >
                        <FaRegClock className="text-3xl group-hover:scale-110 transition duration-200" />
                        <span className="text-2xl leading-relaxed">Sự kiện đang diễn ra</span>
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => {
                            onCategoryChange("pending");
                            handleCategoryClick("ongoing");
                        }}
                        className="flex items-center justify-start space-x-6 text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-8 py-5 rounded-lg transition duration-200 group"
                    >
                        <FaRegClock className="text-3xl group-hover:scale-110 transition duration-200" />
                        <span className="text-2xl leading-relaxed">Sự kiện sắp diễn ra</span>
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => {
                            onCategoryChange("completed");
                            handleCategoryClick("completed");
                        }}
                        className="flex items-center justify-start space-x-6 text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-8 py-5 rounded-lg transition duration-200 group"
                    >
                        <FaCalendarAlt className="text-3xl group-hover:scale-110 transition duration-200" />
                        <span className="text-2xl leading-relaxed">Sự kiện đã kết thúc</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default EventCategory;
