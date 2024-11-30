import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Alert, Row, Col, Divider, Spin, List, Avatar } from "antd";
import axios from 'axios';
import moment from 'moment';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';

const { Title, Text } = Typography;

const fetchEventDetail = async (id, token) => {
    const response = await axios.get(`${API_URL}/admin/events/detail/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true
    });
    return response;
};

const EventDetail = () => {
    const { user } = useUser();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = user?.token;
        if (!token) {
            setError('Không tìm thấy token.');
            return;
        }
        setLoading(true);
        setError(null);

        fetchEventDetail(id, token)
            .then(response => {
                if (response.data?.success) {
                    setEvent(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch event data');
                }
            })
            .catch(error => {
                console.error('Error fetching event data:', error);
                setError(`Unable to retrieve data: ${error.message}`);
            })
            .finally(() => setLoading(false));
    }, [id, user]);

    if (loading) return <Spin tip="Loading..." />;
    if (error) return <Alert message={error} type="error" showIcon />;
    if (!event) return <Alert message="Event not found." type="warning" showIcon />;

    const {
        event: eventDetail,
        totalVotes,
        posts
    } = event;
    const {
        title,
        description,
        location,
        startTime,
        endTime,
        votingStartTime,
        votingEndTime,
        votingStatus,
        status,
        createdAt,
        updatedAt
    } = eventDetail;

    return (
        <div style={{ padding: '20px', background: '#f0f2f5' }}>
            <Card
                title={<Title level={2}>{title}</Title>}
                bordered={false}
                style={{ marginBottom: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Thời gian bắt đầu:</Text>
                        <br />
                        <Text>{moment(startTime).format('DD/MM/YYYY HH:mm')}</Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Thời gian kết thúc:</Text>
                        <br />
                        <Text>{moment(endTime).format('DD/MM/YYYY HH:mm')}</Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Địa điểm:</Text>
                        <br />
                        <Text>{location}</Text>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Trạng thái:</Text>
                        <br />
                        <Text style={{ color: status === 'completed' ? '#52c41a' : '#f5222d' }}>
                            {status === 'completed' ? 'Hoàn thành' : 'Đang diễn ra'}
                        </Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Thời gian bỏ phiếu bắt đầu:</Text>
                        <br />
                        <Text>{moment(votingStartTime).format('DD/MM/YYYY HH:mm')}</Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Thời gian bỏ phiếu kết thúc:</Text>
                        <br />
                        <Text>{moment(votingEndTime).format('DD/MM/YYYY HH:mm')}</Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Tổng số phiếu:</Text>
                        <br />
                        <Text>{totalVotes}</Text>
                    </Col>
                </Row>

                <Divider />

                <div>
                    <Text strong>Mô tả:</Text>
                    <div style={{ marginTop: '10px', color: '#595959' }}>{description}</div>
                </div>

                <Divider />

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Text strong>Trạng thái bỏ phiếu:</Text>
                        <br />
                        <Text>{votingStatus === 'closed' ? 'Đã đóng' : 'Đang mở'}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Ngày tạo:</Text>
                        <br />
                        <Text>{moment(createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Cập nhật lần cuối:</Text>
                        <br />
                        <Text>{moment(updatedAt).format('DD/MM/YYYY HH:mm')}</Text>
                    </Col>
                </Row>
            </Card>

            <Divider />

            <Card
                title={<Title level={4}>Danh sách bài viết liên quan</Title>}
                bordered={false}
            >
                <List
                    itemLayout="vertical"
                    dataSource={posts}
                    renderItem={post => (
                        <List.Item
                            key={post._id}
                            extra={
                                <img
                                    width={272}
                                    alt="thumbnail"
                                    src={post.thumbnail}
                                />
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src="https://via.placeholder.com/150" />}
                                title={<a href={`/posts/${post.post_category_id.slug}/${post.slug}`}>{post.title}</a>}
                                description={`Views: ${post.views} - Votes: ${post.votes}`}
                            />
                            <div dangerouslySetInnerHTML={{ __html: post.description }} />

                            {/* Hiển thị danh sách người vote */}
                            {post.voterDetails && post.voterDetails.length > 0 && (
                                <div style={{ marginTop: '10px' }}>
                                    <Text strong>Người đã bình chọn:</Text>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={post.voterDetails}
                                        renderItem={voter => (
                                            <List.Item key={voter._id}>
                                                <List.Item.Meta
                                                    avatar={<Avatar src="https://via.placeholder.com/150" />}
                                                    title={voter.fullName}
                                                    description={`Email: ${voter.email}`}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )}
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default EventDetail;
