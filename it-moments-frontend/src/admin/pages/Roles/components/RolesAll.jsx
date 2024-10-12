import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Typography, Alert } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { getCookie } from '../../../../admin/components/PrivateRoutes';
const { Title } = Typography;

// Hàm fetch dữ liệu roles từ API
const fetchRolesData = async () => {
    const token = getCookie('token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
    };
    try {
        const response = await axios.get('http://localhost:3000/api/v1/admin/roles', config);
        return response.data;
    } catch(error) {
        throw new Error('Failed to fetch roles data');
    }
};

function RolesAll() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchRolesData();
                if(data?.records) {
                    setRoles(data.records);
                } else {
                    throw new Error('Invalid data format');
                }
            } catch(error) {
                console.error('Error fetching roles:', error);
                setError('Cannot retrieve roles data.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const handleDeleteRole = (roleId) => {
        // Logic để xóa nhóm quyền
        console.log(`Delete role with ID: ${roleId}`);
    };

    // Định nghĩa cột cho bảng roles
    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Tên nhóm quyền",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Số quyền",
            dataIndex: "permissions",
            key: "permissions",
            render: (permissions) => permissions.length,
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
                        onClick={() => navigate(`/admin/roles/detail/${record._id}`)}
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/roles/edit/${record._id}`)}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteRole(record._id)}
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
                        title="Danh sách nhóm quyền"
                        extra={
                            <Button type="primary" onClick={() => navigate('/admin/roles/create')}>
                                Tạo nhóm quyền
                            </Button>
                        }
                    >
                        {error && <Alert message={error} type="error" showIcon />}
                        <div className="table-responsive">
                            <Table
                                columns={columns}
                                dataSource={roles}
                                loading={loading}
                                rowKey="_id"
                                pagination={false}  // Không cần phân trang
                                className="ant-border-space"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default RolesAll;
