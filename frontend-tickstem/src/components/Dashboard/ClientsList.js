import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/usuarios/rol/${ROLES.CLIENTE}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      } catch (err) {
        setError('Error al cargar los clientes: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchClients();
    }
  }, [token]);

  if (loading) {
    return <div>Cargando clientes...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="dashboard-card"> {/* Changed class */}
      <h3>Clientes Registrados</h3>
      {clients.length === 0 ? (
        <p>No se encontraron clientes registrados.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                {/* Add more client-specific fields if available */}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.idUsuario}>
                  <td>{client.nombre}</td>
                  <td>{client.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClientsList;
