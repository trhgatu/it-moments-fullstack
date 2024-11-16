import React from 'react';
import styles from './Pagination.module.scss';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const navigate = useNavigate();

    // Hàm xử lý khi người dùng nhấn vào một trang cụ thể
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            // Cập nhật URL khi người dùng nhấn vào một trang mới
            navigate(`?page=${page}`);
            onPageChange(page);  // Cập nhật trang hiện tại
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    return (
        <div className={styles.pagination}>
            {/* Nút quay lại trang trước */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.navButton}
            >
                <FaAngleLeft />
            </button>

            {/* Các số trang */}
            {renderPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? styles.activePage : styles.pageItem}
                    disabled={currentPage === page} // Vô hiệu hóa nút của trang hiện tại
                >
                    {page}
                </button>
            ))}

            {/* Nút chuyển tới trang tiếp theo */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.navButton}
            >
                <FaAngleRight />
            </button>
        </div>
    );
};

export default Pagination;
