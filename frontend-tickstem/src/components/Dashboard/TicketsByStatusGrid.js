import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom'; // For linking to ticket details

function TicketsByStatusGrid() {
  const [ticketsByStatus, setTicketsByStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const statuses = ['CREADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO']; // Define the statuses to display

  useEffect(() => {
    const fetchTicketsByStatus = async () => {
      setLoading(true);
      const newTicketsByStatus = {};
      try {
        for (const status of statuses) {
          const response = await axios.get(`/tickets/estado/${status}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          newTicketsByStatus[status] = response.data;
        }
        setTicketsByStatus(newTicketsByStatus);
      } catch (err) {
        setError('Error al cargar los tickets por estado: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTicketsByStatus();
    }
  }, [token]);

  if (loading) {
    return <div>Cargando tickets por estado...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="dashboard-card"> {/* Changed class */}
      <h3>Tickets por Estado</h3>
      <div className="table-responsive tickets-by-status-grid"> {/* Keep inner grid for columns */}
        {statuses.map(status => (
          <div key={status} className="status-column">
            <h4>{status.replace('_', ' ')} ({ticketsByStatus[status]?.length || 0})</h4>
            {ticketsByStatus[status]?.length === 0 ? (
              <p>No hay tickets en este estado.</p>
            ) : (
              <ul>
                {ticketsByStatus[status].map(ticket => (
                  <li key={ticket.idTicket}>
                    <Link to={`/dashboard/tickets/${ticket.idTicket}`}>
                      {ticket.titulo} - {ticket.prioridad}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TicketsByStatusGrid;
