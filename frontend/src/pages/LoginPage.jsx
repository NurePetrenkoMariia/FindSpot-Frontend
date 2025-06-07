import './AuthPages.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../helpers/AuthHelper';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { setIsLoggedIn, setUser, checkAuthStatus } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                const { userId, userName, email, roles } = response.data;
                await checkAuthStatus();
                setIsLoggedIn(true);
                setUser({ id: userId, userName, email, roles });
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                const message = error.response.data?.message;

                if (error.response.status === 401) {
                    if (message === "User account is locked out.") {
                        setErrorMessage('Ваш акаунт заблоковано');
                    } else if (message === "Invalid login attempt") {
                        setErrorMessage('Неправильний логін або пароль');
                    } else {
                        setErrorMessage(`Помилка: ${message}`);
                    }
                } else {
                    setErrorMessage(`Помилка: ${error.response.status}`);
                }
            } else {
                setErrorMessage("Помилка підключення до сервера");
            }
        }

    };

    return (
        <>
            <div className="auth-form-container">
                <div className="auth-card">
                    <h2>Увійдіть в акаунт</h2>
                    <form onSubmit={handleLogin}>
                        <div className="auth-form-field">
                            <label htmlFor="email">Електронна пошта</label>
                            <input type="text" name="email" onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="auth-form-field">
                            <label htmlFor="password">Пароль</label>
                            <input type="password" name="password" onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <div className="auth-form-container-button">
                            <button type="submit">Увійти</button>
                        </div>
                        {errorMessage && <p>{errorMessage}</p>}
                    </form>
                    <p className="login-link">Ще немає акаунту? <Link to="/register"><strong>Зареєструватися</strong></Link></p>
                </div>
            </div>
        </>
    )
}

export default LoginPage;