import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To get the post ID from the URL
import Gravatar from 'react-gravatar';

const PostDetail = () => {
  const { id } = useParams(); // Get the post ID from the route
  const [post, setPost] = useState(null); // State to store the post data
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/posts/detail/${id}`); // Fetch post data by ID
        setPost(response.data); // Set the fetched post data
        console.log(response.data);
        setLoading(false); // Stop loading
      } catch(error) {
        console.error('Error fetching post details:', error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchPost(); // Fetch the post details when the component mounts
  }, [id]);

  if(loading) {
    return <div>Loading...</div>;
  }

  if(!post) {
    return <div>Post not found.</div>;
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

      {/* Post Content */}
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

        {/* Quote */}
        <blockquote className="mt-6 border-l-4 border-blue-500 pl-4 italic text-gray-700">
          "A well-optimized website can improve both user experience and conversion rates."
        </blockquote>

        {/* Display images if available */}
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
            <p>No additional images available.</p>
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
              title="Related Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}



      {/* Related Posts Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold">Related Posts</h3>
        {/* Static related posts as placeholders */}
        <div className="flex space-x-8 mt-8">
          {/* Example of rendering static related posts */}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
