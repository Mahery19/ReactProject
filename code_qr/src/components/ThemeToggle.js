// src/components/ThemeToggle.js
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button onClick={toggleTheme} className="theme-toggle">
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
        </button>
    );
};

export default ThemeToggle;
