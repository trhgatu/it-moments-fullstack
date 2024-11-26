import React from 'react';
import { Pagination as AntPagination } from 'antd';

function Pagination({ pagination, onPageChange }) {
    const totalItems = pagination.totalPage * pagination.limitItems;
    const currentPage = pagination.currentPage;
    const pageSize = pagination.limitItems;

    return (
        <div className='py-8 flex justify-center'>
            <AntPagination
                current={currentPage}
                total={totalItems}
                pageSize={pageSize}
                onChange={onPageChange}
                showSizeChanger={false}
            />
        </div>

    );
}

export default Pagination;
