import React, { useState, useRef } from 'react';
import styles from './PostDetail.module.scss';
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
    <div className={styles.postDetail}>
      <div className={styles.headerImage} onClick={openLightbox}>
        <img src={slider1} alt="Post Title" className={styles.hoverEffect} />
      </div>

      {lightboxOpen && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <img src={slider1} alt="Post Title" className={styles.lightboxImage} />
          <span className={styles.closeButton} onClick={closeLightbox}>
            &times;
          </span>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.articleHeader}>
          <h1 className={styles.title}>Cách tối ưu hóa hiệu suất website của bạn</h1>
          <div className={styles.metaInfo}>
            <span className={styles.author}>Bởi John Doe</span>
            <span className={styles.date}>September 28, 2024</span>
          </div>
          <span className={styles.category}>Web Development</span>
        </div>

        <p>
          Website của bạn có đang tải chậm không? Hiệu suất kém có thể ảnh hưởng nghiêm
          trọng đến trải nghiệm người dùng...
        </p>

        <div className={styles.secondaryImage}>
          <img src={slider2} alt="Image Optimization" className={styles.hoverEffect} />
        </div>
      </div>

      <div
        className={styles.reactionContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.heartIcon}>
          {selectedReaction ? <span>{selectedReaction}</span> : '♡'}
          {showReactions && (
            <div className={`${styles.reactionMenu} ${styles.fadeIn}`}>
              <button onClick={() => handleReaction('👍')} className={`${styles.reactionButton} ${animateReaction === '👍' ? styles.animate : ''}`}>
                👍
              </button>
              <button onClick={() => handleReaction('❤️')} className={`${styles.reactionButton} ${animateReaction === '❤️' ? styles.animate : ''}`}>
                ❤️
              </button>
              <button onClick={() => handleReaction('😂')} className={`${styles.reactionButton} ${animateReaction === '😂' ? styles.animate : ''}`}>
                😂
              </button>
              <button onClick={() => handleReaction('😢')} className={`${styles.reactionButton} ${animateReaction === '😢' ? styles.animate : ''}`}>
                😢
              </button>
              <button onClick={() => handleReaction('😡')} className={`${styles.reactionButton} ${animateReaction === '😡' ? styles.animate : ''}`}>
                😡
              </button>
            </div>
          )}
        </div>

        <div className={styles.commentIcon} onClick={toggleComments}>
          💬
        </div>
      </div>

      {commentsVisible && (
        <div className={styles.commentsSection}>
          <h3>Comments</h3>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <Gravatar email={comment.email} className={styles.avatar} />
              <div className={styles.commentContent}>
                <p>
                  <strong>{comment.name}</strong>
                </p>
                <p>{comment.content}</p>
                <div className={styles.commentActions}>
                  <button onClick={() => handleLike(comment.id)}>
                    {comment.likes > 0 ? (
                      <span className={styles.liked}>❤️ {comment.likes}</span>
                    ) : (
                      <span>♡ Thích</span>
                    )}
                  </button>
                  <button>Trả lời</button>
                </div>

                {comment.replies.length > 0 && (
                  <>
                    <button className={styles.toggleRepliesButton} onClick={() => toggleReplies(comment.id)}>
                      {expandedReplies[comment.id] ? 'Ẩn câu trả lời' : `Hiện ${comment.replies.length} câu trả lời`}
                    </button>

                    {expandedReplies[comment.id] && (
                      <div className={styles.replies}>
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className={styles.reply}>
                            <Gravatar email={reply.email} className={styles.avatar} />
                            <div className={styles.replyContent}>
                              <p>
                                <strong>{reply.name}</strong>
                              </p>
                              <p>{reply.content}</p>
                              <div className={styles.commentActions}>
                                <button onClick={() => handleLike(comment.id, reply.id)}>
                                  {reply.likes > 0 ? (
                                    <span className={styles.liked}>❤️ {reply.likes}</span>
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

      <div className={styles.relatedPosts}>
        <h3>Bài viết liên quan</h3>
        <div className={styles.relatedPostsGrid}>
          {relatedPosts.map((post) => (
            <div key={post.id} className={styles.relatedPost}>
              <img src={post.image} alt={post.title} className={styles.relatedPostImage} />
              <p className={styles.relatedPostTitle}>{post.title}</p>
              <p className={styles.relatedPostDescription}>{post.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
