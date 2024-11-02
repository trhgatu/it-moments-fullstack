import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config/config';
import { useClientUser } from '../../context/ClientUserContext';
import { message } from 'antd';

const PostDetail = () => {
  const { slug } = useParams();
  const { user, loading: userLoading } = useClientUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(false);
  const [votersList, setVotersList] = useState([]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/detail/${slug}`);
      setPost(response.data);
      setVotes(response.data.votes);
      setVotersList(response.data.voters || []);

      // Kiểm tra xem người dùng hiện tại đã bình chọn chưa
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

  const handleVote = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để bình chọn!");
      return;
    }

    if (voted) {
      message.warning('Bạn đã bình chọn rồi!');
      return; // Ngăn không cho bình chọn lại
    }

    try {
      const response = await axios.post(`${API_URL}/posts/${post._id}/vote`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        withCredentials: true,
      });
      if (response.data.success) {
        setVotes(response.data.data.votes);
        setVoted(true); // Đánh dấu đã bình chọn

        // Chỉ lưu vào Local Storage nếu user._id có giá trị
        if (user && user._id) {
          const userVoteKey = `voted_${post._id}_${user._id}`;
          localStorage.setItem(userVoteKey, 'true');
        }

        // Cập nhật danh sách người bình chọn
        const newVoter = { fullName: user.fullName, _id: user._id };
        setVotersList(prev => [...prev, newVoter]);

        message.success('Bình chọn thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi bình chọn:', error.response?.data?.message);
      message.error('Có lỗi xảy ra trong quá trình bình chọn.');
    }
  };

  if (userLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
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
            <span className="italic">By {post.createdBy.account_id}</span>
            <span className="text-gray-600">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <span className="bg-blue-600 text-white px-4 py-2 rounded">Danh mục: {post.post_category_id?.title || "Không có danh mục"}</span>
        </div>

        <p className="text-lg">{post.description}</p>

        <div className="mt-6">
          <button
            onClick={handleVote}
            disabled={voted}
            className={`px-4 py-2 rounded bg-blue-600 text-white ${voted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {voted ? 'Bạn đã bình chọn' : 'Bình chọn'}
          </button>
          <span className="ml-4 text-lg">
            {votes} {votes === 1 ? 'lượt bình chọn' : 'lượt bình chọn'}
          </span>
        </div>

        {/* Hiển thị danh sách người đã bình chọn chỉ khi người dùng đã bình chọn */}
        {voted && votersList.length > 0 && (
          <div className="mt-4 text-lg">
            <strong>Danh sách người đã bình chọn:</strong>
            <ul className="list-disc pl-5">
              {votersList.map((voter) => (
                <li key={voter._id}>{voter.fullName}</li>
              ))}
            </ul>
          </div>
        )}

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

      <div className="mt-12">
        <h3 className="text-2xl font-semibold">Bài viết liên quan</h3>
        <div className="flex space-x-8 mt-8">
          {/* Ví dụ hiển thị bài viết liên quan */}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
