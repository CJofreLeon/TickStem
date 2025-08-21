import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const CreateUserModal = ({ show, onClose, onUserCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('ANALISTA'); // Default role for new users
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/usuarios/registrar', 
        { nombre: name, correo: email, contrasena: password, rol }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUserCreated(); // Refresh the user list in the parent component
      onClose(); // Close the modal
    } catch (err) {
      setError('Error al crear el usuario. ' + (err.response?.data?.message || err.message));
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Crear Nuevo Usuario</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select id="role" value={rol} onChange={(e) => setRol(e.target.value)} required>
              <option value="ANALISTA">Analista</option>
              <option value="JEFATURA">Jefatura</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="CLIENTE">Cliente</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="form-button">Crear Usuario</button>
            <button type="button" className="button-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;