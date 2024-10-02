import React, { useState, useRef } from 'react';
import slider1 from '../../assets/images/slider_1.jpg';
import slider2 from '../../assets/images/slider_2.jpg';
import Gravatar from 'react-gravatar';

const PostDetail = () => {
  const [showReactions, setShowReactions] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(true);
  const reactionTimeout = useRef(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState('');
  const [animateReaction, setAnimateReaction] = useState('');

  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      likes: 1,
      replies: [
        {
          id: 3,
          name: 'Jane Smith',
          email: 'janesmith@example.com',
          content: 'Cảm ơn bạn về thông tin hữu ích!',
          likes: 2,
        },
      ],
    },
    {
      id: 2,
      name: 'Alex Smith',
      email: 'alexsmith@example.com',
      content: 'Vivamus blandit libero eu magna pellentesque.',
      likes: 0,
      replies: [],
    },
  ]);

  const [reactions, setReactions] = useState({
    like: 10,
    love: 5,
    haha: 3,
    sad: 1,
    angry: 0,
  });

  const handleReaction = (type) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [type]: prevReactions[type] + 1,
    }));
    setSelectedReaction(type);
    setAnimateReaction(type);
    setShowReactions(false);

    setTimeout(() => {
      setAnimateReaction('');
    }, 300);
  };

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  const handleMouseEnter = () => {
    clearTimeout(reactionTimeout.current);
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    reactionTimeout.current = setTimeout(() => {
      setShowReactions(false);
    }, 300);
  };

  const handleLike = (commentId, replyId = null) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: replyId
                ? comment.replies.map((reply) =>
                    reply.id === replyId
                      ? { ...reply, likes: reply.likes + 1 }
                      : reply
                  )
                : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prevExpandedReplies) => ({
      ...prevExpandedReplies,
      [commentId]: !prevExpandedReplies[commentId],
    }));
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const relatedPosts = [
    { id: 1, image: slider1, title: 'Bài viết liên quan 1', description: 'Mô tả ngắn gọn cho bài viết liên quan 1' },
    { id: 2, image: slider2, title: 'Bài viết liên quan 2', description: 'Mô tả ngắn gọn cho bài viết liên quan 2' },
    { id: 3, image: slider1, title: 'Bài viết liên quan 3', description: 'Mô tả ngắn gọn cho bài viết liên quan 3' },
  ];

  return (
    <div className="max-w-screen-lg mx-auto p-6 bg-white h-screen overflow-y-scroll">
      {/* Hình ảnh đầu bài viết */}
      <div className="cursor-pointer" onClick={openLightbox}>
        <img src={slider1} alt="Post Title" className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300 shadow-lg" />
      </div>

      {/* Lightbox mở rộng hình ảnh */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50" onClick={closeLightbox}>
          <img src={slider1} alt="Post Title" className="max-w-4xl max-h-[90%] rounded-lg" />
          <span className="absolute top-5 right-5 text-white text-4xl cursor-pointer" onClick={closeLightbox}>&times;</span>
        </div>
      )}

      {/* Nội dung bài viết */}
      <div className="mt-6 leading-relaxed text-gray-900">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 text-black">Cách tối ưu hóa hiệu suất website của bạn</h1>
          <div className="flex justify-between text-lg text-gray-700 mb-3">
            <span className="italic">Bởi John Doe</span>
            <span className="text-gray-600">September 28, 2024</span>
          </div>
          <span className="bg-blue-600 text-white text-sm px-4 py-2 rounded">Web Development</span>
        </div>

        <p className="text-lg">
          Website của bạn có đang tải chậm không? Hiệu suất kém có thể ảnh hưởng nghiêm trọng đến trải nghiệm người dùng...
        </p>

        {/* Phần trích dẫn */}
        <blockquote className="mt-6 border-l-4 border-blue-500 pl-4 italic text-gray-700">
          "Một website nhanh và hiệu quả không chỉ cải thiện trải nghiệm người dùng mà còn có thể tăng tỷ lệ chuyển đổi và doanh thu."
        </blockquote>

        {/* Hình ảnh phụ và chú thích */}
        <div className="mt-8">
          <img src={slider2} alt="Image Optimization" className="w-full h-80 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
          <p className="text-sm text-gray-600 mt-2 italic text-center">Chú thích: Hình ảnh mô tả quá trình tối ưu hóa hình ảnh cho website.</p>
        </div>
      </div>

      {/* Phần cảm xúc và bình luận */}
      <div
        className="flex items-center mt-6 space-x-8 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="text-4xl cursor-pointer transition-transform transform hover:scale-125">
          {selectedReaction ? <span>{selectedReaction}</span> : '♡'}
          {showReactions && (
            <div className="absolute -top-16 left-0 bg-white rounded-full shadow-lg flex space-x-3 p-3 z-10 transition-all duration-300 opacity-100 transform translate-y-0 hover:bg-opacity-75">
              {['👍', '❤️', '😂', '😢', '😡'].map((reaction) => (
                <button
                  key={reaction}
                  onClick={() => handleReaction(reaction)}
                  className={`text-3xl ${animateReaction === reaction ? 'animate-bounce' : ''} transition-transform transform hover:scale-110`}
                >
                  {reaction}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-4xl cursor-pointer transition-transform transform hover:scale-125" onClick={toggleComments}>
          💬
        </div>
      </div>

      {/* Bình luận */}
      {commentsVisible && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-8">Comments</h3>
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start mb-6 p-6 border-b border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm">
              <Gravatar email={comment.email} className="rounded-full w-14 h-14 mr-6" />
              <div className="flex-grow">
                <p className="font-semibold text-lg">{comment.name}</p>
                <p className="text-gray-700">{comment.content}</p>
                <div className="flex space-x-6 mt-4 text-lg text-gray-600">
                  <button onClick={() => handleLike(comment.id)}>
                    {comment.likes > 0 ? (
                      <span className="text-red-500 font-bold">❤️ {comment.likes}</span>
                    ) : (
                      <span>♡ Thích</span>
                    )}
                  </button>
                  <button>Trả lời</button>
                </div>

                {comment.replies.length > 0 && (
                  <>
                    <button className="text-blue-600 mt-3" onClick={() => toggleReplies(comment.id)}>
                      {expandedReplies[comment.id] ? 'Ẩn câu trả lời' : `Hiện ${comment.replies.length} câu trả lời`}
                    </button>

                    {expandedReplies[comment.id] && (
                      <div className="ml-12 mt-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start mb-6 p-6 border-b border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm">
                            <Gravatar email={reply.email} className="rounded-full w-12 h-12 mr-6" />
                            <div className="flex-grow">
                              <p className="font-semibold text-lg">{reply.name}</p>
                              <p className="text-gray-700">{reply.content}</p>
                              <div className="flex space-x-6 mt-4 text-lg text-gray-600">
                                <button onClick={() => handleLike(comment.id, reply.id)}>
                                  {reply.likes > 0 ? (
                                    <span className="text-red-500 font-bold">❤️ {reply.likes}</span>
                                  ) : (
                                    <span>♡ Thích</span>
                                  )}
                                </button>
                                <button>Trả lời</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bài viết liên quan */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold">Bài viết liên quan</h3>
        <div className="flex space-x-8 mt-8">
          {relatedPosts.map((post) => (
            <div key={post.id} className="w-56 text-center hover:scale-105 transition-transform duration-300">
              <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded-lg shadow-lg" />
              <p className="mt-4 font-bold text-lg text-gray-800">{post.title}</p>
              <p className="mt-3 text-sm text-gray-600">{post.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
