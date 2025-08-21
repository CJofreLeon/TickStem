import React, { useEffect, useState } from 'react'; // Added useEffect, useState
import { Link } from 'react-router-dom'; // For navigation
import axios from 'axios'; // Added axios
import { useAuth } from '../../context/AuthContext'; // Added useAuth
import TicketList from '../TicketList'; // Added TicketList import


function AnalystDashboardHome() {
  const { user, token } = useAuth(); // Get user and token
  const [ticketCounts, setTicketCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [errorCounts, setErrorCounts] = useState(null);

  const statuses = ['CREADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO']; // Match backend enum

  useEffect(() => {
    const fetchTicketCounts = async () => {
      if (!user || !token) return;
      setLoadingCounts(true);
      try {
        const response = await axios.get(`/tickets/analista/${user.idUsuario}/counts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTicketCounts(response.data);
      } catch (err) {
        setErrorCounts('Error al cargar el recuento de tickets: ' + (err.response?.data || err.message));
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchTicketCounts();
  }, [user, token]);

  if (loadingCounts) {
    return <div>Cargando dashboard del analista...</div>;
  }

  if (errorCounts) {
    return <div style={{ color: 'red' }}>{errorCounts}</div>;
  }

  return (
    <div className="analyst-dashboard-home">
      <h2>Dashboard del Analista</h2>
      <p>¡Bienvenido, Analista! Aquí están tus tickets por estado.</p>

      <div className="status-cards-grid"> {/* New grid for status cards */}
        {statuses.map(status => (
          <Link to={`/dashboard/tickets?status=${status}`} key={status} className="status-card-link">
            <div className="dashboard-card status-card"> {/* Reusing dashboard-card for styling */}
              <h3>{status.replace('_', ' ')}</h3>
              <p>Cantidad: {ticketCounts[status] || 0}</p> {/* Display count */}
            </div>
          </Link>
        ))}
      </div>

      <div className="all-tickets-section">
        <h3>Todos los Tickets Asignados</h3>
        <TicketList analystId={user.idUsuario} /> {/* Pass analystId to TicketList */}
      </div>
    </div>
  );
}

export default AnalystDashboardHome;
