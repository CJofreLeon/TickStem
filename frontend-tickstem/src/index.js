import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/Unified.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:8080';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
