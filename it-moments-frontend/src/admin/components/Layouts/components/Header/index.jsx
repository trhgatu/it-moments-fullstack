import { useState } from "react";
import { Row, Col, Breadcrumb, Button, Input, Avatar, Dropdown, Menu, Modal, Tag, notification, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../../../../context/UserContext";
import { API_URL } from "../../../../../config/config";
import { green } from "@mui/material/colors";

const profileIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
      fill="#111827"
    ></path>
  </svg>
);

const togglerIcon = (
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>
);

function Header({ name, subName, onPress }) {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if(response.ok) {
        setUser(null);
        notification.success({
          message: "Đăng xuất thành công!",
          description: "Bạn đã đăng xuất khỏi hệ thống.",
        });
        navigate("/admin/auth/login");
      } else {
        console.error("Lỗi khi đăng xuất");
      }
    } catch(error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  // Hiển thị Modal xác nhận đăng xuất
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Xử lý khi người dùng đồng ý đăng xuất
  const handleOk = () => {
    handleLogout();
    setIsModalVisible(false);
  };

  // Xử lý khi người dùng hủy đăng xuất
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const breadcrumbItems = location.pathname
    .split("/")
    .filter((item) => item && item !== "admin");

  const breadcrumbDisplay = breadcrumbItems.map((item, index) => {
    const isDetailPage = item === "detail";
    if(isDetailPage) {
      return (
        <Breadcrumb.Item key={index}>
          <span>Detail</span>
        </Breadcrumb.Item>
      );
    }
    return (
      <Breadcrumb.Item key={index}>
        <NavLink to={`/admin/${item}`}>
          {item.replace("-", " ").charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
        </NavLink>
      </Breadcrumb.Item>
    );
  });

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/admin/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={showModal}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={6}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <span>Pages</span>
            </Breadcrumb.Item>
            {breadcrumbDisplay}
          </Breadcrumb>
        </Col>
        <Col span={24} md={18} className="header-control">
          <Button type="link" className="sidebar-toggler" onClick={onPress}>
            {togglerIcon}
          </Button>
          {user ? (
            <div className="flex items-center">
              <Typography>Xin chào:
                <Tag className='ml-2' color={user.status === 'active' ? 'green' : 'red'}>
                  {user.fullName}
                </Tag>
              </Typography>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Avatar
                  src={user.avatar || "https://example.com/default-avatar.png"}
                  alt="avatar"
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
            </div>
          ) : (
            <Link to="/sign-in" className="btn-sign-in">
              {profileIcon}
              <span>Đăng nhập</span>
            </Link>
          )}
        </Col>
      </Row>

      {/* Modal xác nhận đăng xuất */}
      <Modal
        title="Xác nhận đăng xuất"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đăng xuất"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn đăng xuất không?</p>
      </Modal>
    </>
  );
}

export default Header;
