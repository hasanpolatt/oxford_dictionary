'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/App.module.css';
import Navbar from './Navbar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
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
    <div className={styles.app}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default ClientLayout;
