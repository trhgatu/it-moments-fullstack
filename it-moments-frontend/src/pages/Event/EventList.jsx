import React from 'react';
import EventItem from '../Event/EventItem';
import styles from './EventList.module.scss';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const EventList = ({ posts = [], category }) => {
    return (
        <div className={styles.eventListContainer}>
            <div className={`${styles.eventList} flex flex-col gap-4`}>
                {posts.map((post) => (
                    <EventItem
                        key={post._id}
                        title={post.title}
                        description={post.description}
                        author={post.accountFullName}
                        date={new Date(post.createdAt).toLocaleDateString()}
                        imageUrl={post.thumbnail || 'https://via.placeholder.com/150'}
                        slug={post.slug}
                        category={category}
                    />
                ))}
            </div>
        </div>
    );
};

export default EventList;
