import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Typography, Alert, Row, Col, Divider, Spin } from "antd";
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;

function CategoryDetail() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryDetail = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`http://localhost:3000/api/v1/admin/post-categories/detail/${id}`, {
                    withCredentials: true,
                });

                // Check if the response is successful
                if (response.data && response.data.success) {
                    setCategory(response.data.data);
                } else {
                    throw new Error(`API Error: ${response.data.message || 'Failed to fetch category data'}`);
                }
            } catch (error) {
                console.error('Error fetching category details:', error);
                setError(`Unable to retrieve category data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryDetail();
    }, [id]);

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    if (error) {
        return <Alert message={error} type="error" showIcon />;
    }

    if (!category) {
        return <Alert message="Category not found." type="warning" showIcon />;
    }

    const { title, description, thumbnail, status, createdAt, position } = category;

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
            </Card>
        </div>
    );
}

export default CategoryDetail;
