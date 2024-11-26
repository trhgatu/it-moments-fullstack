import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import {
  Row,
  Col,
  Card,
  Button,
  Descriptions,
  Avatar,
} from "antd";

import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

import BgProfile from "../../assets/images/bg-profile.jpg";

function Profile() {
  const { user } = useUser();
  const [imageURL, setImageURL] = useState(false);
  const [, setLoading] = useState(false);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const pencil = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
        className="fill-gray-7"
      ></path>
      <path
        d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
        className="fill-gray-7"
      ></path>
    </svg>,
  ];
  return (
    <>
      <div
        className="profile-nav-bg"
        style={{ backgroundImage: "url(" + BgProfile + ")" }}
      ></div>

      <Card
        className="card-profile-head pt-5 pb-5"
        bodyStyle={{ display: "none" }}
        title={
          <Row justify="space-between" align="middle" gutter={[24, 0]}>
            <Col span={24} md={12} className="col-info">
              <Avatar.Group>
                <Avatar size={74} shape="square" src={user.avatar} />

                <div className="avatar-info">
                  <h4 className="font-semibold m-0">{user.fullName}</h4>
                  <p>{user.role_id.title}</p>
                </div>
              </Avatar.Group>
            </Col>
            <Col
              span={24}
              md={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
            </Col>
          </Row>
        }
      ></Card>

      <Row gutter={[24, 0]}>

        <Col span={24} md={8} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">Thông tin quản trị viên:</h6>}
            className="header-solid h-full card-profile-information"
            extra={<Button type="link">{pencil}</Button>}
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
            <hr/>
            <Descriptions>
              <Descriptions.Item label="Họ tên" span={3}>
                {user.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={3}>
                {user.role_id.description}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item label="Social" span={3}>
                <a href="#pablo" className="mx-5 px-5">
                  {<TwitterOutlined />}
                </a>
                <a href="#pablo" className="mx-5 px-5">
                  {<FacebookOutlined style={{ color: "#344e86" }} />}
                </a>
                <a href="#pablo" className="mx-5 px-5">
                  {<InstagramOutlined style={{ color: "#e1306c" }} />}
                </a>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Profile;
