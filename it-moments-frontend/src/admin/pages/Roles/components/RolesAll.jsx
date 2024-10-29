import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Table, Button, Typography, Alert, Modal, message } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { useUser } from '../../../../context/UserContext';
import { API_URL } from '../../../../config/config';
const { Title } = Typography;

const fetchRolesData = async (token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
    };
    try {
        const response = await axios.get(`${API_URL}/admin/roles`, config);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch roles data');
    }
};

function RolesAll() {
    const { user } = useUser();
    const token = user?.token;
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deletingRoleId, setDeletingRoleId] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchRolesData(token);
                if (data?.records) {
                    setRoles(data.records);
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
                setError('Cannot retrieve roles data.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchRoles();
        }
    }, [token]);

    const handleDeleteRole = (roleId) => {
        setDeletingRoleId(roleId);
    };

    const confirmDeleteRole = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
        };

        try {
            await axios.delete(`http://localhost:3000/api/v1/admin/roles/${deletingRoleId}`, config);
            message.success('Nhóm quyền đã được xóa thành công.');
            setRoles((prev) => prev.filter(role => role._id !== deletingRoleId));
        } catch (error) {
            console.error('Error deleting role:', error);
            message.error('Không thể xóa nhóm quyền.');
        } finally {
            setDeletingRoleId(null);
        }
    };

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
                                pagination={false} // Không cần phân trang
                                className="ant-border-space"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Xóa nhóm quyền"
                visible={!!deletingRoleId}
                onOk={confirmDeleteRole}
                onCancel={() => setDeletingRoleId(null)}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa nhóm quyền này không?</p>
            </Modal>
        </div>
    );
}

export default RolesAll;
