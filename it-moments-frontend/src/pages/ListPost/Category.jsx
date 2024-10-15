import React, { useState } from 'react';
import { FaBook, FaMusic, FaFilm, FaImage, FaGamepad } from 'react-icons/fa';

const Category = () => {
    const [activeCategory, setActiveCategory] = useState(null);

    const categories = [
        { name: 'Danh mục 1', icon: <FaBook />, count: 12, color: 'text-blue-500', bg: 'bg-blue-500' },
        { name: 'Danh mục 2', icon: <FaMusic />, count: 8, color: 'text-orange-500', bg: 'bg-orange-500' },
        { name: 'Danh mục 3', icon: <FaFilm />, count: 15, color: 'text-purple-500', bg: 'bg-purple-500' },
        { name: 'Danh mục 4', icon: <FaImage />, count: 6, color: 'text-green-500', bg: 'bg-green-500' },
        { name: 'Danh mục 5', icon: <FaGamepad />, count: 20, color: 'text-red-500', bg: 'bg-red-500' }
    ];

    const handleCategoryClick = (index) => {
        setActiveCategory(index);
    };

    return (
        <div className="w-full lg:w-[300px] bg-white p-5 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-center mb-5 text-gray-800">Danh mục</h3>
            <ul className="list-none p-0 m-0">
                {categories.map((category, index) => (
                    <li
                        key={index}
                        className={`flex items-center justify-between p-5 transition-all cursor-pointer gap-4 rounded-lg text-lg ${
                            activeCategory === index
                                ? `${category.bg} text-white shadow-md`
                                : 'bg-gray-50 hover:bg-gray-100 hover:shadow-sm'
                        }`}
                        onClick={() => handleCategoryClick(index)}
                        style={{
                            borderRadius: '12px',
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: activeCategory === index ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
                        }}
                    >
                        <div
                            className={`text-2xl ${
                                activeCategory === index ? 'text-white' : category.color
                            } transition-colors`}
                        >
                            {category.icon}
                        </div>
                        <span
                            className="flex-grow text-left font-medium"
                            style={{
                                fontWeight: activeCategory === index ? 600 : 500
                            }}
                        >
                            {category.name}
                        </span>
                        <span
                            className={`px-4 py-2 text-sm font-semibold transition-all ${
                                activeCategory === index ? `${category.bg} text-white` : 'bg-gray-200 text-gray-700'
                            }`}
                            style={{
                                borderRadius: '16px',
                                transition: 'background-color 0.3s ease-in-out'
                            }}
                        >
                            {category.count}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Category;
