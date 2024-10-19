import React, { useState } from 'react';
import styles from './Pagination.module.scss';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';  // Import icon mũi tên

const Pagination = ({ totalPages }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.pagination}>
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.navButton}
            >
                <FaAngleLeft /> {/* Icon mũi tên trái */}
            </button>
            {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                    <div
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={currentPage === page ? styles.activePage : styles.pageItem}
                    >
                        {page < 10 ? `0${page}` : page} {/* Hiển thị số định dạng 01, 02, 03 */}
                    </div>
                );
            })}
            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.navButton}
            >
                <FaAngleRight /> {/* Icon mũi tên phải */}
            </button>
        </div>
    );
};

export default Pagination;
