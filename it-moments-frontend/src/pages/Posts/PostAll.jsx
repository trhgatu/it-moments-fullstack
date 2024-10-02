import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

export default function PostAll() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Gọi API bằng Axios
        axios.get('http://localhost:3000/api/v1/posts')
            .then(response => {
                // Giả sử dữ liệu bài viết nằm trong response.data
                setPosts(response.data);
            })
            .catch(error => {
                console.error("Có lỗi xảy ra khi lấy dữ liệu bài viết:", error);
            });
    }, []);

    return (
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen flex items-center justify-center py-12">
            <div className="container mx-auto px-6 py-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Danh sách bài viết</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {posts.map(item => (
                        <div
                            key={item._id} // Sử dụng _id làm key
                            className="border rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 bg-white"
                        >
                            <Link to={`/posts/detail/${item._id}`}>
                                <div className="mb-4">
                                    <img
                                        src={item.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'} // Sử dụng thumbnail hoặc ảnh mặc định
                                        alt={item.title}
                                        className="w-full h-48 object-cover mb-4 rounded-md"
                                    />
                                </div>

                                {/* Tiêu đề bài viết */}
                                <h2 className="text-lg font-semibold mb-2">{item.title}</h2>

                                {/* Mô tả ngắn của bài viết */}
                                <p className="text-gray-600 text-sm mb-4">
                                    {item.description.length > 100
                                        ? item.description.replace(/<[^>]+>/g, '').substring(0, 100) + '...' // Xóa HTML và rút ngắn mô tả
                                        : item.description.replace(/<[^>]+>/g, '')}
                                </p>

                                {/* Hiển thị thông tin chi tiết về bài viết */}
                                <div className="text-gray-600 text-sm mt-4">
                                    <p className="mb-1">🖋️ Người đăng: {item.createdBy.account_id}</p>
                                    <p className="mb-1">📅 Ngày tạo: {new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>

                                {/* Link tới chi tiết bài viết */}
                                <p className="text-blue-500 font-bold mt-4">Xem chi tiết</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
