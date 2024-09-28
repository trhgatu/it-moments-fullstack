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
                        className={`text-lg font-semibold ${activeTab === tab ? 'text-blue-500 border-blue-500 border-b-2' : 'text-gray-500'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
