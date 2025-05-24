import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthHelper';
import axios from 'axios';

function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      alert('Не вдалося вийти з акаунту');
    }
  };

  return (
    <header className="header">
      <h1>FindSpot</h1>
      <nav>
        <ul>
          <li><Link to="/">Головна</Link></li>
          {!isLoggedIn ? (
            <>
              <li><Link to="/register">Зареєструватися</Link></li>
              <li className="header_login"><Link to="/login">Увійти</Link></li>
            </>
          ) : (
            <li><button className="header_logout" onClick={handleLogout}>Вийти</button></li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
