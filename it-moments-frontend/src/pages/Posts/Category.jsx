import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { Badge, Tag, Typography } from 'antd';
import { IoIosArrowDown, IoIosArrowForward} from "react-icons/io";
const Category = ({ onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [activeCategorySlug, setActiveCategorySlug] = useState(null);
    const [rootCategoryId, setRootCategoryId] = useState(null);
    const [openCategories, setOpenCategories] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/post-categories`);
                const data = await response.json();
                if(data.success) {
                    setCategories(data.data.categories);
                    const rootCategory = data.data.categories.find(category => category.title === "Văn nghệ");
                    if(rootCategory) {
                        setRootCategoryId(rootCategory._id);
                    }
                }
            } catch(error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const categorySlugFromURL = location.pathname.split('/')[2];
        setActiveCategorySlug(categorySlugFromURL);
    }, [location]);

    const filterCategoriesByParent = (parentId) => {
        return categories.filter(category => category.parent_id === parentId);
    };

    const handleCategoryClick = (categorySlug, categoryTitle) => {
        if (categorySlug !== activeCategorySlug) {
            setActiveCategorySlug(categorySlug);
            onCategoryChange(categorySlug, categoryTitle);
            setPosts([]);
            setCurrentPage(1);
        }
    };


    const renderSubcategories = (parentId) => {
        const subCategories = filterCategoriesByParent(parentId);

        return subCategories.map((category) => (
            <div className="w-full cursor-pointer" key={category._id}>
                <div className={`flex items-center justify-between p-4 pl-4
                    ${activeCategorySlug === category.slug ? 'bg-blue-100 border-r-4 border-blue-500' : ''}`}>
                    <div className="flex items-center">
                        {filterCategoriesByParent(category._id).length > 0 && (
                            <Tag
                                onClick={() => toggleCategoryOpen(category._id)}
                                className="bg-white px-2 py-1 rounded-full hover:text-blue-500 cursor-pointer">
                                {openCategories[category._id] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                            </Tag>
                        )}
                        <Typography
                            onClick={() => handleCategoryClick(category.slug, category.title)}
                            className="text-lg hover:text-blue-500 ml-2">
                            {category.title}
                        </Typography>
                    </div>
                    <Tag className="rounded-full bg-blue-500 text-white">
                        {category.postCount}
                    </Tag>
                </div>
                {openCategories[category._id] && (
                    <div className="">
                        {renderSubcategories(category._id)}
                    </div>
                )}
            </div>
        ));
    };

    const renderCategories = () => {
        const filteredCategories = filterCategoriesByParent(rootCategoryId);

        return filteredCategories.map((category) => (
            <div key={category._id} className="w-full cursor-pointer">
                <div className={`flex items-center justify-between p-4
                    ${activeCategorySlug === category.slug ? 'bg-blue-100 border-r-4 border-blue-500 transition-all duration-100' : ''}`}>
                    <div className="flex items-center">
                        {filterCategoriesByParent(category._id).length > 0 && (
                            <Tag
                                onClick={() => toggleCategoryOpen(category._id)}
                                className="  hover:text-blue-500 cursor-pointer rounded-full px-2 py-1 ">
                                {openCategories[category._id] ? <IoIosArrowDown className='text-blue-500' /> : <IoIosArrowForward />}
                            </Tag>
                        )}
                        <Typography
                            onClick={() => handleCategoryClick(category.slug, category.title)}
                            className="text-lg hover:text-blue-500 ml-2">
                            {category.title}
                        </Typography>
                    </div>
                    <Tag className='rounded-full bg-blue-500 text-white'>
                        {category.postCount}
                    </Tag>
                </div>
                {openCategories[category._id] && (
                    <div>
                        {renderSubcategories(category._id)}
                    </div>
                )}
            </div>
        ));
    };
    const toggleCategoryOpen = (categoryId) => {
        setOpenCategories(prevState => ({
            ...prevState,
            [categoryId]: !prevState[categoryId]
        }));
    };

    return (
        <div className="container">
            <div className="text-center text-white bg-blue-500 p-4">
                <span className="font-semibold text-3xl">Danh mục</span>
            </div>
            <div className="space-y-4 pt-4 p-4">
                {renderCategories()}
            </div>
        </div>
    );
};

export default Category;
