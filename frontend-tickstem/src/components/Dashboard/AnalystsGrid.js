import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

function AnalystsGrid() {
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAnalysts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/usuarios/rol/${ROLES.ANALISTA}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalysts(response.data);
      } catch (err) {
        setError('Error al cargar los analistas: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalysts();
    }
  }, [token]);

  if (loading) {
    return <div>Cargando analistas...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="dashboard-card"> {/* Changed class */}
      <h3>Analistas Activos</h3>
      {analysts.length === 0 ? (
        <p>No se encontraron analistas activos.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                {/* Add more analyst-specific fields if available */}
              </tr>
            </thead>
            <tbody>
              {analysts.map((analyst) => (
                <tr key={analyst.idUsuario}>
                  <td>{analyst.nombre}</td>
                  <td>{analyst.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AnalystsGrid;
