import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, message, Spin } from "antd"; // Thêm Spin vào import
import { UserOutlined, FileTextOutlined, CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../../../config/config";
import { useUser } from '../../../context/UserContext';

const Dashboard = () => {
  const { user } = useUser();
  const { Title } = Typography;
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalAdmins, setTotalAdmins] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const token = user?.token;
      if (!token) {
        message.error('Token không hợp lệ. Vui lòng đăng nhập lại.');
        return;
      }

      try {
        const usersResponse = await axios.get(`${API_URL}/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });
        if (usersResponse.data.success) {
          setTotalAdmins(usersResponse.data.data.users.filter(user => user.isAdmin === true).length);
          setTotalUsers(usersResponse.data.data.users.length);
        }
        const postsResponse = await axios.get(`${API_URL}/admin/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });
        if (postsResponse.data.success) {
          setTotalPosts(postsResponse.data.data.posts.length);
        }
        const eventsResponse = await axios.get(`${API_URL}/admin/events`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });
        if (eventsResponse.data.success) {
          setTotalEvents(eventsResponse.data.data.events.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token]);

  const count = [
    {
      today: "Số lượng người dùng",
      title: totalUsers,
      icon: <UserOutlined style={{ fontSize: 24, color: "#fff" }} />,
      bnb: "bnb2",
    },
    {
      today: "Số lượng bài viết",
      title: loading ? <Spin size="small" /> : totalPosts,  // Thay loading bằng Spin
      icon: <FileTextOutlined style={{ fontSize: 24, color: "#fff" }} />,
      bnb: "redtext",
    },
    {
      today: "Số lượng Sự kiện",
      title: totalEvents,
      icon: <CalendarOutlined style={{ fontSize: 24, color: "#fff" }} />,
      bnb: "bnb2",
    },
    {
      today: "Số lượng QTV",
      title: totalAdmins,
      icon: <TeamOutlined style={{ fontSize: 24, color: "#fff" }} />,
      bnb: "bnb2",
    },
  ];

  return (
    <div className="layout-content">
      <Row className="rowgap-vbox" gutter={[24, 0]}>
        {count.map((c, index) => (
          <Col key={index} xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
            <Card bordered={false} className="criclebox">
              <div className="number">
                <Row align="middle" gutter={[24, 0]}>
                  <Col xs={18}>
                    <span>{c.today}</span>
                    <Title level={3}>
                      {loading ? <Spin size="small" /> : c.title}{" "}  {/* Thay loading bằng Spin */}
                      <small className={c.bnb}>{c.persent}</small>
                    </Title>
                  </Col>
                  <Col xs={6}>
                    <div className="icon-box">{c.icon}</div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
