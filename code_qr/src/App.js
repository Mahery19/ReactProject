import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MenuBar from './components/MenuBar';
import Accueil from './components/Accueil';
import Generate from './components/Generate';
import Scan from './components/Scan';
import './styles/styles.css';

const App = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <div className="App">
        <MenuBar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Navigate to="/generate" />} /> {/* Default to Generate */}
          <Route path="/generate" element={<Generate />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/accueil" element={<Accueil />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
