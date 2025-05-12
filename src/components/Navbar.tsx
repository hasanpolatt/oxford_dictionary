import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarLogo}>
          OxWord
        </Link>
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.navLink}>
              Home
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/about" className={styles.navLink}>
              About
            </Link>
          </li>
        </ul>
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
    </nav>
  );
};

export default Navbar;