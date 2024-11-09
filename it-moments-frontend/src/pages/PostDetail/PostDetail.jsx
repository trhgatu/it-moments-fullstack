import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { useClientUser } from '../../context/ClientUserContext';
import { message, Modal, Row, Col, Image, Card, Spin, Input, Button } from 'antd';

const PostDetail = () => {
  const { slug } = useParams();
  const { user, loading: userLoading } = useClientUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [votingTimeRemaining, setVotingTimeRemaining] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [emotion, setEmotion] = useState(null); // Thêm trạng thái cảm xúc

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/detail/${slug}`);
      setPost(response.data.data.post);
      setComments(response.data.data.post.comments || []); // Lấy danh sách bình luận
      if(user && user._id) {
        const hasVoted = response.data.data.post.voters.some(voter => voter._id === user._id);
        setVoted(hasVoted);
      }
      setLoading(false);
    } catch(error) {
      console.error('Lỗi khi tải chi tiết bài đăng:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if(post && post.event_id) {
      const countdown = setInterval(() => {
        const endTime = new Date(post.event_id.endTime).getTime();
        const now = new Date().getTime();
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

  useEffect(() => {
    if(post && post.event_id && post.event_id.votingEndTime) {
      const votingCountdown = setInterval(() => {
        const votingEndTime = new Date(post.event_id.votingEndTime).getTime();
        const now = new Date().getTime();
        const votingDistance = votingEndTime - now;

        if(votingDistance <= 0) {
          clearInterval(votingCountdown);
          setVotingTimeRemaining(0);
        } else {
          setVotingTimeRemaining(votingDistance);
        }
      }, 1000);

      return () => clearInterval(votingCountdown);
    }
  }, [post]);

  const formatTime = (time) => {
    if(time === null) return 'Đang tải...';

    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${hours} giờ ${minutes} phút ${seconds} giây`;
  };

  const showVoteModal = () => {
    if(!user) {
      alert('Bạn cần đăng nhập để bình chọn!');
      return;
    }

    if(voted) {
      message.warning('Bạn đã bình chọn!');
      return;
    }

    setIsModalVisible(true);
  };

  const handleVote = async () => {
    try {
      const response = await axios.post(`${API_URL}/posts/${post._id}/vote`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`,
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
      message.error('Đã xảy ra lỗi khi bình chọn.');
    }
  };

  const handleEmotionClick = (emotion) => {
    setEmotion(emotion); // Cập nhật cảm xúc người dùng đã chọn
    message.success(`Bạn đã chọn cảm xúc: ${emotion}`);
  };

  const handleCommentSubmit = async () => {
    if(!comment.trim()) {
      message.warning('Vui lòng nhập bình luận');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/posts/${post._id}/comment`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if(response.data.success) {
        setComments([...comments, response.data.data.comment]);
        setComment('');
        message.success('Bình luận thành công!');
      }
    } catch(error) {
      console.error('Lỗi khi bình luận:', error.response?.data?.message);
      message.error('Đã xảy ra lỗi khi bình luận.');
    }
  };

  const showCancelVoteModal = () => {
    setIsCancelModalVisible(true);
  };

  const handleCancelVote = async () => {
    try {
      const response = await axios.post(`${API_URL}/posts/${post._id}/cancel-vote`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`,
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
      message.error('Đã xảy ra lỗi khi hủy bình chọn.');
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
    return <div>Đang tải...</div>;
  }

  if(!post) {
    return <div>Không tìm thấy bài đăng.</div>;
  }

  const isEventCompleted = post.event_id?.status === 'completed';
  const isVotingEnded = new Date(post.event_id?.votingEndTime) < new Date();
  const isVotingOpen = !isEventCompleted && post.event_id?.votingStatus === 'active';
  const isEventOngoing = post.event_id?.status === 'active';

  return (
    <div className="max-w-screen-lg mx-auto p-6 bg-white h-screen pt-40">
      {post.video && (
        <Card title="Video" className="mb-8">
          <div className="mt-4">
            <iframe
              width="100%"
              height="450"
              src={`https://www.youtube.com/embed/${post.video.split('v=')[1].split('&')[0]}`}
              title="Video liên quan"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </Card>
      )}

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
            <span className="italic">Bởi {post.accountFullName}</span>
            <span className="text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex space-x-2 justify-between">
            <span className="bg-blue-600 text-white px-4 py-2 rounded">
              Thể loại: {post.post_category_id?.title || 'Không có thể loại'}
            </span>
            <span className="bg-green-600 text-white px-4 py-2 rounded">
              Sự kiện: {post.event_id?.title || 'Không có sự kiện'}
            </span>
          </div>
        </div>

        <p className="text-lg">{post.description}</p>

        <div className="mt-6">
          {isEventOngoing ? (
            <div>
              <div className="flex items-center">
                <Spin spinning={true} tip="Sự kiện đang diễn ra..." size="small" />
                <div className="text-xl mt-4">
                  <p>Thời gian còn lại: {formatTime(timeRemaining)}</p>
                </div>
              </div>
              {isVotingOpen ? (
                <>
                  <div className='flex items-center'>
                    <Spin spinning={true} tip="Bình chọn đang diễn ra" size="small" />
                    <p className="text-lg mt-2 text-gray-800">
                      Thời gian bình chọn còn lại: {formatTime(votingTimeRemaining)}
                    </p>
                  </div>
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

        {/* Cảm xúc */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Chọn cảm xúc của bạn:</h3>
          <div className="flex space-x-4 mt-4">
            <Button onClick={() => handleEmotionClick('😊')}>😊 Vui</Button>
            <Button onClick={() => handleEmotionClick('😢')}>😢 Buồn</Button>
            <Button onClick={() => handleEmotionClick('❤️')}>❤️ Yêu thích</Button>
          </div>
        </div>

        {/* Bình luận */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Bình luận:</h3>
          <Input.TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            rows={4}
          />
          <Button
            type="primary"
            onClick={handleCommentSubmit}
            className="mt-4"
            disabled={!comment.trim()}
          >
            Gửi Bình luận
          </Button>

          <div className="mt-8">
            {comments.length > 0 ? (
              <ul>
                {comments.map((cmt, index) => (
                  <li key={index} className="mb-4">
                    <strong>{cmt.author}</strong>: {cmt.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Chưa có bình luận nào.</p>
            )}
          </div>
        </div>
      </div>

      <Modal
        title="Xác nhận bình chọn"
        visible={isModalVisible}
        onOk={handleVote}
        onCancel={handleVoteModalCancel}
      >
        <p>Bạn có chắc muốn bình chọn cho bài đăng này?</p>
      </Modal>

      <Modal
        title="Xác nhận hủy bình chọn"
        visible={isCancelModalVisible}
        onOk={handleCancelVoteConfirm}
        onCancel={handleCancelVoteModal}
      >
        <p>Bạn có chắc muốn hủy bình chọn cho bài đăng này?</p>
      </Modal>
    </div>
  );
};

export default PostDetail;
