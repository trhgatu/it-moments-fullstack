import React, { useState } from 'react';
import styles from './Profile.module.scss';
import { API_URL } from '../../config/config';
import { useClientUser } from '../../context/ClientUserContext';
import { FaUserFriends, FaFacebook, FaInstagram } from "react-icons/fa";
import { Modal, Button, Input, Form, message, Upload,Divider } from 'antd';
import { FaCog } from 'react-icons/fa';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';

const Profile = () => {
  const { user, setUser } = useClientUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar || null); // Initialize avatar with user data
  const [imagePreview, setImagePreview] = useState(user.avatar || null); // Store image preview

  const votedPosts = [
    { title: "Bài viết 1", date: "01/01/2024" },
    { title: "Bài viết 2", date: "02/01/2024" },
    { title: "Bài viết 3", date: "03/01/2024" },
  ];

  const showModal = () => {
    form.setFieldsValue({
      bio: user.bio || '',
      facebook: user.socialLinks?.facebook || '',
      twitter: user.socialLinks?.twitter || '',
      linkedin: user.socialLinks?.linkedin || '',
      youtube: user.socialLinks?.youtube || '',
      instagram: user.socialLinks?.instagram || ''
    });
    setAvatar(user.avatar || null); // Load avatar from user data
    setImagePreview(user.avatar || null); // Set image preview for avatar
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        const updatedValues = {
          bio: values.bio || null,
          facebook: values.facebook || null,
          twitter: values.twitter || null,
          linkedin: values.linkedin || null,
          youtube: values.youtube || null,
          instagram: values.instagram || null,
        };

        // If avatar has changed, include it in the request
        if(avatar) {
          updatedValues.avatar = avatar;
        }

        try {
          const response = await axios.put(
            `${API_URL}/users/update/${user._id}`, updatedValues,
            {
              withCredentials: true,
            }
          );

          if(response.status === 200) {
            message.success('Thông tin đã được cập nhật thành công!');
            setUser((prevUser) => ({
              ...prevUser,
              bio: values.bio,
              socialLinks: {
                facebook: values.facebook,
                twitter: values.twitter,
                linkedin: values.linkedin,
                youtube: values.youtube,
                instagram: values.instagram
              },
              avatar: avatar || prevUser.avatar, // Update avatar if changed
            }));
            setIsModalOpen(false);
          }
        } catch(error) {
          console.error('Lỗi khi cập nhật thông tin:', error);
          message.error('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
          setLoading(false); // Tắt loading khi kết thúc
        }
      })
      .catch((info) => {
        console.log('Validate failed:', info);
        setLoading(false); // Tắt loading nếu validation thất bại
      });
  };

  const handleAvatarChange = async (file) => {
    // Create a preview for the image before uploading
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Set the selected avatar file to state
    setAvatar(file);
  };

  return (
    <div className="container mx-auto bg-white rounded-lg overflow-hidden">
      <div className={styles.mainContent}>
        <div className="relative">
          <img
            src="https://fullstack.edu.vn/assets/cover-profile-CDYcrPwJ.png"
            alt="Cover"
            className="w-full h-auto object-cover rounded-b-3xl"
          />
          <div className="absolute -bottom-24 md:-bottom-32 left-10">
            <img
              src={imagePreview || "https://files.fullstack.edu.vn/f8-prod/public-images/6679277183b87.png"} // Display preview or default avatar
              alt="Avatar"
              className="w-40 h-40 md:w-60 md:h-60 rounded-full border-4 border-white ring-8 ring-white"
            />
          </div>
          <span className="pt-6 md:pt-8 absolute left-60 md:left-80 text-xl md:text-4xl font-bold text-black">{user.fullName}</span>
          <div className="absolute right-0 pt-6 md:pt-8 md:right-10">
            <Button
              type="primary"
              icon={<FaCog />}
              onClick={showModal}
              shape="circle"
              size="large"
              className="bg-blue-500 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-32 md:mt-48 px-4 md:px-10">
          <div className="shadow-[rgba(0,_0,_0,_0.02)_0px_1px_3px_0px,_rgba(27,_31,_35,_0.15)_0px_0px_0px_1px] p-6 bg-white rounded-lg col-span-1">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Giới thiệu</h3>
              <p className="text-center mt-4">
                {user.bio}
              </p>
              <div className="mt-4 flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <FaUserFriends size={20} />
                  <span className="">
                    Tham gia vào <span className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-6">
                {user.socialLinks?.facebook && (
                  <div className="flex items-center space-x-4">
                    <FaFacebook size={20} />
                    <a href={user.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-6">
                      {user.socialLinks.facebook}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center space-x-6">
                {user.socialLinks?.instagram && (
                  <div className="flex items-center space-x-4">
                    <FaInstagram size={20} />
                    <a
                      href={user.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 ml-6"
                    >
                      {user.socialLinks.instagram}
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="shadow-[rgba(0,_0,_0,_0.02)_0px_1px_3px_0px,_rgba(27,_31,_35,_0.15)_0px_0px_0px_1px] p-6 bg-white rounded-lg col-span-1 md:col-span-2 lg:col-span-2">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">Bài viết đã bình chọn</h3>
              <ul className="space-y-4 mt-4">
                {votedPosts.map((post, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{post.title}</span>
                    <span className="text-gray-500 text-sm">{post.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Modal
          title="Cài đặt Profile"
          visible={isModalOpen}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Đóng
            </Button>,
            <Button key="submit" type="primary" onClick={handleSave} loading={loading}>
              Lưu thay đổi
            </Button>,
          ]}
          width={700}
        >
          <Divider/>
          <Form.Item className="flex items-center mt-10">
            <div className="flex items-center space-x-10">
              {/* Avatar Preview */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Avatar Preview"
                  className="w-40 h-40 md:w-60 md:h-60 rounded-full border-4 border-white ring-8 ring-blue-500"
                />
              )}

              {/* Upload Button */}
              <Upload
                customRequest={({ file, onSuccess, onError }) => {
                  handleAvatarChange(file);
                  onSuccess();
                }}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} className="text-blue-500">
                  Chọn avatar
                </Button>
              </Upload>
            </div>
          </Form.Item>

          <Form form={form} layout="vertical">
            <Form.Item
              label="Tiểu sử"
              name="bio"
            >
              <Input.TextArea placeholder="Nhập tiểu sử của bạn" rows={4} />
            </Form.Item>

            <Form.Item
              label="Link Facebook"
              name="facebook"
            >
              <Input placeholder="Nhập link Facebook" />
            </Form.Item>
            <Form.Item
              label="Link Instagram"
              name="instagram"
            >
              <Input placeholder="Nhập link Instagram" />
            </Form.Item>

            <Form.Item
              label="Link Twitter"
              name="twitter"
            >
              <Input placeholder="Nhập link Twitter" />
            </Form.Item>

            <Form.Item
              label="Link LinkedIn"
              name="linkedin"
            >
              <Input placeholder="Nhập link LinkedIn" />
            </Form.Item>
            <Form.Item
              label="Link Youtube"
              name="youtube"
            >
              <Input placeholder="Nhập link Youtube" />
            </Form.Item>


          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
