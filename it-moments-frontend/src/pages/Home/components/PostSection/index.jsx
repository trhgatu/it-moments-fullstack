import React from 'react';

const PostSection = ({ postData, activeTab, setActiveTab }) => {
    const renderContent = () => {
        return postData[activeTab].map((post, index) => (
            <div className="border p-4" key={index}>
                <h4 className="font-semibold">{post.title}</h4>
                <p className="text-gray-600">{post.description}</p>
            </div>
        ));
    };

    return (
        <div className="w-full">
            <div className="flex space-x-4 border-b-2 pb-2 mb-4">
                {Object.keys(postData).map((tab, index) => (
                    <button
                        key={index}
                        className={`flex-1 text-lg font-semibold text-center py-2 p-8 transition duration-300 ease-in-out transform ${activeTab === tab
                            ? 'text-white bg-blue-500 border-b-4 border-blue-500 scale-105'
                            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-100'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="flex flex-col gap-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default PostSection;
