import React, { useState } from 'react';
import styles from './Category.module.scss';
import { FaBook, FaMusic, FaFilm, FaImage, FaGamepad } from 'react-icons/fa';

const Category = () => {
    const [activeCategory, setActiveCategory] = useState(null);

    const categories = [
        { name: 'Danh mục 1', icon: <FaBook />, count: 12 },
        { name: 'Danh mục 2', icon: <FaMusic />, count: 8 },
        { name: 'Danh mục 3', icon: <FaFilm />, count: 15 },
        { name: 'Danh mục 4', icon: <FaImage />, count: 6 },
        { name: 'Danh mục 5', icon: <FaGamepad />, count: 20 }
    ];

    const handleCategoryClick = (index) => {
        setActiveCategory(index);
    };

    return (
        <div className={styles.category}>
            <h3>Danh mục</h3>
            <ul>
                {categories.map((category, index) => (
                    <li
                        key={index}
                        className={`${styles.categoryItem} ${activeCategory === index ? styles.active : ''}`}
                        onClick={() => handleCategoryClick(index)}
                    >
                        <div className={styles.categoryIcon}>{category.icon}</div>
                        <span className={styles.categoryText}>{category.name}</span>
                        <span className={styles.categoryCount}>{category.count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Category;
