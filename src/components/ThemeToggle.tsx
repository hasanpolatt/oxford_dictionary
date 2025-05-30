import React from 'react';
import styles from './ThemeToggle.module.css';
import { WiMoonAltWaxingCrescent3, WiMoonAltWaningGibbous3 } from "react-icons/wi";

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <button 
      className={`${styles.themeToggle} ${isDarkMode ? styles.dark : styles.light}`}
      onClick={toggleTheme}
      title={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
      aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDarkMode ? <WiMoonAltWaningGibbous3 /> : <WiMoonAltWaxingCrescent3 />}
    </button>
  );
};

export default ThemeToggle;
