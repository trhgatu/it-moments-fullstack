import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Tag, Alert, Row, Col, Divider, Spin, Button } from "antd";
import axios from 'axios';
import moment from 'moment';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';

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
        if(!token) {
            setError('Không tìm thấy token.');
            return;
        }
        setLoading(true);
        setError(null);

        fetchEventDetail(id, token)
            .then(response => {
                if(response.data?.success) {
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

    if(loading) return <Spin tip="Loading..." />;
    if(error) return <Alert message={error} type="error" showIcon />;
    if(!event) return <Alert message="Event not found." type="warning" showIcon />;

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

    // Hàm xuất dữ liệu ra Excel
    const exportToExcel = () => {
        const data = [];
        data.push({
            "Thông tin sự kiện": "Tiêu đề sự kiện", "Nội dung": title
        });
        data.push({
            "Thông tin sự kiện": "Địa điểm", "Nội dung": location
        });
        data.push({
            "Thông tin sự kiện": "Thời gian bắt đầu", "Nội dung": moment(startTime).format('DD/MM/YYYY HH:mm')
        });
        data.push({
            "Thông tin sự kiện": "Thời gian kết thúc", "Nội dung": moment(endTime).format('DD/MM/YYYY HH:mm')
        });
        data.push({
            "Thông tin sự kiện": "Trạng thái", "Nội dung": status === 'completed' ? 'Hoàn thành' : 'Đang diễn ra'
        });
        data.push({
            "Thông tin sự kiện": "Thời gian bỏ phiếu bắt đầu", "Nội dung": moment(votingStartTime).format('DD/MM/YYYY HH:mm')
        });
        data.push({
            "Thông tin sự kiện": "Thời gian bỏ phiếu kết thúc", "Nội dung": moment(votingEndTime).format('DD/MM/YYYY HH:mm')
        });

        data.push({
            "Thông tin tiết mục": "Tiêu đề bài viết", "Tổng số phiếu": " "
        });
        posts.forEach(post => {
            data.push({
                "Thông tin tiết mục": post.title,
                "Tổng số phiếu": post.votes
            });
        });

        const ws = XLSX.utils.json_to_sheet(data, {
            header: ['Thông tin sự kiện', 'Nội dung', 'Thông tin tiết mục', 'Tổng số phiếu'],
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Event Details");

        const colWidths = [
            { wpx: 300 },
            { wpx: 300 },
            { wpx: 100 },
        ];
        ws['!cols'] = colWidths;
        XLSX.writeFile(wb, `Event_Detail_${title}.xlsx`);
    };

    const exportToPDF = () => {
        const element = document.getElementById("event-detail-to-pdf");
        const generatePDF = () => {
            const options = {
                margin: 0,
                filename: `${title}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 4, logging: true, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().from(element).set(options).save();
        };

        const images = element.getElementsByTagName("img");
        let imagesLoaded = 0;
        const checkImagesLoaded = () => {
            for(let i = 0; i < images.length; i++) {
                if(images[i].complete) {
                    imagesLoaded++;
                } else {
                    images[i].onload = () => {
                        imagesLoaded++;
                        if(imagesLoaded === images.length) {
                            generatePDF();
                        }
                    };
                    images[i].onerror = () => {
                        imagesLoaded++;
                        if(imagesLoaded === images.length) {
                            generatePDF();
                        }
                    };
                }
            }
            if(imagesLoaded === images.length || images.length === 0) {
                generatePDF();
            }
        };

        checkImagesLoaded();
    };



    return (
        <div style={{ background: '#f0f2f5' }} id='event-detail-to-pdf'>
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
                        <Text strong>Thời gian bình chọn bắt đầu:</Text>
                        <br />
                        <Text>{moment(votingStartTime).format('DD/MM/YYYY HH:mm')}</Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Thời gian bình chọn kết thúc:</Text>
                        <br />
                        <Text>{moment(votingEndTime).format('DD/MM/YYYY HH:mm')}</Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Text strong>Tổng số bình chọn:</Text>
                        <br />
                        <Text>{totalVotes}</Text>
                    </Col>
                </Row>

                <Divider />

                <div>
                    <Text strong>Mô tả:</Text>
                    <div style={{ color: '#595959' }}>{description}</div>
                </div>
                <Divider />
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Text strong>Trạng thái bình chọn:</Text>
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

                <Button className='inline-block' type="primary" onClick={exportToExcel} style={{ marginTop: '20px', marginRight: '10px' }}>
                    Xuất ra Excel
                </Button>
                <Button type="primary" onClick={exportToPDF} style={{ marginTop: '20px' }}>
                    Xuất ra PDF
                </Button>
            </Card>

            <Divider />

            <Card
                title={<Title level={4}>Các tiết mục đã được bình chọn ở sự kiện:</Title>}
                bordered={false}
                style={{ marginTop: '20px' }}
            >
                <div>
                    {posts.map(post => (
                        <div key={post._id}
                            style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start' }}
                            className='p-4 border-2 rounded-lg'>
                            <div style={{ flex: '0 0 150px', marginRight: '16px' }}>
                                <img
                                    alt="thumbnail"
                                    src={post.thumbnail || 'https://via.placeholder.com/272x150'}
                                    style={{ objectFit: 'cover', width: '100%', height: '150px', borderRadius: '8px' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Card.Meta
                                    title={<a href={`/posts/${post.post_category_id.slug}/${post.slug}`}>{post.title}</a>}
                                    description={`Lượt xem: ${post.views} - Tổng số bình chọn: ${post.votes}`}
                                />
                                {post.voterDetails && post.voterDetails.length > 0 ? (
                                    <div style={{ marginTop: '10px' }}>
                                        <Text strong>Người đã bình chọn:</Text>
                                        <Row gutter={8} style={{ marginTop: '5px' }}>
                                            {post.voterDetails.slice(0, 3).map(voter => (
                                                <Col key={voter._id}>
                                                    <Text>{voter.fullName}</Text>
                                                </Col>
                                            ))}
                                        </Row>
                                        {post.voterDetails.length > 3 && (
                                            <Text strong style={{ marginTop: '5px', display: 'block' }} >
                                                +{post.voterDetails.length - 3} more
                                            </Text>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '10px' }}>
                                        <Text strong>Người đã bình chọn:</Text>
                                        <div className="mt-3">
                                            <Tag color="red">Không có người bình chọn</Tag>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default EventDetail;
