import React from 'react';
import Pagination from '../../../components/Pagination'; // Assuming this is a custom pagination component

const PaginationControl = ({ pagination, onPageChange }) => {
  return (
    <Pagination pagination={pagination} onPageChange={onPageChange} />
  );
};

export default PaginationControl;
