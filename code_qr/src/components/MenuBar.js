import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg'; // Correct path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faCamera, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'; // Import required icons

const MenuBar = ({ theme, toggleTheme }) => {
    return (
        <nav className="menu-bar">
            <ul>
                <li><Link to="/"><img src={logo} alt="Logo" className="logo" /></Link></li>
                <li><Link to="/generate"><FontAwesomeIcon icon={faQrcode} /> Generate</Link></li>
                <li><Link to="/scan"><FontAwesomeIcon icon={faCamera} /> Scan</Link></li>
                <div className="right-icons">
                    <li>
                        <FontAwesomeIcon
                            icon={theme === 'light' ? faSun : faMoon}
                            className="theme-toggle"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            onClick={toggleTheme}
                        />
                    </li>
                </div>
            </ul>
        </nav>
    );
};

export default MenuBar;
