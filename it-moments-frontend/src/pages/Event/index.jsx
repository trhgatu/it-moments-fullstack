import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/config';
import EventList from './EventList';

export default function Event() {
    const { category = "su-kien", slug } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        pageSize: 6,
    });
    const [loadingEventList, setLoadingEventList] = useState(false);

    const fetchPosts = async (type = "all", page = 1) => {
        setLoadingEventList(true);
        try {
            let eventStatus = '';
            if (type === "ongoing") {
                eventStatus = "active";
            } else if (type === "completed") {
                eventStatus = "completed";
            } else if (type === "pending") {
                eventStatus = "pending"
            }

            const response = await axios.get(
                `${API_URL}/posts?category=${category}&eventStatus=${eventStatus}&page=${page}&limit=${pagination.pageSize}`
            );
            const data = response.data.data;
            setPosts(data.posts);

            setPagination((prev) => ({
                ...prev,
                currentPage: data.pagination.currentPage,
                totalPages: data.pagination.totalPage,
            }));
        } catch (error) {
            console.error('Error fetching posts:', error);
            navigate('/404');
        } finally {
            setLoadingEventList(false);
        }
    };

    useEffect(() => {
        fetchPosts(selectedCategory, pagination.currentPage);
    }, [selectedCategory, pagination.currentPage]);

    const handleCategoryChange = (type) => {
        setSelectedCategory(type);
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    return (
        <div className='pt-36 pb-36'>
            {!slug ? (
                <div className="container mx-auto px-6 gap-8 grid grid-cols-12">
                    <EventList
                        posts={posts}
                        category={category}
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
                        onCategoryChange={handleCategoryChange}
                        loading={loadingEventList}
                    />
                </div>
            ) : (
                <Outlet />
            )}
        </div>
    );
}
