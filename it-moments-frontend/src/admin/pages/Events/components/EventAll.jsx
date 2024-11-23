import React, { useState, useEffect } from 'react';
import { Row, Col, notification, Modal, Spin } from "antd";
import EventsCard from './EventsCard';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../context/UserContext';
import { API_URL } from '../../../../config/config';
import axios from 'axios';

function EventAll() {
    const { user, loading: userLoading } = useUser();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [actionType, setActionType] = useState('');
    const [filterValue, setFilterValue] = useState('');

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1,
        pageSize: 6,
        limitItems: 10,
    });

    const showNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
            duration: 5,
            placement: 'topRight',
        });
    };

    const getToken = () => {
        const token = user?.token;
        if (!token) {
            setError('Token không hợp lệ.');
            return null;
        }
        return token;
    };

    const fetchEvents = async () => {
        setLoadingEvents(true);
        setError(null);
        const token = getToken();
        if (!token) {
            setLoadingEvents(false);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/admin/events?page=${pagination.currentPage}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true,
            });

            const data = response.data;
            if (!data?.data?.events) {
                throw new Error('Invalid data format');
            }

            setEvents(data.data.events);
            setPagination((prev) => ({
                ...prev,
                totalPage: data.data.pagination.totalPage || 1,
                currentPage: data.data.pagination.currentPage,
                limitItems: data.data.pagination.limitItems || 10
            }));
        } catch (error) {
            console.error('Error fetching API:', error);
            setError('Unable to fetch event data.');
            showNotification('error', 'Lỗi', 'Không thể lấy dữ liệu sự kiện.');
        } finally {
            setLoadingEvents(false);
        }
    };

    useEffect(() => {
        if (!userLoading && user) {
            fetchEvents();
        }
    }, [pagination.currentPage, userLoading, user]);

    const filteredEvents = events.filter(event => {
        if (filterValue === '') return true;
        return event.status === filterValue;
    });

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
    };

    const handleSelectChange = (selectedKeys) => {
        setSelectedRowKeys(selectedKeys);
    };

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;

        if (selectedRowKeys.length === 0) {
            setError('Vui lòng chọn ít nhất một sự kiện.');
            return;
        }

        if (!actionType) {
            setError('Vui lòng chọn loại hành động.');
            return;
        }

        try {
            await axios.patch(`${API_URL}/admin/events/change-status-multi`, {
                ids: selectedRowKeys,
                key: 'status',
                value: actionType
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            setSelectedRowKeys([]);
            setActionType('');
            await fetchEvents();

            showNotification('success', 'Thành công!', `${selectedRowKeys.length} sự kiện đã được thay đổi trạng thái thành công.`);
        } catch (error) {
            console.error('Error performing batch action:', error);
            setError('Unable to perform the action.');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        const token = getToken();
        if (!token) return;

        try {
            await axios.delete(`${API_URL}/admin/events/delete/${eventId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            showNotification('success', 'Thành công!', 'Sự kiện đã được xóa thành công.');
            await fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('Không thể xóa sự kiện.');
        }
    };

    const handleDeleteConfirm = (eventId) => {
        Modal.confirm({
            title: 'Xác nhận xóa sự kiện',
            content: 'Bạn có chắc chắn muốn xóa sự kiện này không?.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => handleDeleteEvent(eventId),
        });
    };

    return (
        <div className="tabled">
            <Row gutter={[24, 0]}>
                <Col xs="24" xl={24}>
                    {loadingEvents || userLoading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Spin tip="Đang tải dữ liệu..." />
                        </div>
                    ) : (
                        <EventsCard
                            events={filteredEvents}
                            loading={loadingEvents}
                            error={error}
                            selectedRowKeys={selectedRowKeys}
                            handleSelectChange={handleSelectChange}
                            handleDeleteConfirm={handleDeleteConfirm}
                            navigate={navigate}
                            pagination={pagination}
                            actionType={actionType}
                            setActionType={setActionType}
                            handleActionSubmit={handleActionSubmit}
                            handlePageChange={handlePageChange}
                            filterValue={filterValue}
                            setFilterValue={setFilterValue}
                        />
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default EventAll;
