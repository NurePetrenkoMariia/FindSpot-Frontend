import { Link, Outlet } from 'react-router-dom';
import './AdminPanelPage.css';

function AdminPanel() {
  return (
    <div className='admin-panel'>
      <nav className="admin-nav">
        <Link to="/admin/blog-posts">Публікації</Link>
        <Link to="/admin/users">Користувачі</Link>
        <Link to="/admin/objects">Туристичні об'єкти</Link>
        <Link to="#">Теги</Link>
      </nav>
      <hr />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPanel;
