import './AuthPages.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function LoginPage(){
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [errorMessage, setErrorMessage] = useState('');

    return(
        <>
         <div className="auth-form-container">
            <h2>Увійдіть в акаунт</h2>
                <form /*onSubmit={handleLogin}*/>
                    <div className="auth-form-field">
                        <label htmlFor="email">Електронна пошта</label>
                        <input type="text" name="email" onChange={e => setEmail(e.target.value)} required/>
                    </div>
                    <div className="auth-form-field">
                        <label htmlFor="password">Пароль</label>
                        <input type="password" name="password" onChange={e => setPassword(e.target.value)} required/>
                    </div>
                    <div className="auth-form-container-button">
                        <button type="submit">Увійти</button>
                    </div>
                    {errorMessage && <p>{errorMessage}</p>}
                </form>
                <p className="login-link">Ще немає акаунту? <Link to="/register"><strong>Зареєструватися</strong></Link></p>
            </div>

        </>
    )
}

export default LoginPage;