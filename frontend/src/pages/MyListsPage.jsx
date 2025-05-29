import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyListsPage.css';

function MyListsPage() {
    const [list, setList] = useState([]);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get('/api/UserBlogPost/my');
                setList(response.data);
            } catch (error) {
                console.error("Помилка при завантаженні списків:", error);
            }
        };

        fetchList();
    }, []);

    const visited = list.filter(item => item.type === 'Visited');
    const wantToVisit = list.filter(item => item.type === 'WantToVisit');

    return (
        <div className="my-lists-page">
            <h2>Мої списки</h2>

            <div className="list-section">
                <h3>Хочу відвідати</h3>
                {wantToVisit.length === 0 ? <p>Пусто</p> :
                    wantToVisit.map(item => <div key={item.blogPostId}>{item.blogPostTitle}</div>)}
            </div>

            <div className="list-section">
                <h3>Відвідано</h3>
                {visited.length === 0 ? <p>Пусто</p> :
                    visited.map(item => <div key={item.blogPostId}>{item.blogPostTitle}</div>)}
            </div>
        </div>
    );
}

export default MyListsPage;
