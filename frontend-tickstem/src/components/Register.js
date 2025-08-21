import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo-tickstem.svg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const rol = 'CLIENTE'; // Always register users as CLIENTE
    try {
      await register(name, email, password, rol);
      setMessage('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('El registro falló. Por favor, inténtalo de nuevo.');
      console.error('Error de registro:', err);
    }
  };

  return (
    <div className="form-container">
      <img src={logo} alt="TickStem Logo" style={{ width: '300px', marginBottom: '5px' }} />
      <h2>Crea Tu Cuenta</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="form-button">Registrarse</button>
      </form>
      <p style={{ marginTop: '20px' }}>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;