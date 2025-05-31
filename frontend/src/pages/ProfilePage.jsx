import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../helpers/AuthHelper';
import './ProfilePage.css';

function ProfilePage() {
    const { user, isLoggedIn } = useAuth();
    console.log("user object from useAuth:", user);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    

    const [form, setForm] = useState({
        userName: '',
        email: '',
        avatarImageUrl: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    useEffect(() => {
        const fetchProfile = async () => {
            if (!isLoggedIn || !user) return;
            console.log('user:', user);

            try {
                const res = await axios.get(`/api/user/${user.id}`, {
                    withCredentials: true,
                });
                setUserData(res.data);
                setForm({
                    userName: res.data.userName,
                    email: res.data.email,
                    avatarImageUrl: res.data.avatarImageUrl || '',
                });
            } catch (err) {
                console.error('Помилка завантаження профілю:', err);
            }
        };

        fetchProfile();
    }, [user, isLoggedIn]);

     if (!isLoggedIn || !user || !userData) {
        return <div>Завантаження профілю...</div>;
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            if (form.currentPassword && form.newPassword && form.confirmNewPassword) {
                const passwordRes = await axios.post('/api/user/me/change-password', {
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                    confirmNewPassword: form.confirmNewPassword
                }, {
                    withCredentials: true
                });

                alert('Пароль змінено успішно');
            }
            const res = await axios.put(`/api/user/me`, {
                ...userData,
                userName: form.userName,
                email: form.email,
                avatarImageUrl: form.avatarImageUrl,
            }, {
                withCredentials: true,
            });

            setUserData(res.data);
            setForm({
                userName: res.data.userName,
                email: res.data.email,
                avatarImageUrl: res.data.avatarImageUrl || '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setIsEditing(false);
        } catch (err) {
            console.error('Помилка оновлення профілю:', err);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/api/Image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            setForm((prevForm) => ({
                ...prevForm,
                avatarImageUrl: res.data.link,
            }));
        } catch (error) {
            console.error('Помилка при завантаженні зображення:', error);
            alert('Не вдалося завантажити зображення');
        }
    };


    return (
        <>
            <div className="profile-container">
                <div className='profile-header-section'>
                    <h2>Мій профіль</h2>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)}>Редагувати</button>
                    )}
                </div>

                <div className="profile-avatar-section">
                    <label>Фото профілю:</label>
                    <div className="profile-avatar-wrapper">
                        <img
                            src={form.avatarImageUrl || 'https://via.placeholder.com/150'}
                            alt="Avatar"
                            className="profile-avatar"
                        />
                        {isEditing && (
                            <>
                                <label htmlFor="avatar-upload" className="upload-button">
                                    Обрати фото
                                </label>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="profile-file-input-hidden"
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="profile-content-container">
                    <div className='profile-content-item'>
                        <label>Ім'я користувача:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="userName"
                                value={form.userName}
                                onChange={handleChange}
                            />
                        ) : (
                            <p>{userData.userName}</p>
                        )}

                    </div>

                    <div className='profile-content-item'>
                        <label>Email:</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        ) : (
                            <p>{userData.email}</p>
                        )}

                    </div>

                    <div className='profile-content-item'>
                        <label>Акаунт верифіковано:</label>
                        <p>{userData.accountVerified ? 'Так' : 'Ні'}</p>
                    </div>
                </div>

                {isEditing && (
                    <>
                        <div className='profile-content-item'>
                            <label>Старий пароль:</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='profile-content-item'>
                            <label>Новий пароль:</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='profile-content-item'>
                            <label>Повторити новий пароль:</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={form.confirmNewPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {isEditing && (
                    <div className="profile-buttons">
                        <button className='profile-button-cancel' onClick={() => setIsEditing(false)}>Скасувати</button>
                        <button className="profile-button-save" onClick={handleSave}>Зберегти</button>
                    </div>
                )}

            </div>
        </>
    );
}

export default ProfilePage;
