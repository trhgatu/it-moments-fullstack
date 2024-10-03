import React, { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const Pagination = ({ totalPages }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex justify-center items-center gap-4 py-4">
            {/* Mũi tên "Trước" */}
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`text-blue-500 hover:bg-blue-100 p-2 rounded-full transition-all ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
            >
                <FaAngleLeft size={20} />
            </button>

            {/* Các số trang */}
            {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                    <div
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`cursor-pointer p-3 rounded-lg transition-all text-lg ${
                            currentPage === page
                                ? 'bg-blue-500 text-white font-bold shadow-md'
                                : 'text-gray-500 hover:bg-gray-100 hover:shadow-md'
                        }`}
                        style={{ minWidth: '40px', textAlign: 'center', margin: '0 8px' }}
                    >
                        {page < 10 ? `0${page}` : page}
                    </div>
                );
            })}

            {/* Mũi tên "Tiếp" */}
            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`text-blue-500 hover:bg-blue-100 p-2 rounded-full transition-all ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
            >
                <FaAngleRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
