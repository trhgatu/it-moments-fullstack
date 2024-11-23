import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { API_URL } from '../../config/config';

const Category = ({ onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/post-categories`);
                const data = await response.json();
                if (data.success) {
                    setCategories(data.data.categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categorySlug, categoryTitle, parentCategorySlug = null) => {
        // Truyền thêm parentCategorySlug khi có danh mục con
        onCategoryChange(categorySlug, categoryTitle, parentCategorySlug);
    };

    const toggleSubcategories = (categoryId) => {
        setActiveCategory(activeCategory === categoryId ? null : categoryId);  // Chuyển đổi mở/đóng danh mục con
    };

    const renderSubcategories = (parentId, parentSlug) => {
        return categories
            .filter((category) => category.parent_id === parentId)
            .map((category) => (
                <div key={category._id} className="mt-2">
                    <button
                        onClick={() => handleCategoryClick(category.slug, category.title, parentSlug)}  // Truyền cả slug và title của cha
                        className="text-gray-700 hover:text-blue-600 hover:underline transition-all duration-300 focus:outline-none text-lg p-2 rounded-md"
                    >
                        <FaChevronRight className="inline mr-2 text-gray-500" />
                        {category.title}
                    </button>
                </div>
            ));
    };

    const renderCategories = (parentId = "undefined", parentSlug = null) => {
        return categories
            .filter((category) => category.parent_id === parentId)
            .map((category) => (
                <div key={category._id} className="mt-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => handleCategoryClick(category.slug, category.title, parentSlug)}
                            className="text-2xl text-gray-800 hover:text-blue-600 hover:bg-gray-200 p-4 rounded-lg transition-all duration-300 focus:outline-none transform hover:scale-105"
                        >
                            {category.title}
                        </button>
                        {categories.some(subCategory => subCategory.parent_id === category._id) && (
                            <button
                                onClick={() => toggleSubcategories(category._id)}
                                className="ml-2 text-gray-500 hover:text-gray-700 transition-all duration-200"
                            >
                                <FaChevronDown />
                            </button>
                        )}
                    </div>

                    <div
                        style={{
                            maxHeight: activeCategory === category._id ? '500px' : '0px',
                            overflow: 'hidden',
                        }}
                        className="transition-all duration-300 ease-in-out"
                    >
                        {activeCategory === category._id && renderSubcategories(category._id, category.slug)}
                    </div>
                </div>
            ));
    };

    return (
        <div className="w-112 mx-auto font-sans">
            <h3 className="text-3xl font-semibold mb-8 text-gray-800">Danh mục</h3>
            <div className="border border-gray-300 rounded-lg p-8 bg-white shadow-lg">
                {renderCategories("67134482580ad1dc01c9a120")}  {/* Sử dụng ID cha mặc định */}
            </div>
        </div>
    );
};

export default Category;
