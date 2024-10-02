import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Goback from "../../components/Goback";

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState(0); // Trạng thái cho số lượt thích
    const [comments, setComments] = useState([]); // Trạng thái cho bình luận mới

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/posts/detail/${id}`);
                setPost(response.data);
                setLikes(response.data.likes || 0); // Giả sử response có thuộc tính 'likes'
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Could not load the post. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleLike = () => {
        setLikes(likes + 1); // Tăng số lượt thích
    };

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        const newComment = event.target.comment.value; // Lấy giá trị bình luận từ input
        if (newComment) {
            setComments([...comments, newComment]); // Thêm bình luận vào danh sách
            event.target.reset(); // Đặt lại form
        }
    };

    if (loading) return <div className="text-center text-gray-500">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-72 py-8 pt-32">
            <Goback />
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                    <img
                        src="https://via.placeholder.com/40" // Placeholder for user avatar
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                        <h2 className="font-semibold text-lg text-gray-800">User Name</h2>
                        <p className="text-gray-500 text-sm">Date & Time</p>
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{post.title}</h1>

                {/* Description */}
                <div className="mb-6 text-gray-700 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: post.description }} />

                {/* Thumbnail */}
                {/* {post.thumbnail && (
                    <img
                        src={post.thumbnail}
                        alt="Thumbnail"
                        className="h-48 w-full object-cover rounded-lg mb-4 shadow-md"
                    />
                )} */}

                {/* Video */}
                {post.video && (
                    <div className="mb-6 h-96">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Video:</h2>
                        <iframe
                            className="w-full h-full rounded-lg shadow-md border border-gray-200"
                            src={`https://www.youtube.com/embed/${post.video.split('v=')[1].split('&')[0]}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                )}

                {/* Images */}
                {post.images && post.images.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Images:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {post.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg shadow-md border border-gray-200"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Tags:</h2>
                        <div className="flex flex-wrap space-x-2">
                            {post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium shadow-md transition-transform duration-200 hover:scale-105"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Like and Share Buttons */}
                <div className="flex items-center mb-6">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mr-4"
                        onClick={handleLike}
                    >
                        Like ({likes})
                    </button>
                    <button
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
                    >
                        Share
                    </button>
                </div>

                {/* Comment Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Comments:</h2>
                    <form onSubmit={handleCommentSubmit} className="flex mb-4">
                        <input
                            type="text"
                            name="comment"
                            placeholder="Write a comment..."
                            className="flex-grow border border-gray-300 rounded-md p-2 mr-2"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                            Post
                        </button>
                    </form>
                    <div>
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className="border-b border-gray-200 py-2">
                                    <p className="text-gray-700">{comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No comments yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
