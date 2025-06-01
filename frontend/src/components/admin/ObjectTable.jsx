import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import './AdminTables.css';

function ObjectTable() {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        name: '',
        address: '',
        city: '',
        country: '',
        openingTime: '',
        closingTime: ''
    });

    const [editFormData, setEditFormData] = useState({
        name: '',
        address: '',
        city: '',
        country: '',
        openingTime: '',
        closingTime: ''
    });

    const fetchTouristObjects = async () => {
        try {
            const res = await axios.get('/api/TouristObjects');
            setObjects(res.data);
            setLoading(false);
        } catch (e) {
            setError('Помилка завантаження туристичних обʼєктів');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTouristObjects();
    }, []);

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleCreateChange = (e) => {
        setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
    };

    const handleEditClick = (object) => {
        setEditingId(object.id);
        setEditFormData({
            name: object.name || '',
            address: object.address || '',
            city: object.city || '',
            country: object.country || '',
            openingTime: object.openingTime || '',
            closingTime: object.closingTime || ''
        });
    };

    const handleCancelClick = () => {
        setEditingId(null);
    };

    const handleSaveClick = async () => {
        try {
            const updatedObject = {
                ...editFormData
            };

            await axios.put(`/api/TouristObjects/${editingId}`, updatedObject, { withCredentials: true });

            setEditingId(null);
            fetchTouristObjects();
        } catch (error) {
            alert('Помилка збереження');
        }
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цей об’єкт?')) return;
        try {
            await axios.delete(`/api/TouristObjects/${id}`, { withCredentials: true });
            fetchTouristObjects();
        } catch (error) {
            alert('Помилка видалення');
        }
    };

    const handleCreateSubmit = async () => {
        try {
            await axios.post('/api/TouristObjects', createFormData, { withCredentials: true });
            setIsCreateModalOpen(false);
            setCreateFormData({ name: '', address: '', city: '', country: '', openingTime: '', closingTime: '' });
            fetchTouristObjects();
        } catch (error) {
            alert('Помилка додавання');
        }
    };

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-table-container">
            <div className='admin-table-top-section'>
                <h2>Туристичні об’єкти</h2>
                <button onClick={() => setIsCreateModalOpen(true)} className="add-button">Додати об’єкт</button>
            </div>

            <ReactModal
                isOpen={isCreateModalOpen}
                onRequestClose={() => setIsCreateModalOpen(false)}
                contentLabel="Додати новий обʼєкт"
                className="modal modal-create-obj"
                overlayClassName="modal-overlay"
            >
                <h3>Новий туристичний обʼєкт</h3>
                <input name="name" placeholder="Назва" value={createFormData.name} onChange={handleCreateChange} />
                <input name="address" placeholder="Адреса" value={createFormData.address} onChange={handleCreateChange} />
                <input name="city" placeholder="Місто" value={createFormData.city} onChange={handleCreateChange} />
                <input name="country" placeholder="Країна" value={createFormData.country} onChange={handleCreateChange} />
                <input type="time" name="openingTime" value={createFormData.openingTime} onChange={handleCreateChange} />
                <input type="time" name="closingTime" value={createFormData.closingTime} onChange={handleCreateChange} />
                <div className="modal-buttons">
                    <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'red' }}>Скасувати</button>
                    <button onClick={handleCreateSubmit} style={{ background: 'green' }}>Створити</button>
                </div>
            </ReactModal>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Назва</th>
                        <th>Адреса</th>
                        <th>Місто</th>
                        <th>Країна</th>
                        <th>Час відкриття</th>
                        <th>Час закриття</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {objects.map(obj => (
                        <tr key={obj.id}>
                            {editingId === obj.id ? (
                                <>
                                    <td>{obj.id}</td>
                                    <td>
                                        <input
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="address"
                                            value={editFormData.address}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="city"
                                            value={editFormData.city}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="country"
                                            value={editFormData.country}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="openingTime"
                                            type="time"
                                            value={editFormData.openingTime}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="closingTime"
                                            type="time"
                                            value={editFormData.closingTime}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={handleCancelClick} style={{ background: 'red' }}>Відмінити</button>
                                        <button onClick={handleSaveClick} style={{ background: 'green' }}>Зберегти</button>{' '}
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{obj.id}</td>
                                    <td>{obj.name}</td>
                                    <td>{obj.address}</td>
                                    <td>{obj.city}</td>
                                    <td>{obj.country}</td>
                                    <td>{obj.openingTime}</td>
                                    <td>{obj.closingTime}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(obj)}>Редагувати</button>
                                        <br />
                                        <button onClick={() => handleDeleteClick(obj.id)} style={{ marginTop: '5px', background: 'red' }}>Видалити</button>
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

export default ObjectTable;
