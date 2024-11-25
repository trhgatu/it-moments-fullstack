import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../../config/config';

const Category = ({ onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [activeCategorySlug, setActiveCategorySlug] = useState(null); // Trạng thái lưu slug của category active
    const [activeCategoryId, setActiveCategoryId] = useState(null); // Trạng thái lưu ID của category active
    const navigate = useNavigate();
    const location = useLocation(); // Lấy thông tin từ URL

    useEffect(() => {
        // Fetch categories từ API
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/post-categories`);
                const data = await response.json();
                if(data.success) {
                    setCategories(data.data.categories);
                }
            } catch(error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();

        // Lấy slug danh mục từ URL khi trang tải
        const { pathname } = location;
        const categorySlug = pathname.split('/').pop(); // Lấy slug từ URL

        if(categorySlug) {
            setActiveCategorySlug(categorySlug); // Lưu slug vào state
        }
    }, [location]); // Khi location thay đổi (URL thay đổi), cập nhật lại trạng thái active

    const handleCategoryClick = (categorySlug, categoryTitle) => {
        if(categorySlug !== activeCategorySlug) {
            setActiveCategorySlug(categorySlug); // Cập nhật trạng thái active
            navigate(`/posts/${categorySlug}`, { replace: true }); // Điều hướng mà không thêm vào lịch sử
            onCategoryChange(categorySlug, categoryTitle); // Thông báo tới ActivityList
        }
    };



    const toggleSubcategories = (categoryId) => {
        setActiveCategoryId(activeCategoryId === categoryId ? null : categoryId);
    };

    const renderSubcategories = (parentId, parentTitle) => {
        return categories
            .filter((category) => category.parent_id === parentId)
            .map((category) => (
                <div key={category._id} className="mt-2">
                    <button
                        onClick={() => handleCategoryClick(category.slug, category.title)}
                        className={`text-gray-700 hover:text-blue-600 hover:underline transition-all duration-300 focus:outline-none text-lg p-2 rounded-md ${activeCategorySlug === category.slug ? 'bg-blue-100' : ''
                            }`}
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
                            className={`text-2xl text-gray-800 hover:text-blue-600 hover:bg-gray-200 p-4 rounded-lg transition-all duration-300 focus:outline-none transform hover:scale-105 ${activeCategorySlug === category.slug ? 'bg-blue-100' : ''}`}
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
                            maxHeight: activeCategoryId === category._id ? '500px' : '0px',
                            overflow: 'hidden',
                        }}
                        className="transition-all duration-300 ease-in-out"
                    >
                        {activeCategoryId === category._id && renderSubcategories(category._id, category.slug)}
                    </div>
                </div>
            ));
    };

    return (
        <div className="w-112 mx-auto font-sans">
            <h3 className="text-3xl font-semibold mb-8 text-gray-800">Danh mục</h3>
            <div className="border border-gray-300 rounded-lg p-8 bg-white shadow-lg">
                {renderCategories("67134482580ad1dc01c9a120")} {/* Sử dụng ID cha mặc định */}
            </div>
        </div>
    );
};

export default Category;
