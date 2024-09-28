import React from 'react';

const PostTabs = ({ postData, activeTab, setActiveTab }) => {
  return (
    <div className="bg-white shadow-lg p-6">
      {/* Tab selection */}
      <div className="flex space-x-4 border-b-2 pb-2 mb-4">
        {Object.keys(postData).map((tab, index) => (
          <button
            key={index}
            className={`flex-1 text-lg font-semibold transition duration-300 ease-in-out rounded-lg pb-2 px-4 py-3 text-center ${
              activeTab === tab
                ? 'bg-blue-500 text-white border border-blue-500'
                : 'bg-transparent text-gray-500 hover:bg-blue-200 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex flex-col gap-4">
        {postData[activeTab].map((post, index) => (
          <div
            key={index}
            className="border shadow-sm p-4 transition duration-300 ease-in-out hover:shadow-lg hover:border-blue-300"
          >
            <h4 className="text-xl font-semibold text-gray-800">
              {post.title}
            </h4>
            <p className="text-gray-600 mt-1">{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostTabs;
