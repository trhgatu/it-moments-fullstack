import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight, FaBell, FaListAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { Divider } from 'antd';
const Category = ({ onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [activeCategorySlug, setActiveCategorySlug] = useState(null);
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
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

        const { pathname } = location;
        const categorySlug = pathname.split('/').pop();

        if(categorySlug) {
            setActiveCategorySlug(categorySlug);
        }
    }, [location]);

    const handleCategoryClick = (categorySlug, categoryTitle) => {
        if(categorySlug !== activeCategorySlug) {
            setActiveCategorySlug(categorySlug);
            navigate(`/posts/${categorySlug}`, { replace: true });
            onCategoryChange(categorySlug, categoryTitle);
        }
    };

    const toggleSubcategories = (categoryId) => {
        setActiveCategoryId(activeCategoryId === categoryId ? null : categoryId);
    };

    const renderSubcategories = (parentId) => {
        return categories
            .filter((category) => category.parent_id === parentId)
            .map((category) => (
                <div key={category._id} className="mt-2 ml-4">
                    <button
                        onClick={() => handleCategoryClick(category.slug, category.title)}
                        className={` hover:underline transition-all duration-300 focus:outline-none p-2
                            ${activeCategorySlug === category.slug ? 'border-r-4 border-blue-500' : ''}`}
                    >
                        <FaChevronRight className="inline mr-2 text-gray-500" />
                        {category.title}
                    </button>
                </div>
            ));
    };

    const renderCategories = (parentId = "undefined") => {
        return categories
            .filter((category) => category.parent_id === parentId)
            .map((category) => (
                <div key={category._id} className="mt-4">
                    <div className={`flex items-center justify-between px-4  cursor-pointer
                         ${activeCategorySlug === category.slug ? 'border-l-4 border-blue-500' : ''}`}>

                        <button
                            onClick={() => handleCategoryClick(category.slug, category.title)}
                            className={`text-2xl hover:underline p-4  transition-all duration-300 focus:outline-none transform  `}
                        >
                            {category.title}
                        </button>
                        {categories.some(subCategory => subCategory.parent_id === category._id) && (
                            <button
                                onClick={() => toggleSubcategories(category._id)}
                                className="ml-4 hover:text-gray-700 transition-all duration-200"
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
                        {activeCategoryId === category._id && renderSubcategories(category._id)}
                    </div>
                </div>
            ));
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-3 rounded-t-lg  transition-shadow duration-200">
                <div className="flex items-center space-x-2">
                    <FaListAlt className="text-white text-2xl" />
                    <span className=" font-semibold text-white">Danh mục</span>
                </div>
            </div>
            <div>
                {renderCategories("674c4f7d56dc65932a0268cd")}
            </div>
        </div>
    );
};

export default Category;
