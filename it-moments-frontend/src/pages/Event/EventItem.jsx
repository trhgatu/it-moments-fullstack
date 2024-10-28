// src/components/EventItem.js
import React from 'react';

const EventItem = ({ title, description, author, date, imageUrl, slug }) => {
    return (
        <div className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-32 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-gray-600">{description}</p>
                <p className="text-gray-500 text-sm">Người đăng: {author}</p>
                <p className="text-gray-500 text-sm">Ngày: {date}</p>
                <a
                    href={`/posts/detail/${slug}`}
                    className="text-blue-600 hover:underline text-sm mt-2 block"
                >
                    Xem chi tiết
                </a>
            </div>
        </div>
    );
};

export default EventItem;
