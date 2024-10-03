import React, { useState } from 'react';
import styles from './Filter.module.scss';
import { FaFilter } from 'react-icons/fa';

const Filter = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        console.log("Bạn đã chọn:", selectedValue);
        setIsOpen(false);  // Đóng dropdown sau khi chọn
    };

    return (
        <div className={styles.filterContainer}>
            <button onClick={toggleDropdown} className={styles.filterButton}>
                <FaFilter /> Bộ lọc
            </button>
            {isOpen && (
                <div className={styles.dropdown}>
                    <select className={styles.dropdownSelect} onChange={handleChange}>
                        <option value="all">Tất cả</option>
                        <option value="recent">Mới nhất</option>
                        <option value="popular">Phổ biến</option>
                        <option value="viewed">Được xem nhiều nhất</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default Filter;
