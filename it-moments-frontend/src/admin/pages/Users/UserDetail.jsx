import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Typography, Alert, Row, Col, Divider, Spin, Tag } from "antd";
import axios from 'axios';
import moment from 'moment';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';

const { Title, Text } = Typography;

const fetchUserData = async (id, token) => {
    const userResponse = await axios.get(`${API_URL}/admin/users/detail/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true
    });
    return userResponse;
};

function UserDetail() {
    const { user } = useUser();
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = user?.token;
        if(!token) {
            setError('Không tìm thấy token.');
            return;
        }
        setLoading(true);
        setError(null);

        fetchUserData(id, token)
            .then(userResponse => {
                if(userResponse.data?.success) {
                    setUserData(userResponse.data.data);
                } else {
                    throw new Error(userResponse.data.message || 'Failed to fetch user data');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(`Unable to retrieve data: ${error.message}`);
            })
            .finally(() => setLoading(false));
    }, [id, user]);

    if(loading) return <Spin tip="Loading..." />;
    if(error) return <Alert message={error} type="error" showIcon />;
    if(!userData) return <Alert message="User not found." type="warning" showIcon />;

    const {
        fullName,
        avatar,
        email,
        bio,
        socialLinks,
        isAdmin,
        status,
        isVerified,
        createdAt,
        role
    } = userData;

    return (
        <div style={{ padding: '20px', background: '#f0f2f5' }}>
            <Card
                title={<Title level={2}>{fullName}</Title>}
                bordered={false}
                style={{ marginBottom: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={8} md={6}>
                        <Avatar size={128} src={avatar} alt="User Avatar" />
                    </Col>
                    <Col xs={24} sm={16} md={18}>
                        <div className="mb-4">
                            <Text strong>Email:</Text> <Text>{email}</Text>
                        </div>
                        <div className="mb-4">
                            <Text strong>Trạng thái:</Text>
                            <Tag className='ml-2' color={status === 'active' ? 'green' : 'red'}>
                                {status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
                            </Tag>
                        </div>
                        <div className="mb-4">
                            <Text strong>Xác minh:</Text>
                            <Tag className='ml-2' color={isVerified ? 'blue' : 'orange'}>
                                {isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                            </Tag>
                        </div>
                        <div className="mb-4">
                            <Text strong>Vai trò:</Text>
                            <Tag className='ml-2' color={isAdmin ? 'volcano' : 'cyan'}>
                                {isAdmin ? 'Admin' : 'Người dùng'}
                            </Tag>
                        </div>
                        <div className="mb-4">
                            <Text strong>Ngày tạo:</Text> <Text>{moment(createdAt).format('DD/MM/YYYY')}</Text>
                        </div>
                    </Col>

                </Row>

                <Divider />

                <Row gutter={16}>
                    <Col xs={24}>
                        <Text strong>Tiểu sử:</Text>
                        <Text style={{ marginLeft: '10px', color: '#595959' }}>{bio || 'Không có tiểu sử'}</Text>
                    </Col>
                </Row>

                <Divider />

                <div>
                    <Text strong>Liên kết mạng xã hội:</Text>
                    <div style={{ marginTop: '10px' }}>
                        {Object.entries(socialLinks).map(([platform, link]) => (
                            link ? (
                                <div key={platform}>
                                    <Text strong>{platform}:</Text>{' '}
                                    <a href={link} target="_blank" rel="noopener noreferrer">
                                        {link}
                                    </a>
                                </div>
                            ) : null
                        ))}
                    </div>
                </div>

                <Divider />

                {role && (
                    <div>
                        <Text strong>Vai trò chi tiết:</Text>
                        <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                            <Text strong>Tên vai trò:</Text> <Text>{role.title}</Text>
                            <br />
                            <Text strong>Mô tả:</Text> <Text>{role.description}</Text>
                            <br />
                            <Text strong>Quyền hạn:</Text>
                            <ul>
                                {role.permissions.map((permission, index) => (
                                    <li key={index}>
                                        <Text>{permission}</Text>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default UserDetail;
