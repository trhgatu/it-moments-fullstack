import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { useClientUser } from '../../context/ClientUserContext';
import { message, Modal, Row, Col, Input, Button, Spin, Image, Tag, Badge } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from 'react-icons/fa';
import RelatedPosts from './RelatedPosts';
import styles from './PostDetail.module.scss';

const PostDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search);
  const commentId = query.get('commentId');
  const commentRefs = useRef({})
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
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [startTimeRemaining, setStartTimeRemaining] = useState(null);

  useEffect(() => {
    if(commentId && commentRefs.current[commentId]) {
      const commentElement = commentRefs.current[commentId];
      if(commentElement) {
        commentElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        commentElement.classList.add(styles.flashEffect);

        setTimeout(() => {
          commentElement.classList.remove(styles.flashEffect);
        }, 1000);
      }
    }
  }, [commentId, comments]);

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
      console.error('Lỗi khi tải chi tiết bài đăng:', error);
      navigate('/404');
      setLoading(false);
    }
  };
  useEffect(() => {
    const increaseViewCount = async () => {
      if(!post?._id) return;
      try {
        await axios.post(`${API_URL}/posts/${post._id}/increment-views`);
      } catch(error) {
        console.error("Lỗi khi tăng lượt xem:", error);
      }
    };

    increaseViewCount();
  }, [post?._id]);


  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/${post._id}/comments`);
      setComments(response.data.data.comments || []);
    } catch(error) {
      console.error('Lỗi khi tải bình luận:', error);
    }
  };
  useEffect(() => {
    if(post) {
      fetchComments();
    }
  }, [post]);
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
  useEffect(() => {
    if(post && post.event_id && post.event_id.startTime) {
      const countdown = setInterval(() => {
        const startTime = new Date(post.event_id.startTime).getTime();
        const now = new Date().getTime();
        const distance = startTime - now;
        if(distance <= 0) {
          clearInterval(countdown);
          setStartTimeRemaining(0);
        } else {
          setStartTimeRemaining(distance);
        }
      }, 1000);

      return () => clearInterval(countdown);
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
      const response = await axios.post(
        `${API_URL}/posts/${post._id}/vote`,
        null,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        }
      );
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
  const showCancelVoteModal = () => {
    setIsCancelModalVisible(true);
  };
  const handleCancelVote = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${post._id}/cancel-vote`,
        null,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        }
      );
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

  const handleCommentSubmit = async () => {
    if(!comment.trim()) {
      message.warning('Vui lòng nhập bình luận');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/posts/${post._id}/comment`,
        { content: comment },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true
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

  const handleReplySubmit = async () => {
    if(!replyContent.trim()) {
      message.warning('Vui lòng nhập phản hồi');
      return;
    }

    const parentComment = comments.find(c => c._id === replyCommentId);
    if(!parentComment) {
      message.warning('Không tìm thấy bình luận để trả lời!');
      return;
    }

    const toUserId = parentComment.user_id._id;

    try {
      const response = await axios.post(
        `${API_URL}/posts/${post._id}/comment/reply`,
        {
          content: replyContent,
          parentCommentId: replyCommentId,
          toUserId: toUserId
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true
        }
      );

      if(response.data.success) {
        const newReply = response.data.data.reply;

        // Cập nhật mảng comments với phản hồi mới và thêm thông tin người dùng vào đó
        const updatedComments = comments.map((comment) => {
          if(comment._id === replyCommentId) {
            return {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  ...newReply, // Thêm dữ liệu phản hồi đã nhận từ API
                  user_id: user  // Gắn thêm thông tin người dùng vào phản hồi
                }
              ]
            };
          }
          return comment;
        });

        setComments(updatedComments);
        setReplyContent('');
        setReplyCommentId(null);
        message.success('Phản hồi thành công!');
      }
    } catch(error) {
      console.error('Lỗi khi phản hồi:', error.response?.data?.message);
      message.error('Đã xảy ra lỗi khi phản hồi.');
    }
  };

  const renderReplies = (replies) => {
    return replies.map((reply) => (
      <div
        key={reply._id}
        ref={(el) => commentRefs.current[reply._id] = el}
        className="ml-6 border-l-2 border-gray-200 pl-4 mt-4"
      >
        <div className="flex items-start space-x-4">
          {reply.user_id?.avatar ? (
            <img
              src={reply.user_id.avatar}
              className="rounded-full w-10 h-10"
              alt="user-avatar"
            />
          ) : (
            <FaUser className="w-10 h-10 text-gray-400 rounded-full border" />
          )}
          <div className="bg-gray-50 rounded-lg p-4 w-full">
            <strong className="block text-lg">{reply.user_id?.fullName || 'Người dùng'}</strong>
            <p className="text-gray-700 mt-2">{reply.content}</p>
          </div>
        </div>
      </div>
    ));
  };

  const renderComments = () => {
    return comments.map((comment) => (
      <div
        key={comment._id}
        ref={(el) => commentRefs.current[comment._id] = el}
        className="mb-6"
      >
        <div className="flex items-start space-x-4">
          {comment.user_id?.avatar ? (
            <img
              src={comment.user_id.avatar}
              className="rounded-full w-12 h-12"
              alt={`${comment.user_id.fullName || 'Người dùng'}'s avatar`}
            />
          ) : (
            <FaUser className="w-12 h-12 text-gray-400 rounded-full border" />
          )}
          <div className="bg-gray-50 rounded-lg p-4 w-full">
            <strong className="block text-lg">{comment.user_id?.fullName || 'Người dùng'}</strong>
            <p className="text-gray-700 mt-2">{comment.content}</p>
            <Button
              onClick={() => setReplyCommentId(comment._id)}
              className="mt-2 text-blue-600"
              type="link"
            >
              Trả lời
            </Button>
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {renderReplies(comment.replies)}
          </div>
        )}
        {replyCommentId === comment._id && (
          <div className="mt-4 ml-6">
            <Input.TextArea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              placeholder="Nhập phản hồi của bạn..."
              className="w-full"
            />
            <Button
              type="primary"
              onClick={handleReplySubmit}
              className="mt-2"
            >
              Gửi Phản hồi
            </Button>
          </div>
        )}
      </div>
    ));
  };




  if(userLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <Spin size="large" />
    </div>
  }
  if(!post) {
    return <div>Không tìm thấy bài đăng.</div>;
  }
  const isEventCompleted = post.event_id?.status === 'completed';
  const isVotingEnded = new Date(post.event_id?.votingEndTime) < new Date();
  const isVotingOpen = !isEventCompleted && post.event_id?.votingStatus === 'active';
  const isEventOngoing = post.event_id?.status === 'active';
  const isEventNotStarted = post.event_id?.status === 'pending';

  return (
    <div className="max-w-screen-2xl mx-auto pt-36 pb-36">
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <div className="bg-white rounded-xl p-12">
            <div className="flex justify-between mb-4">
              <div className="flex text-2xl mb-3 items-center">
                <img className="rounded-full w-20 h-20" src={post.accountAvatar}></img>
                <strong className="ml-4">{post.accountFullName}</strong>
              </div>
              <div className="flex items-center">
                <FaRegCalendarAlt className="mr-2" />
                <span className="text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="border p-8 rounded-3xl">
              <div className="mt-6 leading-relaxed text-gray-900">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-4 text-black leading-10">{post.title}</h1>
                  <div className="space-x-2 flex  items-center ">
                    <Badge className="bg-blue-600 text-white text-2xl px-4 py-2 rounded-full">
                      {post.post_category_id?.title || 'Không có thể loại'}
                    </Badge>
                    <Badge className="bg-green-600 text-white text-2xl px-4 py-2 rounded-full">
                      {post.event_id?.title || 'Không có sự kiện'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-6">
                  {isEventNotStarted ? (
                    <div className='flex items-center'>
                      <div className="flex items-center">
                        <Spin spinning={true} tip="Sự kiện chưa bắt đầu..." size="small" />
                        <Tag className='text-black ml-2 text-xl' color='blue'>
                          Sự kiện bắt đầu sau: {formatTime(startTimeRemaining)}
                        </Tag>
                      </div>
                    </div>
                  ) : isEventOngoing ? (
                    <div className='flex items-center justify-between'>
                      <div className="flex items-center ">
                        <Tag color='green'>
                          Thời gian còn lại của sự kiện: {formatTime(timeRemaining)}
                        </Tag>
                      </div>
                      {isVotingOpen ? (
                        <div className='flex items-center'>
                          <div className="flex items-center">
                            <Tag color='green'>
                              Thời gian bình chọn còn lại: {formatTime(votingTimeRemaining)}
                            </Tag>
                          </div>
                          <button
                            onClick={showVoteModal}
                            disabled={voted}
                            className={`flex items-center space-x-2 px-4 py-2 rounded bg-blue-600 text-white ${voted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                          >
                            <div className="flex items-center justify-center w-6 h-6 rounded-full">
                              <CheckOutlined className={`text-${voted ? 'black' : 'white'}`} />
                            </div>
                            <span>{voted ? 'Đã bình chọn' : 'Bình chọn'}</span>
                          </button>

                          {voted && (
                            <button
                              onClick={showCancelVoteModal}
                              className="flex items-center space-x-2 ml-4 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                            >
                              <div className="flex items-center justify-center w-6 h-6 rounded-full">
                                <CloseOutlined className="text-white" />
                              </div>
                              <span>Hủy bình chọn</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <Tag color='red'>Bình chọn đã kết thúc</Tag>
                      )}
                    </div>
                  ) : (
                    <Tag color='red'>Sự kiện đã kết thúc.</Tag>
                  )}
                </div>
                {post.video && (
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
                )}
                <div className='text-2xl pt-6'
                  dangerouslySetInnerHTML={{
                    __html: post.description,
                  }}
                />
                <h3 className="text-2xl py-6">Hình ảnh bài viết:</h3>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Image
                      src={post.thumbnail || 'https://via.placeholder.com/150'}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        aspectRatio: '16/9',
                      }}
                      preview={true}
                    />
                  </Col>

                  <Col span={12}>
                    <Row gutter={[16, 16]}>
                      {post.images && post.images.length > 0 ? (
                        post.images.map((image, index) => (
                          <Col span={8} key={index}>
                            <Image
                              src={image}
                              alt={`Post Image ${index + 1}`}
                              preview={true}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                aspectRatio: '16/9',
                              }}
                            />
                          </Col>
                        ))
                      ) : (
                        <p>Không có hình ảnh bổ sung.</p>
                      )}
                    </Row>
                  </Col>
                </Row>
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-semibold">Bình luận:</h3>
                {user ? (
                  <>
                    <Input.TextArea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={`Trả lời dưới tên ${user.fullName}`}
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
                  </>
                ) : (
                  <div className="mt-4">
                    <p className="text-lg text-gray-600">Bạn cần đăng nhập để bình luận.</p>
                    <Button
                      type="primary"
                      onClick={() => {
                        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </div>
                )}
                <div className="mt-8">
                  {comments.length > 0 ? renderComments() : <p>Chưa có bình luận nào.</p>}
                </div>
              </div>
              <Modal
                title="Xác nhận bình chọn"
                visible={isModalVisible}
                onCancel={handleVoteModalCancel}
                footer={[
                  <Button key="back" onClick={handleVoteModalCancel}>
                    Hủy
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleVote}>
                    Xác nhận
                  </Button>,
                ]}
              >
                <p>Bạn có chắc chắn muốn bình chọn cho bài viết này không?</p>
              </Modal>

              {/* Modal for Cancel Vote */}
              <Modal
                title="Hủy bình chọn"
                visible={isCancelModalVisible}
                onCancel={handleCancelVoteModal}
                footer={[
                  <Button key="back" onClick={handleCancelVoteModal}>
                    Hủy
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleCancelVoteConfirm}>
                    Xác nhận
                  </Button>,
                ]}
              >
                <p>Bạn có chắc chắn muốn hủy bình chọn cho bài viết này không?</p>
              </Modal>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          {post.event_id ? (
            <RelatedPosts eventId={post.event_id._id} />
          ) : (
            <p className="text-gray-500 italic">Không có sự kiện liên quan.</p>
          )}
        </div>

      </div>
    </div>

  );
};

export default PostDetail;