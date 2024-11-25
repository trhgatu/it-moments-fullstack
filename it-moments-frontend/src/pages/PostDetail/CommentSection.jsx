import React, { useState, useRef } from 'react';
import { Input, Button, message } from 'antd';
import { FaUser } from 'react-icons/fa';

const CommentSection = ({
  postId,
  user,
  comments,
  setComments,
  fetchComments,
}) => {
  const commentRefs = useRef({});
  const [comment, setComment] = useState('');
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      message.warning('Vui lòng nhập bình luận');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/comment`,
        { content: comment },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setComments([...comments, response.data.data.comment]);
        setComment('');
        message.success('Bình luận thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi bình luận:', error.response?.data?.message);
      message.error('Đã xảy ra lỗi khi bình luận.');
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      message.warning('Vui lòng nhập phản hồi');
      return;
    }

    const parentComment = comments.find((c) => c._id === replyCommentId);
    if (!parentComment) {
      message.warning('Không tìm thấy bình luận để trả lời!');
      return;
    }

    const toUserId = parentComment.user_id._id;

    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/comment/reply`,
        {
          content: replyContent,
          parentCommentId: replyCommentId,
          toUserId: toUserId,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newReply = response.data.data.reply;

        const updatedComments = comments.map((comment) => {
          if (comment._id === replyCommentId) {
            return {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  ...newReply,
                  user_id: user,
                },
              ],
            };
          }
          return comment;
        });

        setComments(updatedComments);
        setReplyContent('');
        setReplyCommentId(null);
        message.success('Phản hồi thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi phản hồi:', error.response?.data?.message);
      message.error('Đã xảy ra lỗi khi phản hồi.');
    }
  };

  const renderReplies = (replies) => {
    return replies.map((reply) => (
      <div
        key={reply._id}
        ref={(el) => (commentRefs.current[reply._id] = el)}
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
        ref={(el) => (commentRefs.current[comment._id] = el)}
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
          <div className="mt-4">{renderReplies(comment.replies)}</div>
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
            <Button type="primary" onClick={handleReplySubmit} className="mt-2">
              Gửi Phản hồi
            </Button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div>
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
  );
};

export default CommentSection;
