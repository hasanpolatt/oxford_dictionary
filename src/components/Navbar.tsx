import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Oxford Dictionary
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Ana Sayfa
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              Hakkında
            </Link>
          </li>
        </ul>
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
    </nav>
  );
};

export default Navbar;