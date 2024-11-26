import React, { useState } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CreateEvent = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        // Tạo đối tượng formData với các giá trị từ form
        const formData = {
            title: values.title,
            description: values.description,
            startTime: values.eventTime[0].toISOString(),
            endTime: values.eventTime[1].toISOString(),
            location: values.location,
            status: values.status,
            // Kiểm tra nếu có chọn thời gian bình chọn thì mới thêm vào formData
            ...(values.votingTime && values.votingTime.length > 0 && {
                votingStartTime: values.votingTime[0].toISOString(),
                votingEndTime: values.votingTime[1].toISOString(),
            }),
            votingStatus: values.votingStatus,
        };

        setLoading(true);
        try {
            const token = user?.token;
            if(!token) {
                message.error('Token không hợp lệ.');
                return;
            }
            await axios.post(`${API_URL}/admin/events/create`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true,
            });
            message.success('Sự kiện đã được tạo thành công!');
            form.resetFields();
            navigate('/admin/events');
        } catch(error) {
            console.error('Lỗi khi tạo sự kiện:', error);
            message.error('Có lỗi xảy ra khi tạo sự kiện.');
            if(error.response) {
                message.error(`Lỗi từ máy chủ: ${error.response.data.message || 'Vui lòng thử lại.'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-inner">
            <Card title="Tạo sự kiện" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                        <TextArea rows={5} placeholder="Nhập mô tả sự kiện" />
                    </Form.Item>

                    <Form.Item label="Thời gian sự kiện" name="eventTime" rules={[{ required: true, message: 'Vui lòng chọn thời gian sự kiện!' }]}>
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['Bắt đầu', 'Kết thúc']}
                        />
                    </Form.Item>

                    <Form.Item label="Địa điểm" name="location" rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}>
                        <Input placeholder="Nhập địa điểm sự kiện" />
                    </Form.Item>

                    <Form.Item label="Thời gian bình chọn" name="votingTime">
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['Bắt đầu', 'Kết thúc']}
                        />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status" initialValue="pending">
                        <Select placeholder="Chọn trạng thái">
                            <Option value="pending">Chờ bắt đầu</Option>
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Dừng hoạt động</Option>
                            <Option value="completed">Đã kết thúc</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {loading ? 'Đang tạo...' : 'Tạo sự kiện'}
                        </Button>
                    </Form.Item>

                    <Form.Item label="Trạng thái bình chọn" name="votingStatus" initialValue="closed">
                        <Select placeholder="Chọn trạng thái bình chọn">
                            <Option value="active">Mở bình chọn</Option>
                            <Option value="closed">Đóng bình chọn</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateEvent;
