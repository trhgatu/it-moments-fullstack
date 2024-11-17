import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { useClientUser } from '../../context/ClientUserContext';
import { message, Modal, Image, Col, Row } from 'antd';

const PostEventDetail = () => {
  const { slug } = useParams();
  const { user, loading: userLoading } = useClientUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/detail/${slug}`);
      setPost(response.data.data.post);
      console.log(response.data.data.post)

      setLoading(false);
    } catch(error) {
      console.error('Lỗi khi lấy chi tiết bài viết:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const showImageModal = (image) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };
  const handleImageModalCancel = () => {
    setImageModalVisible(false);
    setSelectedImage('');
  };

  if(userLoading || loading) {
    return <div>Loading...</div>;
  }

  if(!post) {
    return <div>Không tìm thấy bài viết.</div>;
  }
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
        <Row gutter={[16, 16]} className="mt-4">
          {post.images && post.images.length > 0 ? (
            post.images.map((image, index) => (
              <Col span={8} key={index}>
                <Image
                  src={image}

                  alt={`Post Image ${index + 1}`}
                  preview={false}
                  onClick={() => showImageModal(image)}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', aspectRatio: '16/9', cursor: 'pointer' }}
                />
              </Col>
            ))
          ) : (
            <p>Không có hình ảnh bổ sung.</p>
          )}
        </Row>
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

      <Modal
        visible={imageModalVisible}
        footer={null}
        onCancel={handleImageModalCancel}
        centered
        width={800}
      >
        <img src={selectedImage} alt="Selected" className="w-full h-auto" />
      </Modal>
    </div>
  );
};

export default PostEventDetail;
