import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import './AdminTables.css';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

  const [editFormData, setEditFormData] = useState({
    userName: '',
    email: '',
    avatarImageUrl: '',
    accountVerified: false,
  });

  const [createFormData, setCreateFormData] = useState({
    userName: '',
    email: '',
    password: '',
    role: 'User',
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

  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreateFormData({
      ...createFormData,
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

  const handleCreateSubmit = async () => {
    try {
      await axios.post('/api/User', createFormData, { withCredentials: true });
      setIsCreateModalOpen(false);
      setCreateFormData({ userName: '', email: '', avatarImageUrl: '', accountVerified: false });
      fetchUsers();
    } catch (error) {
      alert('Помилка створення користувача');
    }
  };

  const handleFileUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/Image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const imageUrl = response.data.link;
      if (isEdit) {
        setEditFormData(prev => ({ ...prev, avatarImageUrl: imageUrl }));
      } else {
        setCreateFormData(prev => ({ ...prev, avatarImageUrl: imageUrl }));
      }

      setImageUploadError(null);
    } catch (error) {
      setImageUploadError('Помилка при завантаженні зображення');
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-table-container">
      <div className="admin-table-top-section">
        <h2>Користувачі</h2>
        <button onClick={() => setIsCreateModalOpen(true)} className="add-button">Додати користувача</button>
      </div>

      <ReactModal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Додати нового користувача"
        className="modal modal-create-obj"
        overlayClassName="modal-overlay"
      >
        <h3>Новий користувач</h3>
        <input name="userName" placeholder="Ім'я користувача" value={createFormData.userName} onChange={handleCreateChange} />
        <input name="email" type="email" placeholder="Email" value={createFormData.email} onChange={handleCreateChange} />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={createFormData.password}
          onChange={handleCreateChange}
        />

        <select
          name="role"
          value={createFormData.role}
          onChange={handleCreateChange}
        >
          <option value="Admin">Admin</option>
          <option value="Moderator">Moderator</option>
          <option value="User">User</option>
        </select>

        <div className="add-publication_card-field">
          <label>
            Фото*:
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, false)} />
          </label>
          {createFormData.avatarImageUrl && (
            <img src={createFormData.avatarImageUrl} alt="Превʼю" width="200" style={{ marginTop: '10px' }} />
          )}
          {imageUploadError && <p style={{ color: 'red' }}>{imageUploadError}</p>}
        </div>
        <div className="modal-buttons">
          <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'red' }}>Скасувати</button>
          <button onClick={handleCreateSubmit} style={{ background: 'green' }}>Створити</button>
        </div>
      </ReactModal>

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
                    <input name="userName" value={editFormData.userName} onChange={handleEditChange} />
                  </td>
                  <td>
                    <input name="email" type="email" value={editFormData.email} onChange={handleEditChange} />
                  </td>
                  <td>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
                    {editFormData.avatarImageUrl && (
                      <img src={editFormData.avatarImageUrl} alt="Превʼю" width="100" />
                    )}
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
