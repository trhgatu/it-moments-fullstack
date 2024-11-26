import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { Modal } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';

const PostAcademicDetail = () => {
  const { slug, category } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [visibleImages, setVisibleImages] = useState(8);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
  }, [slug, category]);

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
      <div className="mt-16 bg-gray-100 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Giới thiệu sự kiện</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg italic bg-yellow-50 p-4 rounded-lg shadow">
              ✍️ {showFullDescription ? post.description : post.description.slice(0, 200) + '...'}
            </p>
            <button
              onClick={toggleDescription}
              className="text-blue-600 mt-4 inline-block"
            >
              {showFullDescription ? 'Xem bớt' : 'Xem thêm'}
            </button>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-2 text-lg">
                <ClockCircleOutlined className="text-blue-600" />
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </li>
              <li className="flex items-center gap-2 text-lg">
                <EnvironmentOutlined className="text-green-600" />
                <span>{post.location || 'Đang cập nhật'}</span>
              </li>
            </ul>
          </div>
          <div>
            <img
              src={post.thumbnail || 'https://via.placeholder.com/150'}
              alt="Event Illustration"
              className="rounded-lg shadow-lg border border-gray-200"
            />
          </div>
        </div>
      </div>
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

      {/* Related Events */}
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
