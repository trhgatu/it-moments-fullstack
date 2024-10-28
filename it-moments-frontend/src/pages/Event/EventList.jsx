// src/pages/Posts/EventList.js
import React from 'react';
import EventItem from '../Event/EventItem';

const EventList = ({posts = []}) => {
    return (
        <div>
            <h1>Sự Kiện</h1>
            <div>
                {posts.map((post) => (
                    <EventItem
                        key={post._id}
                        title={post.title}
                        description={post.description}
                        author={post.accountFullName}
                        date={new Date(post.createdAt).toLocaleDateString()}
                        imageUrl={post.thumbnail || 'https://via.placeholder.com/150'}
                        slug={post.slug}
                    />
                ))}
            </div>
        </div>
    );
};

export default EventList;
