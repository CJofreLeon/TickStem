import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Settings() {
  const { user, token, updateUser } = useAuth();
  const [nombre, setNombre] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      // Construct the full user object to send to the backend
      const updatedUser = { 
        ...user, 
        nombre: nombre 
      };

      const response = await axios.put(`/usuarios/${user.idUsuario}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      updateUser(response.data);
      setMessage('¡Perfil actualizado con éxito!');
    } catch (err) {
      setError('Error al actualizar el perfil.');
      console.error('Error al actualizar el perfil:', err);
    }
  };

  if (!user) {
    return <div className="container">Por favor, inicie sesión para ver la configuración.</div>;
  }

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2>Configuración de Usuario</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={user.correo || ''}
            readOnly
            style={{ backgroundColor: '#eee' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol:</label>
          <input
            type="text"
            id="role"
            value={user.rol}
            readOnly
            style={{ backgroundColor: '#eee' }}
          />
        </div>
        <button type="submit" className="form-button">Actualizar Perfil</button>
      </form>
    </div>
  );
}

export default Settings;