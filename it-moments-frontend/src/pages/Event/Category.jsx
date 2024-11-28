import React, { useState } from 'react';
import { FaRegClock, FaCalendarAlt } from 'react-icons/fa';

const Category = ({ onCategoryChange }) => {
    const [activeCategorySlug, setActiveCategorySlug] = useState(null); // Trạng thái để theo dõi danh mục đang mở

    const handleCategoryClick = (slug) => {
        setActiveCategorySlug(activeCategorySlug === slug ? null : slug); // Toggle dropdown khi click
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-2xl transition duration-300">
            {/* Tiêu đề */}
            <h3 className="text-4xl font-bold text-gray-800 mb-8 border-b-2 border-gray-200 pb-3 bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text text-center tracking-wide">
                Sự kiện
            </h3>

            {/* Danh mục nút */}
            <ul className="space-y-8">
                {/* Nút 1 */}
                <li>
                    <button
                        onClick={() => {
                            onCategoryChange("ongoing");
                            handleCategoryClick("ongoing"); // Toggle dropdown
                        }}
                        className="flex items-center justify-start space-x-6 text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-8 py-5 rounded-lg transition duration-200 group"
                    >
                        <FaRegClock className="text-3xl group-hover:scale-110 transition duration-200" />
                        <span className="text-2xl leading-relaxed">Sự kiện đang diễn ra</span>
                    </button>

                    {/* Dropdown danh mục con */}
                    {activeCategorySlug === "ongoing" && (
                        <ul className="pl-8 mt-4 space-y-4">
                            <li>
                                <button
                                    onClick={() => onCategoryChange("ongoing-subcategory-1")}
                                    className="text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-8 py-3 rounded-lg transition duration-200"
                                >
                                    Subcategory 1
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onCategoryChange("ongoing-subcategory-2")}
                                    className="text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-8 py-3 rounded-lg transition duration-200"
                                >
                                    Subcategory 2
                                </button>
                            </li>
                        </ul>
                    )}
                </li>

                {/* Nút 2 */}
                <li>
                    <button
                        onClick={() => {
                            onCategoryChange("upcoming");
                            handleCategoryClick("upcoming"); // Toggle dropdown
                        }}
                        className="flex items-center justify-start space-x-6 text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-8 py-5 rounded-lg transition duration-200 group"
                    >
                        <FaCalendarAlt className="text-3xl group-hover:scale-110 transition duration-200" />
                        <span className="text-2xl leading-relaxed">Sự kiện đã kết thúc</span>
                    </button>

                    {/* Dropdown danh mục con */}
                    {activeCategorySlug === "upcoming" && (
                        <ul className="pl-8 mt-4 space-y-4">
                            <li>
                                <button
                                    onClick={() => onCategoryChange("upcoming-subcategory-1")}
                                    className="text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-8 py-3 rounded-lg transition duration-200"
                                >
                                    Subcategory 1
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onCategoryChange("upcoming-subcategory-2")}
                                    className="text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-8 py-3 rounded-lg transition duration-200"
                                >
                                    Subcategory 2
                                </button>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Category;
