import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Avatar, Typography, Alert, Modal } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../context/UserContext';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../../config/config'
const { Title } = Typography;

const fetchUsersData = async (currentPage, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
    };

    try {
        const response = await axios.get(`${API_URL}/admin/users?page=${currentPage}`, config);
        return response.data;
    } catch(error) {
        throw new Error('Failed to fetch users data');
    }
};

function UsersAll() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1,
        pageSize: 6,
        limitItems: 10
    });
    const [deletingUserId, setDeletingUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            const token = user?.token;
            if(!token) {
                setError('Token không hợp lệ.');
                setLoading(false);
                return;
            }

            try {
                const data = await fetchUsersData(pagination.currentPage, token);
                if(data?.data?.users) {
                    setUsers(data.data.users);
                    setPagination((prev) => ({
                        ...prev,
                        totalPage: data?.data?.pagination?.totalPage || 1,
                        currentPage: data?.data?.pagination?.currentPage || 1,
                        limitItems: data?.data?.pagination?.limitItems || 10
                    }));
                } else {
                    throw new Error('Invalid data format');
                }
            } catch(error) {
                console.error('Error fetching users:', error);
                setError('Cannot retrieve users data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [pagination.currentPage, user]);

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
    };

    const handleDeleteUser = (userId) => {
        setDeletingUserId(userId);
    };

    const confirmDeleteUser = async () => {
        if(!deletingUserId) return;

        const token = user?.token;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
        };

        try {
            await axios.delete(`http://localhost:3000/api/v1/admin/users/${deletingUserId}`, config);
            message.success('Người dùng đã được xóa thành công.');
            setUsers((prev) => prev.filter(user => user._id !== deletingUserId));
        } catch(error) {
            console.error('Error deleting user:', error);
            message.error('Không thể xóa người dùng.');
        } finally {
            setDeletingUserId(null);
        }
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (pagination.currentPage - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
            render: (fullName) => fullName || 'Chưa có tên',
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) => email || 'Không có email',
        },
        {
            title: "Avatar",
            dataIndex: "avatar",
            key: "avatar",
            render: (avatar) => (
                <Avatar shape="square" size={64} src={avatar} alt="Avatar" />
            ),
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            render: (role) => role ? role.title : 'Người dùng',
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Button
                    type={status === "active" ? "primary" : "default"}
                    style={{ backgroundColor: status === "active" ? "green" : "transparent", borderColor: status === "active" ? "green" : "gray" }}
                >
                    {status === "active" ? "Hoạt động" : "Dừng hoạt động"}
                </Button>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => moment(createdAt).format('DD/MM/YYYY'),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/users/detail/${record._id}`)}
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/users/edit/${record._id}`)}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteUser(record._id)}
                    />
                </>
            ),
        },
    ];

    return (
        <div className="tabled">
            <Row gutter={[24, 0]}>
                <Col xs={24}>
                    <Card
                        bordered={false}
                        className="criclebox tablespace mb-24"
                        title="Danh sách người dùng"
                        extra={
                            <Button type="primary" onClick={() => navigate('/admin/users/create')}>
                                Tạo người dùng
                            </Button>
                        }
                    >
                        {error && <Alert message={error} type="error" showIcon />}
                        <div className="table-responsive">
                            <Table
                                columns={columns}
                                dataSource={users}
                                loading={loading}
                                rowKey="_id"
                                pagination={false}
                                className="ant-border-space"
                            />
                        </div>
                        <Pagination pagination={pagination} onPageChange={handlePageChange} />
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Xác nhận xóa"
                visible={!!deletingUserId}
                onOk={confirmDeleteUser}
                onCancel={() => setDeletingUserId(null)}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
            </Modal>
        </div>
    );
}

export default UsersAll;
