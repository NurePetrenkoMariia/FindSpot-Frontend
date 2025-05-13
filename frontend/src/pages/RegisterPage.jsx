import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthPages.css';

function RegisterPage(){
 const [username, setUserName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [errorMessage, setErrorMessage] = useState('');

    return (
        <>
            <div className="auth-form-container">
            <h2>Створіть акаунт</h2>
                <form /*onSubmit={handleRegister}*/>
                    <div className="auth-form-field">
                        <label htmlFor="username">Ім'я користувача</label>
                        <input 
                        type="text" 
                        name="username" 
                        onChange={(e) => setUserName(e.target.value)} 
                        required/>
                    </div>
                    <div className="auth-form-field">
                        <label htmlFor="email">Електронна пошта</label>
                        <input 
                        type="text" 
                        name="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        required/>
                    </div>
                    <div className="auth-form-field">
                        <label htmlFor="password">Пароль</label>
                        <input 
                        type="password" 
                        name="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required/>
                    </div>
                    <div className="auth-form-field">
                        <label htmlFor="conf_password">Підтвердження паролю</label>
                        <input 
                        type="password" 
                        name="conf_password" 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required/>
                    </div>
                    <div className="auth-form-container-button">
                        <button type="submit">Зареєструватися</button>
                    </div>
                    {errorMessage&& <p>{errorMessage}</p>}
                </form>
                <p className="login-link">Вже є акаунт? <Link to="/login"><strong>Увійти</strong></Link></p>
            </div>
        </>
    )
}

export default RegisterPage;