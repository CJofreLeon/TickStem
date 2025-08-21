import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';

import CreateUserModal from './CreateUserModal';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { token, user } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar los usuarios: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  const isSuperAdmin = user?.rol === ROLES.SUPER_ADMIN;

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Find the user to get their current data
      const userToUpdate = users.find(u => u.idUsuario === userId);
      if (!userToUpdate) return;

      // Create an updated user object with the new role
      const updatedUser = { ...userToUpdate, rol: newRole };

      await axios.put(`/usuarios/${userId}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Re-fetch users to update the list
    } catch (err) {
      setError('Error al actualizar el rol del usuario: ' + (err.response?.data || err.message));
    }
  };

  if (loading) {
    return <div className="container">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <>
      <div className="user-list-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Gestión de Usuarios</h2>
          {isSuperAdmin && (
            <button className="form-button" onClick={() => setShowModal(true)}>
              Crear Usuario
            </button>
          )}
        </div>
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo Electrónico</th>
              <th>Rol</th>
              {isSuperAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.idUsuario}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>
                  {isSuperAdmin && u.idUsuario !== user.idUsuario ? (
                    <select
                      value={u.rol}
                      onChange={(e) => handleRoleChange(u.idUsuario, e.target.value)}
                    >
                      {Object.values(ROLES).map((role) => (
                        // Superadmin cannot change their own role or create other superadmins from here
                        (role !== ROLES.SUPER_ADMIN || u.rol === ROLES.SUPER_ADMIN) && 
                        <option key={role} value={role} disabled={role === ROLES.SUPER_ADMIN && u.rol !== ROLES.SUPER_ADMIN}>
                          {role}
                        </option>
                      ))}
                    </select>
                  ) : (
                    u.rol
                  )}
                </td>
                {isSuperAdmin && <td>{/* Add more actions here if needed */}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateUserModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onUserCreated={fetchUsers} 
      />
    </>
  );
};

export default UserList;