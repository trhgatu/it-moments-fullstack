import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PostAll() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('https://dummyjson.com/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data.posts);
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 pt-32">
            <h1 className="text-2xl font-bold mb-6 text-center">Danh sách bài viết</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.map(item => (
                    <div
                        key={item.id}
                        className="border rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 bg-white"
                    >
                        <Link to={"/posts/" + item.id}>
                            <div className="mb-4">
                                <img
                                    src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(item.title)}`}
                                    alt={item.title}
                                    className="w-full h-48 object-cover mb-4 rounded-md"
                                />
                            </div>

                            {/* Tiêu đề bài viết */}
                            <h2 className="text-lg font-semibold mb-2">{item.title}</h2>

                            {/* Mô tả ngắn của bài viết */}
                            <p className="text-gray-600 text-sm mb-4">
                                {item.body.length > 100 ? item.body.substring(0, 100) + '...' : item.body}
                            </p>

                            {/* Hiển thị thông tin chi tiết về bài viết */}
                            <div className="text-gray-600 text-sm mt-4">
                                <p className="mb-1">👁️ Lượt xem: {item.views}</p>
                                <p className="mb-1">👍 Thích: {item.reactions.likes} | 👎 Không thích: {item.reactions.dislikes}</p>
                                <p>🖋️ Người đăng: {item.userId}</p>
                            </div>

                            {/* Link tới chi tiết bài viết */}
                            <p className="text-blue-500 font-bold mt-4">Xem chi tiết</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
