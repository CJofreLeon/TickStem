import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      console.log('AuthContext: Found stored token and user.', { storedToken, storedUser });
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
        console.log('AuthContext: User role from localStorage:', JSON.parse(storedUser).rol);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        localStorage.removeItem('user'); // Clear bad data
        localStorage.removeItem('token'); // Clear token as well to ensure consistent state
        setToken(null);
        setUser(null);
        return;
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/usuarios/login', { correo: email, contrasena: password });
      const { token, usuario } = response.data;
      console.log('Login successful. Token:', token, 'User:', usuario);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      console.log('Stored in localStorage. Token:', localStorage.getItem('token'), 'User:', localStorage.getItem('user'));
      
      setToken(token);
      setUser(usuario);
      console.log('AuthContext: User role after login:', usuario.rol);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      logout(); // Clear any partial state
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const register = async (name, email, password, rol) => {
    try {
      await axios.post('/usuarios/registrar', { nombre: name, correo: email, contrasena: password, rol: rol });
      return true;
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};