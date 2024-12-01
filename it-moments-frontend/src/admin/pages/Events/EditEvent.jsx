import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';
import moment from 'moment'; // Đảm bảo import moment nếu bạn đang sử dụng nó để chuyển đổi thời gian.

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EditEvent = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { id } = useParams();  // Get the event id from the URL
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [eventData, setEventData] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const token = user?.token;
                if (!token) {
                    message.error('Token không hợp lệ.');
                    return;
                }

                const response = await axios.get(`${API_URL}/admin/events/detail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true,
                });

                const event = response.data.data.event; // Get event data from response

                // Set form values
                form.setFieldsValue({
                    title: event.title,
                    description: event.description,
                    eventTime: [event.startTime ? moment(event.startTime) : null, event.endTime ? moment(event.endTime) : null],
                    location: event.location,
                    status: event.status,
                    votingTime: event.votingStartTime && event.votingEndTime ? [moment(event.votingStartTime), moment(event.votingEndTime)] : [],
                    votingStatus: event.votingStatus,
                });

                setEventData(event); // Store event data to use later if needed
            } catch (error) {
                console.error('Lỗi khi lấy thông tin sự kiện:', error);
                message.error('Không thể lấy thông tin sự kiện.');
            }
        };

        fetchEventDetails();
    }, [id, user, form]);

    const onFinish = async (values) => {
        const formData = {
            title: values.title,
            description: values.description,
            startTime: values.eventTime[0].toISOString(),
            endTime: values.eventTime[1].toISOString(),
            location: values.location,
            status: values.status,
            // Add voting time if provided
            ...(values.votingTime && values.votingTime.length > 0 && {
                votingStartTime: values.votingTime[0].toISOString(),
                votingEndTime: values.votingTime[1].toISOString(),
            }),
            votingStatus: values.votingStatus,
        };

        setLoading(true);
        try {
            const token = user?.token;
            if (!token) {
                message.error('Token không hợp lệ.');
                return;
            }

            await axios.patch(`${API_URL}/admin/events/edit/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });

            message.success('Sự kiện đã được cập nhật thành công!');
            navigate('/admin/events');
        } catch (error) {
            console.error('Lỗi khi cập nhật sự kiện:', error);
            message.error('Có lỗi xảy ra khi cập nhật sự kiện.');
            if (error.response) {
                message.error(`Lỗi từ máy chủ: ${error.response.data.message || 'Vui lòng thử lại.'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-inner">
            <Card title="Chỉnh sửa sự kiện" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'pending', votingStatus: 'closed' }}>
                    {/* Title */}
                    <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    {/* Description */}
                    <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                        <TextArea rows={5} placeholder="Nhập mô tả sự kiện" />
                    </Form.Item>

                    {/* Event Time */}
                    <Form.Item label="Thời gian sự kiện" name="eventTime" rules={[{ required: true, message: 'Vui lòng chọn thời gian sự kiện!' }]}>
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['Bắt đầu', 'Kết thúc']}
                        />
                    </Form.Item>

                    {/* Location */}
                    <Form.Item label="Địa điểm" name="location" rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}>
                        <Input placeholder="Nhập địa điểm sự kiện" />
                    </Form.Item>

                    {/* Voting Time */}
                    <Form.Item label="Thời gian bình chọn" name="votingTime">
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['Bắt đầu', 'Kết thúc']}
                        />
                    </Form.Item>

                    {/* Status */}
                    <Form.Item label="Trạng thái" name="status">
                        <Select placeholder="Chọn trạng thái">
                            <Option value="pending">Chờ bắt đầu</Option>
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Dừng hoạt động</Option>
                            <Option value="completed">Đã kết thúc</Option>
                        </Select>
                    </Form.Item>

                    {/* Voting Status */}
                    <Form.Item label="Trạng thái bình chọn" name="votingStatus">
                        <Select placeholder="Chọn trạng thái bình chọn">
                            <Option value="active">Mở bình chọn</Option>
                            <Option value="closed">Đóng bình chọn</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {loading ? 'Đang cập nhật...' : 'Cập nhật sự kiện'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditEvent;
