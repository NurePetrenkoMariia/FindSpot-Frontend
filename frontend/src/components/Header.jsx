import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthHelper';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

function Header() {
  const { isLoggedIn, setIsLoggedIn, user, isLoading } = useAuth();
  const navigate = useNavigate(); 

  if (isLoading) return <div className="loader">Завантаження...</div>;

  const isAdminOrManager = user?.roles?.includes('Admin') || user?.roles?.includes('Manager');

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
          <li><Link to="/posts">Головна</Link></li>
          {!isLoggedIn ? (
            <>
              <li><Link to="/register">Зареєструватися</Link></li>
              <li className="header_login"><Link to="/login">Увійти</Link></li>
            </>
          ) : (
            <>
              {isAdminOrManager && (
                <li><Link to="/admin">Адмін-панель</Link></li>
              )}
              <li><Link to="/my-lists">Мої списки</Link></li>
              <li>
                <Link to="/profile" className="header_profile_icon">
                  <FaUserCircle size={24} />
                </Link>
              </li>
              <li><button className="header_logout" onClick={handleLogout}>Вийти</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
