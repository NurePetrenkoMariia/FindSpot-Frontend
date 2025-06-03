import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import './AdminTables.css';

function TagsTable() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newBlogPostId, setNewBlogPostId] = useState('');

    const fetchTags = async () => {
        try {
            const res = await axios.get('/api/Tags');
            setTags(res.data);
            setLoading(false);
        } catch (e) {
            setError('Помилка завантаження тегів');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleEditClick = (tag) => {
        setEditingId(tag.id);
        setEditName(tag.name);
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`/api/Tags/${editingId}`, { name: editName }, { withCredentials: true });
            setEditingId(null);
            fetchTags();
        } catch (error) {
            alert('Помилка збереження');
        }
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цей тег?')) return;
        try {
            await axios.delete(`/api/Tags/${id}`, { withCredentials: true });
            fetchTags();
        } catch (error) {
            alert('Помилка видалення');
        }
    };

    const handleCreateSubmit = async () => {
        try {
            await axios.post('/api/Tags',
                {
                    name: newTagName,
                    blogPostId: newBlogPostId || null
                }, { withCredentials: true });
            setIsCreateModalOpen(false);
            setNewTagName('');
            fetchTags();
        } catch (error) {
            if (error.response?.status === 409) {
                alert('Такий тег вже існує');
            } else {
                alert('Помилка додавання');
            }
        }
    };

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-table-container">
            <div className='admin-table-top-section'>
                <h2>Теги</h2>
                <button onClick={() => setIsCreateModalOpen(true)} className="add-button">Додати тег</button>
            </div>

            <ReactModal
                isOpen={isCreateModalOpen}
                onRequestClose={() => setIsCreateModalOpen(false)}
                contentLabel="Додати новий тег"
                className="modal modal-create-obj"
                overlayClassName="modal-overlay"
            >
                <h3>Новий тег</h3>
                <input
                    name="name"
                    placeholder="Назва тегу"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                />
                <input
                    name="blogPostId"
                    placeholder="ID повʼязаного BlogPost"
                    value={newBlogPostId}
                    onChange={(e) => setNewBlogPostId(e.target.value)}
                    style={{ marginTop: '10px' }}
                />

                <div className="modal-buttons">
                    <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'red' }}>Скасувати</button>
                    <button onClick={handleCreateSubmit} style={{ background: 'green' }}>Створити</button>
                </div>
            </ReactModal>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID публікації</th>
                        <th>Назва</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.map(tag => (
                        <tr key={tag.id}>
                            {editingId === tag.id ? (
                                <>
                                    <td>{tag.id}</td>
                                    <td>{tag.blogPostId}</td>
                                    <td>
                                        <input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={handleCancelClick} style={{ background: 'red' }}>Відмінити</button>
                                        <button onClick={handleSaveClick} style={{ background: 'green' }}>Зберегти</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{tag.id}</td>
                                    <td>{tag.blogPostId}</td>
                                    <td>{tag.name}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(tag)}>Редагувати</button>
                                        <br />
                                        <button onClick={() => handleDeleteClick(tag.id)} style={{ marginTop: '5px', background: 'red' }}>Видалити</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TagsTable;
