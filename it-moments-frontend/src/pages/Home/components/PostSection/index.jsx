import React from 'react';

const PostSection = ({ postData, activeTab, setActiveTab }) => {
    const MAX_TITLE_LENGTH = 30;

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.slice(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };

    return (
        <div className="w-full min-h-[400px]">
            <div className="grid grid-cols-3 gap-2 border-b-2 pb-2 mb-4">
                {Object.keys(postData).map((tab, index) => (
                    <button
                        key={index}
                        className={`text-center py-2 px-4 font-semibold transition duration-300 ease-in-out ${
                            activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 hover:bg-blue-200 hover:text-gray-800'
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {postData[activeTab]?.slice(0, 3).map((post, index) => (
                    <div
                        key={index}
                        className="p-4 bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-start"
                    >
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-24 h-24 object-cover mr-4"
                        />
                        <div className="flex flex-col flex-grow">
                            <h4 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition duration-300 ease-in-out">
                                {truncateTitle(post.title)}
                            </h4>
                            <p className="text-gray-600 text-sm">
                                {post.description.slice(0, 100)}...
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostSection;
