import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Typography, Alert, Image, Row, Col, Divider, Spin } from "antd";
import axios from 'axios';
import moment from 'moment';
import { useUser } from '../../../context/UserContext';

const { Title, Text } = Typography;

const fetchData = async (id, token) => {
    const postResponse = await axios.get(`http://localhost:3000/api/v1/admin/posts/detail/${id}`, {
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
        if (!token) {
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

    const { title, description, thumbnail, video, status, images, createdAt, position, post_category_id } = post;

    return (
        <div style={{ padding: '20px', background: '#f0f2f5' }}>
            <Card
                title={<Title level={2}>{title}</Title>}
                bordered={false}
                style={{ marginBottom: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Avatar shape="square" size={128} src={thumbnail} alt="Thumbnail" />
                    </Col>
                    <Col xs={24} sm={12} md={16}>
                        <div style={{ marginLeft: '20px' }}>
                            <Text strong>Mô tả:</Text>
                            <div dangerouslySetInnerHTML={{ __html: description }} style={{ marginTop: '10px', color: '#595959' }} />
                        </div>
                    </Col>
                </Row>

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
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Ngày tạo:</Text> <Text>{moment(createdAt).format('DD/MM/YYYY')}</Text>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={16}>
                    <Col xs={24}>
                        <Text strong>Danh mục:</Text>
                        <Text style={{ marginLeft: '10px' }}>
                            {post_category_id?.title ? post_category_id.title : 'Không tìm thấy danh mục'}
                        </Text>
                    </Col>
                </Row>

                <Divider />

                <div>
                    <Text strong>Hình ảnh liên quan:</Text>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        {Array.isArray(images) && images.length > 0 ? (
                            images.map((img, index) => (
                                <Image key={index} width={100} src={img} alt={`Image-${index}`} style={{ borderRadius: '8px' }} />
                            ))
                        ) : (
                            <Text>Không có hình ảnh liên quan.</Text>
                        )}
                    </div>
                </div>

                {video && (
                    <div style={{ marginTop: '20px', height: '500px' }} >
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
