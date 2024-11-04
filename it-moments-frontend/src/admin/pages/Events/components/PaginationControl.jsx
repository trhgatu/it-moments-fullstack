import React from 'react';
import Pagination from '../../../components/Pagination';

const PaginationControl = ({ pagination, onPageChange }) => {
  return (
    <Pagination pagination={pagination} onPageChange={onPageChange} />
  );
};

export default PaginationControl;
