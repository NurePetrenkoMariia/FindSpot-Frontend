import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyListsPage.css';
import { useNavigate } from 'react-router-dom';

function MyListsPage() {
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    const handleClick = (blogPostId) => {
        navigate(`/posts/${blogPostId}`);
    };


    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get('/api/UserBlogPost/my', {
                    withCredentials: true
                });
                console.log("List response:", response.data);
                setList(response.data);
            } catch (error) {
                console.error("Помилка при завантаженні списків:", error);
            }
        };

        fetchList();
    }, []);

    const visited = list.filter(item => item.status?.toLowerCase() === 'visited');
    const wantToVisit = list.filter(item => item.status?.toLowerCase() === 'wanttovisit');

    return (
        <div className="my-lists-page">
            <h2>Мої списки</h2>

            <div className="list-section">
                <h3>Хочу відвідати</h3>
                {wantToVisit.length === 0 ? <p>Пусто</p> :
                    wantToVisit.map(item =>
                        <div key={item.blogPostId}
                            onClick={() => handleClick(item.blogPostId)}>
                            {item.blogPost?.pageTitle}
                        </div>)}
            </div>

            <div className="list-section">
                <h3>Відвідано</h3>
                {visited.length === 0 ? <p>Пусто</p> :
                    visited.map(item =>
                        <div key={item.blogPostId}
                            onClick={() => handleClick(item.blogPostId)}>
                            {item.blogPost?.pageTitle}
                        </div>)}
            </div>
        </div>
    );
}

export default MyListsPage;
