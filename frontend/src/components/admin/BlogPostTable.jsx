import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminTables.css';

function BlogPostTable() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/api/BlogPosts', { withCredentials: true });
            setPosts(res.data);
            setLoading(false);
        } catch (e) {
            setError('Помилка завантаження публікацій');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeleteClick = async (id) => {
        const confirmed = window.confirm('Ви впевнені, що хочете видалити цю публікацію?');
        if (!confirmed) return;

        try {
            await axios.delete(`/api/BlogPosts/${id}`, { withCredentials: true });
            fetchPosts();
        } catch (error) {
            alert('Помилка при видаленні');
        }
    };

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-table-container">
            <h2>Публікації</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Заголовок</th>
                        <th>Короткий опис</th>
                        <th>Контент</th>
                        <th>URL зображення</th>
                        <th>Дата публікації</th>
                        <th>ID туристичного об'єкта</th>
                        <th>Теги</th>
                        <th>Середня оцінка</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id}>

                            <>
                                <td>{post.id}</td>
                                <td>{post.pageTitle}</td>
                                <td>{post.shortDescription}</td>
                                <td>{post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}</td>
                                <td>
                                    {post.featuredImageUrl ? (
                                        <a href={post.featuredImageUrl} target="_blank" rel="noreferrer">Посилання</a>
                                    ) : '-'}
                                </td>
                                <td>{post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : '-'}</td>
                                <td>{post.touristObjectId || '-'}</td>
                                <td>{post.tags ? post.tags.map(t => t.name).join(', ') : '-'}</td>
                                <td>{post.averageRating}</td>
                                <td>
                                    <button onClick={() => handleDeleteClick(post.id)} style={{ marginTop: '5px', background: 'red' }}>Видалити</button>
                                </td>
                            </>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default BlogPostTable;