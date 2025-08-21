import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


function DashboardHome() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketSummary, setTicketSummary] = useState({
    CREADO: 0,
    ABIERTO: 0,
    EN_PROGRESO: 0,
    RESUELTO: 0,
    CERRADO: 0,
    REABIERTO: 0,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user || !token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('/tickets/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);

        const summary = {
          CREADO: 0,
          ABIERTO: 0,
          EN_PROGRESO: 0,
          RESUELTO: 0,
          CERRADO: 0,
          REABIERTO: 0,
        };
        response.data.forEach((ticket) => {
          if (summary.hasOwnProperty(ticket.estado)) {
            summary[ticket.estado]++;
          }
        });
        setTicketSummary(summary);
      } catch (err) {
        setError('Error al cargar los tickets: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, token]);

  if (loading) {
    return <div className="dashboard-content">Cargando dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-content" style={{ color: 'red' }}>{error}</div>;
  }

  const recentTickets = tickets.slice(0, 5); // Get up to 5 most recent tickets

  return (
    <div className="dashboard-content">
      <h2>¡Bienvenido, {user?.nombre || 'Cliente'}!</h2>
      <p>Aquí hay un resumen de tus tickets:</p>

      <div className="summary-cards">
        {['CREADO', 'ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO', 'REABIERTO'].map((status) => (
          <div key={status} className="summary-card">
            <h3>{status.replace(/_/g, ' ')}</h3>
            <p>{ticketSummary[status]}</p>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/dashboard/create')} className="create-ticket-button">
        Crear Nuevo Ticket
      </button>

      <div className="recent-tickets">
        <h3>Tus Tickets Recientes</h3>
        {recentTickets.length > 0 ? (
          <div className="ticket-list">
            {recentTickets.map((ticket) => (
              <div key={ticket.idTicket} className="ticket-item" onClick={() => navigate(`/dashboard/tickets/${ticket.idTicket}`)}>
                <div className="ticket-item-info">
                  <h4>{ticket.titulo}</h4>
                  <p>Estado: <span className={`ticket-item-status status-${ticket.estado}`}>{ticket.estado.replace(/_/g, ' ')}</span></p>
                  <p>Última Actualización: {new Date(ticket.fechaActualizacion || ticket.fechaCreacion).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No se encontraron tickets recientes. ¡Crea uno para empezar!</p>
        )}
      </div>
    </div>
  );
}

export default DashboardHome;