import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Typography, Alert, Image, Row, Col,Tag, Divider, Spin } from "antd";
import axios from 'axios';
import moment from 'moment';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';

const { Title, Text } = Typography;

const fetchData = async (id, token) => {
    const postResponse = await axios.get(`${API_URL}/admin/posts/detail/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true
    });
    return postResponse;
};

function PostDetail() {
    const { user } = useUser();
    const { id } = useParams();
    const [post, setPost] = useState(null);
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

        fetchData(id, token)
            .then(postResponse => {
                if(postResponse.data?.success) {
                    setPost(postResponse.data.data);
                } else {
                    throw new Error(postResponse.data.message || 'Failed to fetch post data');
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
    if(!post) return <Alert message="Post not found." type="warning" showIcon />;

    const { title, description, thumbnail, video, status, images, createdAt, position, post_category_id, event_id } = post;

    return (
        <div style={{ padding: '20px', background: '#f0f2f5' }}>
            <Card
                title={<Title level={2}>{title}</Title>}
                bordered={false}
                style={{ marginBottom: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    <Avatar shape="square" size={300} src={thumbnail} alt="Thumbnail" style={{ marginBottom: '15px' }} />
                    <div style={{ textAlign: 'center' }}>
                        <Text strong>Mô tả:</Text>
                        <div
                            dangerouslySetInnerHTML={{ __html: description }}
                            style={{ marginTop: '10px', color: '#595959', textAlign: 'justify' }}
                        />
                    </div>
                </div>

                <Divider />

                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Vị trí:</Text> <Text>{position}</Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Trạng thái:</Text>
                        <Text style={{ color: status === 'active' ? '#52c41a' : '#f5222d', marginLeft: '10px' }}>
                            {status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
                        </Text>
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                        <Text strong>Ngày tạo:</Text> <Text>{moment(createdAt).format('DD/MM/YYYY')}</Text>
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                        <Text strong>Lượt xem:</Text> <Text>{post.views}</Text>
                    </Col>

                </Row>

                <Divider />

                <Row gutter={16}>
                    <Col xs={24}>
                        <Text strong>Danh mục:</Text>
                        <Tag color='blue' style={{ marginLeft: '10px' }}>
                            {post_category_id?.title ? post_category_id.title : 'Không có danh mục'}
                        </Tag>
                        <Text strong>Sự kiện:</Text>
                        <Tag color='green' style={{ marginLeft: '10px' }}>
                            {event_id?.title ? event_id.title : 'Không có sự kiện'}
                        </Tag>
                    </Col>
                </Row>

                <Divider />
                {event_id && (
                    <div>
                        <Text strong>Sự kiện:</Text>
                        <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                            <Text strong>Tên sự kiện:</Text> <Text>{event_id.title}</Text>
                            <br />
                            <Text strong>Mô tả:</Text> <Text>{event_id.description}</Text>
                            <br />
                            <Text strong>Thời gian bắt đầu:</Text> <Text>{moment(event_id.start_time).format('DD/MM/YYYY HH:mm')}</Text>
                            <br />
                            <Text strong>Thời gian kết thúc:</Text> <Text>{moment(event_id.end_time).format('DD/MM/YYYY HH:mm')}</Text>
                            <br />
                            <Text strong>Địa điểm:</Text> <Text>{event_id.location}</Text>
                        </div>
                    </div>
                )}

                <Divider />

                <div>
                    <Text strong>Hình ảnh liên quan:</Text>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        {Array.isArray(images) && images.length > 0 ? (
                            images.map((img, index) => (
                                <Image
                                    key={index}
                                    width={100} // Cố định chiều rộng
                                    height={100} // Cố định chiều cao để tất cả hình ảnh có kích thước đồng đều
                                    src={img}
                                    alt={`Image-${index}`}
                                    style={{ objectFit: 'cover' }} // objectFit: 'cover' giúp hình ảnh giữ tỉ lệ mà không bị méo
                                />
                            ))
                        ) : (
                            <Text>Không có hình ảnh liên quan.</Text>
                        )}
                    </div>
                </div>

                {video && (
                    <div style={{ marginTop: '20px', height: '500px' }}>
                        <Text strong>Video:</Text>
                        <div className="w-full h-full">
                            <iframe
                                className="h-full w-full"
                                src={`https://www.youtube.com/embed/${video.split('v=')[1]?.split('&')[0]}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}
                <Divider />
            </Card>
        </div>

    );
}

export default PostDetail;
