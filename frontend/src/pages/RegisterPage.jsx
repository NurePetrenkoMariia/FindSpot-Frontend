import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css';

function RegisterPage() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Паролі не збігаються");
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                email,
                password,
                username,
            });
            if (response.status === 200) {
                setErrorMessage('');
                navigate('/login');
            }

        }
        catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage("Помилка: " + (error.response.data.message || "Не вдалося створити акаунт"));
            } else {
                setErrorMessage("Помилка підключення до сервера");
            }
        }
    }

    return (
        <>
            <div className="auth-form-container register-container">
                <div className="auth-card">
                    <h2>Створіть акаунт</h2>
                    <form onSubmit={handleRegister}>
                        <div className="auth-form-field">
                            <label htmlFor="username">Ім'я користувача</label>
                            <input
                                type="text"
                                name="username"
                                onChange={(e) => setUserName(e.target.value)}
                                required />
                        </div>
                        <div className="auth-form-field">
                            <label htmlFor="email">Електронна пошта</label>
                            <input
                                type="text"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required />
                        </div>
                        <div className="auth-form-field">
                            <label htmlFor="password">Пароль</label>
                            <input
                                type="password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>
                        <div className="auth-form-field">
                            <label htmlFor="conf_password">Підтвердження паролю</label>
                            <input
                                type="password"
                                name="conf_password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required />
                        </div>
                        <div className="auth-form-container-button">
                            <button type="submit">Зареєструватися</button>
                        </div>
                        {errorMessage && <p>{errorMessage}</p>}
                    </form>
                    <p className="login-link">Вже є акаунт? <Link to="/login"><strong>Увійти</strong></Link></p>
                </div>
            </div>
        </>
    )

};
export default RegisterPage;