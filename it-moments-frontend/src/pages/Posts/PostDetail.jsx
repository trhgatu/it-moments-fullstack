import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Goback from "../../components/Goback";

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`https://dummyjson.com/posts/${id}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
            });
    }, [id]);

    if(!post) return <div>Loading...</div>;

    return (

        <div className="container mx-auto px-4 py-8 pt-32">
            <Goback/>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

                <p className="text-gray-700 mb-6">{post.body}</p>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div className="text-lg flex items-center space-x-4">
                        <div className="text-green-600">
                            👍 {post.reactions.likes} Likes
                        </div>
                        <div className="text-red-600">
                            👎 {post.reactions.dislikes} Dislikes
                        </div>
                    </div>

                    {/* Views */}
                    <div className="text-gray-500 text-sm">
                        👁️ {post.views} Views
                    </div>

                    {/* User ID */}
                    <div className="text-gray-500 text-sm">
                        🧑 User ID: {post.userId}
                    </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Tags:</h2>
                    <div className="flex space-x-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-500 px-2 py-1 rounded-full text-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
