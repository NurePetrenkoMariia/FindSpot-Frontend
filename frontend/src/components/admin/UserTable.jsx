import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminTables.css';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    userName: '',
    email: '',
    avatarImageUrl: '',
    accountVerified: false,
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/User', { withCredentials: true });
      setUsers(res.data);
      setLoading(false);
    } catch (e) {
      setError('Помилка завантаження користувачів');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditFormData({
      userName: user.userName || '',
      email: user.email || '',
      avatarImageUrl: user.avatarImageUrl || '',
      accountVerified: user.accountVerified || false,
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleSaveClick = async () => {
    try {
      const updatedUser = {
        id: editingId,
        userName: editFormData.userName,
        email: editFormData.email,
        avatarImageUrl: editFormData.avatarImageUrl,
        accountVerified: editFormData.accountVerified,
      };

      await axios.put(`/api/User/${editingId}`, updatedUser, { withCredentials: true });

      setEditingId(null);
      fetchUsers();
    } catch (error) {
      alert('Помилка збереження');
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цього користувача?')) return;
    try {
      await axios.delete(`/api/User/${id}`, { withCredentials: true });
      fetchUsers();
    } catch (error) {
      alert('Помилка видалення');
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-table-container">
      <h2>Користувачі</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ім'я користувача</th>
            <th>Email</th>
            <th>Фото профілю (URL)</th>
            <th>Верифікований</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              {editingId === user.id ? (
                <>
                  <td>{user.id}</td>
                  <td>
                    <input
                      name="userName"
                      value={editFormData.userName}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      name="email"
                      type="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      name="avatarImageUrl"
                      value={editFormData.avatarImageUrl}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      name="accountVerified"
                      checked={editFormData.accountVerified}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <button onClick={handleSaveClick} style={{ background: 'green' }}>Зберегти</button>{' '}
                    <button onClick={handleCancelClick} style={{ background: 'red' }}>Відмінити</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.id}</td>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.avatarImageUrl ? (
                      <a href={user.avatarImageUrl} target="_blank" rel="noreferrer">Посилання</a>
                    ) : '-'}
                  </td>
                  <td>{user.accountVerified ? 'Так' : 'Ні'}</td>
                  <td>
                    <button onClick={() => handleEditClick(user)}>Редагувати</button>
                    <br />
                    <button onClick={() => handleDeleteClick(user.id)} style={{ marginTop: '5px', background: 'red' }}>Видалити</button>
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

export default UserTable;
