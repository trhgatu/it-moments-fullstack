import React, { useState, useEffect } from 'react';
import styles from './Profile.module.scss';
import { API_URL } from '../../config/config';
import { useClientUser } from '../../context/ClientUserContext';
import { FaUserFriends, FaFacebook, FaInstagram, FaUser,FaYoutube  } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Modal, Button, Input, Form, message, Upload, Divider } from 'antd';
import { FaCog } from 'react-icons/fa';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, setUser } = useClientUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar || null);
  const [imagePreview, setImagePreview] = useState(user.avatar || null);

  const [votedPosts, setVotedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchVotedPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/voted/${user._id}`, {
          withCredentials: true,
        });

        if(response.data.success) {
          setVotedPosts(response.data.posts);
        }
      } catch(error) {
        console.error('Lỗi khi lấy bài viết đã bình chọn:', error);
        message.error('Không thể lấy danh sách bài viết đã bình chọn.');
      } finally {
        setLoadingPosts(false);
      }
    };

    if(user._id) {
      fetchVotedPosts();
    }
  }, [user._id]);

  const showModal = () => {
    form.setFieldsValue({
      bio: user.bio || '',
      facebook: user.socialLinks?.facebook || '',
      twitter: user.socialLinks?.twitter || '',
      linkedin: user.socialLinks?.linkedin || '',
      youtube: user.socialLinks?.youtube || '',
      instagram: user.socialLinks?.instagram || ''
    });
    setAvatar(user.avatar || null);
    setImagePreview(user.avatar || null);
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

        // Chuẩn bị dữ liệu FormData
        const formData = new FormData();
        formData.append('bio', values.bio || '');
        formData.append('facebook', values.facebook || '');
        formData.append('twitter', values.twitter || '');
        formData.append('linkedin', values.linkedin || '');
        formData.append('youtube', values.youtube || '');
        formData.append('instagram', values.instagram || '');
        if(avatar) {
          formData.append('avatar', avatar);
        }

        try {
          const response = await axios.put(
            `${API_URL}/users/update/${user._id}`,
            formData,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
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
                instagram: values.instagram,
              },
              avatar: response.data.user.avatar,
            }));
            setIsModalOpen(false);
          }
        } catch(error) {
          console.error('Lỗi khi cập nhật thông tin:', error);
          message.error('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
          setLoading(false);
        }
      })
      .catch((info) => {
        console.log('Validate failed:', info);
        setLoading(false);
      });
  };

  const handleAvatarChange = async (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
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
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Avatar"
                className="w-40 h-40 md:w-60 md:h-60 rounded-full border-4 border-white ring-8 ring-white object-cover"
              />
            ) : (
              <div className="w-40 h-40 md:w-60 md:h-60 rounded-full border-4 border-white ring-8 ring-white bg-gray-200 flex items-center justify-center">
                <FaUser
                  size={50}
                  className="text-gray-500"
                />
              </div>
            )}
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
                      className="text-pink-600 ml-6"
                    >
                      {user.socialLinks.instagram}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center space-x-6">
                {user.socialLinks?.youtube && (
                  <div className="flex items-center space-x-4">
                    <FaYoutube size={20} />
                    <a
                      href={user.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF0000] ml-6"
                    >
                      {user.socialLinks.youtube}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center space-x-6">
                {user.socialLinks?.twitter && (
                  <div className="flex items-center space-x-4">
                    <FaSquareXTwitter size={20} />
                    <a
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black ml-6"
                    >
                      {user.socialLinks.twitter}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="shadow-[rgba(0,_0,_0,_0.02)_0px_1px_3px_0px,_rgba(27,_31,_35,_0.15)_0px_0px_0px_1px] p-6 bg-white rounded-lg col-span-2">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Các bài viết đã bình chọn:</h3>
              <div className="space-y-4 mt-4">
                {loadingPosts ? (
                  <div className="text-center text-gray-500">Đang tải bài viết...</div>
                ) : (
                  votedPosts.length > 0 ? (
                    votedPosts.map((post) => (
                      <div key={post._id} className="border-b p-4 group hover:bg-gray-100 border rounded-md transition duration-300 ease-in-out">
                        <Link
                          to={`/posts/${post.post_category_id?.slug}/${post.slug}`}
                          className="flex items-center space-x-4 group-hover:text-blue-600 transition duration-300 ease-in-out"
                        >
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-56  object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold group-hover:text-blue-600 transition duration-300 ease-in-out line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="line-clamp-2 text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: post.description }}></p>
                            <span className="text-xs text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </Link>
                      </div>

                    ))

                  ) : (
                    <div className="text-center text-gray-500">Bạn chưa bình chọn bài viết nào</div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        visible={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSave}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          name="profile-form"
        >
          <Form.Item label="Giới thiệu bản thân" name="bio">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Facebook" name="facebook">
            <Input placeholder="https://facebook.com/yourprofile" />
          </Form.Item>
          <Form.Item label="Instagram" name="instagram">
            <Input placeholder="https://instagram.com/yourprofile" />
          </Form.Item>
          <Form.Item label="Twitter" name="twitter">
            <Input placeholder="https://instagram.com/yourprofile" />
          </Form.Item>

          <Form.Item label="Likedin" name="likein">
            <Input placeholder="https://instagram.com/yourprofile" />
          </Form.Item>

          <Form.Item label="Youtube" name="youtube">
            <Input placeholder="https://instagram.com/yourprofile" />
          </Form.Item>


          <Form.Item label="Tải ảnh đại diện" name="avatar">
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleAvatarChange(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            <div className="mt-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Avatar Preview"
                  className="w-40 h-40 object-cover rounded-full border-4 border-white ring-8 ring-white"
                />
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
