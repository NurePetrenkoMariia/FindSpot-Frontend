import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1>FindSpot</h1>
      <nav>
        <ul>
          <li><a href="/">Головна</a></li>
          <li><a href="#">Зареєструватися</a></li>
          <li className='header_login'><a href="#">Увійти</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
