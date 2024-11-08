import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { useClientUser } from '../../context/ClientUserContext';
import { message, Modal, Row, Col, Image, Card, Spin, Progress } from 'antd';

const PostDetail = () => {
  const { slug } = useParams();
  const { user, loading: userLoading } = useClientUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/detail/${slug}`);
      setPost(response.data.data.post);
      if(user && user._id) {
        const hasVoted = response.data.data.post.voters.some(voter => voter._id === user._id);
        setVoted(hasVoted);
      }
      setLoading(false);
    } catch(error) {
      console.error('Lỗi khi lấy chi tiết bài viết:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);
  useEffect(() => {
    if(post && post.event_id) {
      const countdown = setInterval(() => {
        const endTime = new Date(post.event_id.endTime).getTime(); // Thời gian kết thúc sự kiện
        const now = new Date().getTime(); // Thời gian hiện tại
        const distance = endTime - now;

        if(distance <= 0) {
          clearInterval(countdown);
          setTimeRemaining(0);
        } else {
          setTimeRemaining(distance);
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [post]);

  const formatTime = (time) => {
    if(time === null) return "Loading...";

    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };
  const showVoteModal = () => {
    if(!user) {
      alert("Bạn cần đăng nhập để bình chọn!");
      return;
    }

    if(voted) {
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
      if(response.data.success) {
        setVoted(true);
        message.success('Bình chọn thành công!');
      }
      setIsModalVisible(false);
    } catch(error) {
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
      if(response.data.success) {
        setVoted(false);
        message.success('Hủy bình chọn thành công!');
      }
      setIsCancelModalVisible(false);
    } catch(error) {
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

  if(userLoading || loading) {
    return <div>Loading...</div>;
  }

  if(!post) {
    return <div>Không tìm thấy bài viết.</div>;
  }

  // Kiểm tra trạng thái sự kiện
  const isEventCompleted = post.event_id?.status === 'completed';
  const isVotingEnded = new Date(post.event_id?.votingEndTime) < new Date();
  const isVotingOpen = !isEventCompleted && post.event_id?.votingStatus === 'active';  // Bình chọn chỉ mở khi sự kiện chưa kết thúc và trạng thái bình chọn là 'active'
  const isEventOngoing = post.event_id?.status === 'active'; // Kiểm tra sự kiện đang diễn ra

  return (
    <div className="max-w-screen-lg mx-auto p-6 bg-white h-screen pt-40">
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
          <div className="flex space-x-2 justify-between">
            <span className="bg-blue-600 text-white px-4 py-2 rounded">
              Danh mục: {post.post_category_id?.title || "Không có danh mục"}
            </span>
            <span className="bg-green-600 text-white px-4 py-2 rounded">
              Sự kiện: {post.event_id?.title || "Không có sự kiện"}
            </span>
          </div>
        </div>

        <p className="text-lg">{post.description}</p>

        <div className="mt-6">
          {isEventOngoing ? (
            <div>
              <div className='flex items-center'>
                <Spin spinning={true} tip="Sự kiện đang diễn ra..." size="small" />
                <div className="text-xl mt-4">
                  <p>Thời gian còn lại: {formatTime(timeRemaining)}</p>
                </div>
              </div>
              {/* Nội dung khi sự kiện đang diễn ra */}
              {isVotingOpen ? (
                <>
                  <button
                    onClick={showVoteModal}
                    disabled={voted}
                    className={`px-4 py-2 rounded bg-blue-600 text-white ${voted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    {voted ? 'Đã bình chọn' : 'Bình chọn'}
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
              ) : (
                <p className="text-lg text-gray-600">Bình chọn đã kết thúc</p>
              )}
            </div>
          ) : (
            <p className="text-lg text-gray-600">Sự kiện đã kết thúc.</p>
          )}
        </div>

        {isEventCompleted && post.voters && post.voters.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold">Danh sách người đã bình chọn:</h3>
            <ul className="mt-4">
              {post.voters.map((voter, index) => (
                <li key={index} className="text-lg">{voter.fullName}</li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Hình ảnh:</h3>
          <Row gutter={[16, 16]} className="mt-4">
            {post.images && post.images.length > 0 ? (
              post.images.map((image, index) => (
                <Col span={8} key={index}>
                  <Image
                    src={image}
                    alt={`Post Image ${index + 1}`}
                    preview={true}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover', aspectRatio: '16/9', cursor: 'pointer' }}
                  />
                </Col>
              ))
            ) : (
              <p>Không có hình ảnh bổ sung.</p>
            )}
          </Row>
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
    </div>
  );
};

export default PostDetail;
