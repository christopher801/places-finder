// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global styles (order matters)
import './styles/globals.css';
import './styles/navbar.css';
import './styles/cards.css';
import './styles/map.css';
import './styles/responsive.css';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
