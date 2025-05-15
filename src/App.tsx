import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './styles/App.module.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';


const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Theme change function
  const toggleTheme = (): void => {
    setIsDarkMode(!isDarkMode);
  };

  // Update body class when theme changes
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  return (
    <Router>
      <div className={styles.app}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
