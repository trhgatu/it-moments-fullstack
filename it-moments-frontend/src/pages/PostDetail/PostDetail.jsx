import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { useClientUser } from '../../context/ClientUserContext';
import { message, Modal, Row, Col, Image, Card } from 'antd';

const PostDetail = () => {
  const { slug } = useParams();
  const { user, loading: userLoading } = useClientUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false); // State for image modal
  const [selectedImage, setSelectedImage] = useState(''); // State for selected image

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/detail/${slug}`);
      setPost(response.data.data.post);
      console.log(response.data.data.post)
      if (user && user._id) {
        const hasVoted = response.data.data.post.voters.some(voter => voter._id === user._id);
        setVoted(hasVoted);
      }

      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết bài viết:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  // Hàm mở modal xác nhận bình chọn
  const showVoteModal = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để bình chọn!");
      return;
    }

    if (voted) {
      message.warning('Bạn đã bình chọn rồi!');
      return;
    }

    setIsModalVisible(true);
  };

  // Hàm xác nhận bình chọn
  const handleVote = async () => {
    try {
      const response = await axios.post(`${API_URL}/posts/${post._id}/vote`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        withCredentials: true,
      });
      if (response.data.success) {
        setVoted(true);
        message.success('Bình chọn thành công!');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi bình chọn:', error.response?.data?.message);
      message.error('Có lỗi xảy ra trong quá trình bình chọn.');
    }
  };

  // Hàm mở modal xác nhận hủy bình chọn
  const showCancelVoteModal = () => {
    setIsCancelModalVisible(true);
  };

  // Hàm hủy bình chọn
  const handleCancelVote = async () => {
    try {
      const response = await axios.post(`${API_URL}/posts/${post._id}/cancel-vote`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        withCredentials: true,
      });
      if (response.data.success) {
        setVoted(false);
        message.success('Hủy bình chọn thành công!');
      }
      setIsCancelModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi hủy bình chọn:', error.response?.data?.message);
      message.error('Có lỗi xảy ra trong quá trình hủy bình chọn.');
    }
  };

  const handleCancelVoteModal = () => {
    setIsCancelModalVisible(false);
  };

  const handleCancelVoteConfirm = () => {
    setIsCancelModalVisible(false);
    handleCancelVote();
  };

  const handleVoteModalCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm mở modal hình ảnh
  const showImageModal = (image) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  // Hàm đóng modal hình ảnh
  const handleImageModalCancel = () => {
    setImageModalVisible(false);
    setSelectedImage(''); // Reset selected image
  };

  if (userLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Không tìm thấy bài viết.</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto p-6 bg-white h-screen pt-40">
      {/* Video section */}
      {post.video && (
        <Card title="Video liên quan" className="mb-8">
          <div className="mt-4">
            <iframe
              width="100%"
              height="450"
              src={`https://www.youtube.com/embed/${post.video.split('v=')[1].split('&')[0]}`}
              title="Video Liên Quan"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </Card>
      )}

      {/* Thumbnail Image */}
      <div className="cursor-pointer">
        <img
          src={post.thumbnail || 'https://via.placeholder.com/150'}
          alt={post.title}
          className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300 shadow-lg"
        />
      </div>

      <div className="mt-6 leading-relaxed text-gray-900">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 text-black">{post.title}</h1>
          <div className="flex justify-between text-lg text-gray-700 mb-3">
            <span className="italic">By {post.accountFullName}</span>
            <span className="text-gray-600">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <span className="bg-blue-600 text-white px-4 py-2 rounded">Danh mục: {post.post_category_id?.title || "Không có danh mục"}</span>
        </div>

        <p className="text-lg">{post.description}</p>

        <div className="mt-6">
          <button
            onClick={showVoteModal}
            disabled={voted}
            className={`px-4 py-2 rounded bg-blue-600 text-white ${voted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {voted ? 'Bạn đã bình chọn' : 'Bình chọn'}
          </button>
          {voted && (
            <button
              onClick={showCancelVoteModal}
              className="ml-4 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Hủy bình chọn
            </button>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Hình ảnh bổ sung</h3>
          <Row gutter={[16, 16]} className="mt-4">
            {post.images && post.images.length > 0 ? (
              post.images.map((image, index) => (
                <Col span={8} key={index}> {/* 8 cột cho mỗi hình ảnh, tổng cộng 3 hình mỗi hàng */}
                  <Image
                    src={image}

                    alt={`Post Image ${index + 1}`}
                    preview={false} // Disable default Ant Design preview
                    onClick={() => showImageModal(image)} // Open image modal on click
                    style={{ width: '100%', height: 'auto', objectFit: 'cover', aspectRatio: '16/9',cursor: 'pointer' }} // Maintain 16:9 aspect ratio
                  />
                </Col>
              ))
            ) : (
              <p>Không có hình ảnh bổ sung.</p>
            )}
          </Row>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold">Bài viết liên quan</h3>
        <div className="flex space-x-8 mt-8">
          {/* Related posts will be rendered here */}
        </div>
      </div>

      {/* Modal xác nhận bình chọn */}
      <Modal
        title="Xác nhận bình chọn"
        visible={isModalVisible}
        onOk={handleVote}
        onCancel={handleVoteModalCancel}
      >
        <p>Bạn có chắc chắn muốn bình chọn cho bài viết này không?</p>
      </Modal>

      {/* Modal xác nhận hủy bình chọn */}
      <Modal
        title="Xác nhận hủy bình chọn"
        visible={isCancelModalVisible}
        onOk={handleCancelVoteConfirm}
        onCancel={handleCancelVoteModal}
      >
        <p>Bạn có chắc chắn muốn hủy bình chọn cho bài viết này không?</p>
      </Modal>

      {/* Modal cho hình ảnh */}
      <Modal
        visible={imageModalVisible}
        footer={null}
        onCancel={handleImageModalCancel}
        centered
        width={800} // Width of the image modal
      >
        <img src={selectedImage} alt="Selected" className="w-full h-auto" />
      </Modal>
    </div>
  );
};

export default PostDetail;
