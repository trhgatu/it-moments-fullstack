import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { useClientUser } from '../../context/ClientUserContext';
import { message, Modal } from 'antd';

const PostEventDetail = () => {
  const { slug } = useParams();
  const { user, loading: userLoading } = useClientUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal bình chọn
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false); // Modal hủy bình chọn

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/detail/${slug}`);
      setPost(response.data.data.post);

      if (user && user._id) {
        const hasVoted = response.data.voters.some(voter => voter._id === user._id);
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

  // Xử lý xác nhận bình chọn
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
      setIsModalVisible(false); // Đóng modal sau khi bình chọn thành công
    } catch (error) {
      console.error('Lỗi khi bình chọn:', error.response?.data?.message);
      message.error('Có lỗi xảy ra trong quá trình bình chọn.');
    }
  };

  // Hàm mở modal xác nhận hủy bình chọn
  const showCancelVoteModal = () => {
    setIsCancelModalVisible(true);
  };

  // Xử lý hủy bình chọn
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
      setIsCancelModalVisible(false); // Đóng modal hủy bình chọn
    } catch (error) {
      console.error('Lỗi khi hủy bình chọn:', error.response?.data?.message);
      message.error('Có lỗi xảy ra trong quá trình hủy bình chọn.');
    }
  };

  // Hàm hủy modal bình chọn
  const handleVoteModalCancel = () => {
    setIsModalVisible(false); // Đóng modal bình chọn
  };

  // Hàm hủy modal hủy bình chọn
  const handleCancelVoteModal = () => {
    setIsCancelModalVisible(false);
  };

  // Xác nhận hủy bình chọn
  const handleCancelVoteConfirm = () => {
    setIsCancelModalVisible(false);
    handleCancelVote(); // Gọi hàm hủy bình chọn
  };

  if (userLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Không tìm thấy bài viết.</div>;
  }

  // Kiểm tra danh mục
  const isEventCategory = post.post_category_id?.title === 'Sự kiện'; // Kiểm tra xem danh mục có phải là sự kiện không
  const canVote = !isEventCategory && post.post_category_id?.title !== 'Danh mục không cho bình chọn'; // Kiểm tra khả năng bình chọn

  return (
    <div className="max-w-screen-lg mx-auto p-6 bg-white h-screen pt-40">
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
          {/* Chỉ hiển thị nút bình chọn nếu không phải là danh mục sự kiện */}
          {!isEventCategory && canVote && (
            <>
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
            </>
          )}
        </div>

        <div className="mt-8">
          {post.images && post.images.length > 0 ? (
            post.images.map((image, index) => (
              <div key={index} className="mt-4">
                <img
                  src={image}
                  alt={`Post Image ${index + 1}`}
                  className="w-full h-80 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))
          ) : (
            <p>Không có hình ảnh bổ sung.</p>
          )}
        </div>
      </div>

      {post.video && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Video liên quan</h3>
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
        </div>
      )}

      {/* Modal xác nhận bình chọn */}
      <Modal
        title="Xác nhận bình chọn"
        visible={isModalVisible}
        onOk={handleVote} // Xác nhận bình chọn
        onCancel={handleVoteModalCancel} // Hủy bỏ bình chọn
      >
        <p>Bạn có chắc chắn muốn bình chọn cho bài viết này không?</p>
      </Modal>

      {/* Modal xác nhận hủy bình chọn */}
      <Modal
        title="Xác nhận hủy bình chọn"
        visible={isCancelModalVisible}
        onOk={handleCancelVoteConfirm} // Xác nhận hủy bình chọn
        onCancel={handleCancelVoteModal} // Hủy bỏ hủy bình chọn
      >
        <p>Bạn có chắc chắn muốn hủy bình chọn cho bài viết này không?</p>
      </Modal>
    </div>
  );
};

export default PostEventDetail;
