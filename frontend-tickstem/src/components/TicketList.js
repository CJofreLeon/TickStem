import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';


const TicketList = ({ analystId, status: propStatus }) => { // Accept props
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();
  const location = useLocation(); // For reading query params

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;

      let url = '/tickets';
      let currentStatusFilter = propStatus; // Use propStatus if provided

      // If status is in URL query params (from clicking status card)
      const queryParams = new URLSearchParams(location.search);
      if (queryParams.has('status')) {
        currentStatusFilter = queryParams.get('status');
      }

      if (analystId) { // If analystId is passed (from AnalystDashboardHome)
        if (currentStatusFilter) {
          url = `/tickets/analista/${analystId}/estado/${currentStatusFilter}`; // Use new endpoint
        } else {
          url = `/tickets/analista/${analystId}`; // Get all tickets for analyst
        }
      } else { // Default behavior based on user role
        switch (user.rol) {
          case ROLES.CLIENTE:
            url = '/tickets/my';
            break;
          case ROLES.ANALISTA:
            // If analyst is viewing their own list, and no status filter, show all assigned
            if (!currentStatusFilter) {
              url = `/tickets/analista/${user.idUsuario}`;
            } else {
              // If analyst is viewing their own list with a status filter
              url = `/tickets/analista/${user.idUsuario}/estado/${currentStatusFilter}`;
            }
            break;
          // For JEFATURA and SUPERADMIN, default is /tickets (all tickets)
        }
        if (user.rol !== ROLES.ANALISTA && currentStatusFilter) { // Apply status filter for non-analysts
          url = `/tickets/estado/${currentStatusFilter}`; // Existing endpoint
        }
      }

      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);
      } catch (err) {
        setError('Error al cargar los tickets: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      fetchTickets();
    } else {
      setLoading(false);
    }
  }, [token, user, analystId, propStatus, location.search]); // Added dependencies

  const getTitle = () => {
    if (!user) return 'Tickets';
    switch (user.rol) {
      case ROLES.CLIENTE:
        return 'Mis Tickets Creados';
      case ROLES.ANALISTA:
        return 'Mis Tickets Asignados';
      case ROLES.JEFATURA:
      case ROLES.SUPER_ADMIN:
        return 'Todos los Tickets';
      default:
        return 'Tickets';
    }
  };

  if (loading) {
    return <div className="container">Cargando tickets...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      <h2>{getTitle()}</h2>
      {tickets.length === 0 ? (
        <p>No se encontraron tickets.</p>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div key={ticket.idTicket} className="ticket-card">
              <Link to={`/dashboard/tickets/${ticket.idTicket}`}>
                <h3>{ticket.titulo}</h3>
              </Link>
              <p><strong>Estado:</strong> {ticket.estado}</p>
              <p><strong>Prioridad:</strong> {ticket.prioridad}</p>
              {ticket.fechaCreacion && <p><strong>Creado:</strong> {new Date(ticket.fechaCreacion).toLocaleDateString()}</p>}
              {ticket.usuarioAnalista && <p><strong>Asignado a:</strong> {ticket.usuarioAnalista.nombre}</p>}
              {ticket.rutaArchivo && (
                <p>
                  <strong>Adjunto:</strong>{' '}
                  <a href={`/tickets/download/${ticket.rutaArchivo}`} target="_blank" rel="noopener noreferrer" className="attachment-link">
                    Descargar Archivo
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
