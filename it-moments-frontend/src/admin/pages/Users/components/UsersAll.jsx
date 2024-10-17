import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Avatar, Typography, Alert } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../../components/PrivateRoutes';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import axios from 'axios';

const { Title } = Typography;

const fetchUsersData = async (currentPage) => {
    const token = getCookie('token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
    };

    try {
        const response = await axios.get(`http://localhost:3000/api/v1/admin/users?page=${currentPage}`, config);
        return response.data;
    } catch(error) {
        throw new Error('Failed to fetch users data');
    }
};

function UsersAll() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1,
        pageSize: 6,
        limitItems: 10
    });

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchUsersData(pagination.currentPage);
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
    }, [pagination.currentPage]);


    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
    };

    const handleDeleteUser = (userId) => {
        // Logic to delete user
        console.log(`Delete user with ID: ${userId}`);
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
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            render: (phone) => phone || 'N/A',
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
            render: (role) => role ? role.title : 'Không có vai trò',
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
        </div>
    );
}

export default UsersAll;
