import React from 'react';
import { Card, Button, Radio } from "antd";
import EventsTable from './EventsTable'; // Giả sử bạn đã tạo một component EventsTable tương tự như PostsTable
import EventsActions from './EventsActions'; // Có thể là component để xử lý các hành động nhóm cho sự kiện
import PaginationControl from './PaginationControl'; // Giả sử bạn cũng đã có component này cho phân trang

const EventsCard = ({
  events,
  loading,
  error,
  selectedRowKeys,
  handleSelectChange,
  handleDeleteConfirm,
  navigate,
  pagination,
  actionType,
  setActionType,
  handleActionSubmit,
  handlePageChange,
  filterValue,          // Nhận giá trị bộ lọc từ props
  setFilterValue,      // Nhận hàm cập nhật giá trị bộ lọc từ props
}) => {
  // Hàm để lọc sự kiện theo trạng thái
  const filteredEvents = events.filter(event => {
    if (filterValue === '') return true; // Nếu không có bộ lọc, trả tất cả sự kiện
    return event.status === filterValue; // Chỉ trả sự kiện có trạng thái tương ứng
  });

  return (
    <Card
      bordered={false}
      className="criclebox tablespace mb-24"
      title="Danh sách sự kiện"
      extra={
        <div>
          <Button type="primary" onClick={() => navigate('/admin/events/create')}>
            Tạo sự kiện
          </Button>
          <Radio.Group value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
            <Radio.Button value="">Tất cả</Radio.Button>
            <Radio.Button value="active">Hoạt động</Radio.Button>
            <Radio.Button value="inactive">Dừng hoạt động</Radio.Button>
          </Radio.Group>
        </div>
      }
    >
      <EventsActions
        error={error}
        actionType={actionType}
        setActionType={setActionType}
        selectedRowKeys={selectedRowKeys}
        handleActionSubmit={handleActionSubmit}
      />
      <div className="table-responsive">
        <EventsTable
          events={filteredEvents} // Sử dụng sự kiện đã lọc
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          handleSelectChange={handleSelectChange}
          handleDeleteConfirm={handleDeleteConfirm}
          navigate={navigate}
          pagination={pagination}
        />
      </div>
      <PaginationControl
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </Card>
  );
};

export default EventsCard;
