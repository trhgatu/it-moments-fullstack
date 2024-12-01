import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { message, Modal, Row, Col, Input, Button, Spin, Image } from 'antd';
import { useClientUser } from '../../context/ClientUserContext';
import styles from './PostAcademicDetail.module.scss';
const PostAcademicDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const commentId = query.get('commentId');
  const commentRefs = useRef({})
  const { user, loading: userLoading } = useClientUser();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [visibleImages, setVisibleImages] = useState(8);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/detail/${slug}`);
      const postData = response.data.data.post;
      setPost(postData);
      setLoading(false);
    } catch(error) {
      console.error('Error fetching post details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);
  if(userLoading || loading) {
    return <div className="flex justify-center items-center min-h-64">
      <Spin size="large" />
    </div>;
  }
  if(!post) {
    return <div>Không tìm thấy bài đăng.</div>;
  }
  const showImageModal = (image) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const handleImageModalCancel = () => {
    setImageModalVisible(false);
    setSelectedImage('');
  };

  const loadMoreImages = () => {
    setVisibleImages((prev) => prev + 8);
  };

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  if(loading) {
    return <div>Loading...</div>;
  }

  if(!post) {
    return <div>Không tìm thấy bài viết.</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto p-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="relative w-full h-[70vh]">
        <img
          src={post.thumbnail || 'https://via.placeholder.com/150'}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">{post.title}</h1>
          <div className="flex flex-col md:flex-row md:gap-8 gap-4 text-lg">
            <span className="flex items-center gap-2">
              <ClockCircleOutlined className="text-white text-xl" />
              {new Date(post.createdAt).toLocaleString()}
            </span>
            <span className="flex items-center gap-2">
              <EnvironmentOutlined className="text-white text-xl" />
              {post.location || 'Đang cập nhật'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-gray-100 p-8 rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
          Giới thiệu sự kiện
        </h2>
        <div className="flex flex-col gap-6">
          <div className="relative">
            <p
              dangerouslySetInnerHTML={{
                __html: showFullDescription
                  ? post.description
                  : post.description.slice(0, 400) + '...',
              }}
              className="text-lg leading-relaxed text-gray-700"
            ></p>
            <button
              onClick={toggleDescription}
              className="mt-4 text-blue-600 font-medium border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition"
            >
              {showFullDescription ? 'Xem bớt' : 'Xem thêm'}
            </button>
          </div>
          <div className="mt-6 border-t border-gray-300 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <ClockCircleOutlined className="text-blue-600 text-2xl" />
              <span className="text-lg font-semibold text-gray-800">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <EnvironmentOutlined className="text-green-600 text-2xl" />
              <span className="text-lg font-semibold text-gray-800">
                {post.location || 'Đang cập nhật'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Khoảnh khắc sự kiện */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Khoảnh khắc sự kiện</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {post.images?.slice(0, visibleImages).map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => showImageModal(image)}
            >
              <img
                src={image}
                alt={`Event Image ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm font-semibold">Khoảnh khắc {index + 1}</p>
              </div>
            </div>
          ))}
        </div>
        {post.images?.length > visibleImages && (
          <button
            onClick={loadMoreImages}
            className="mt-6 block mx-auto px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
          >
            Xem thêm
          </button>
        )}
      </div>

      {/* Video Section */}
      {post.video && (
        <div className="mt-16 bg-gray-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-4">
            Khoảnh khắc đáng nhớ nhất
          </h2>
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${post.video.split('v=')[1]?.split('&')[0]}`}
            title="Highlight Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      )}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Sự kiện liên quan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {post.relatedEvents?.map((event, index) => (
            <div
              key={index}
              className="relative group cursor-pointer bg-white p-4 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              <img
                src={event.thumbnail}
                alt={`Event ${index + 1}`}
                className="w-full h-40 object-cover rounded-md"
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
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
        visible={imageModalVisible}
        footer={null}
        onCancel={handleImageModalCancel}
        centered
        width={800}
      >
        <img src={selectedImage} alt="Selected" className="w-full h-auto rounded-lg" />
      </Modal>
    </div>
  );
};

export default PostAcademicDetail;
