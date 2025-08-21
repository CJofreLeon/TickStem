import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

function SuperadminDashboardHome() {
  const { token } = useAuth();
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalTickets: 0,
    ticketsByStatus: {},
    usersByRole: {},
    ticketsByPriority: {},
    unassignedTickets: 0,
    analystPerformance: [], // New state for analyst performance
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersResponse = await axios.get('/usuarios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalUsers = usersResponse.data.length;
        const usersByRole = {};
        Object.values(ROLES).forEach(role => usersByRole[role] = 0);
        usersResponse.data.forEach(user => {
          if (usersByRole.hasOwnProperty(user.rol)) {
            usersByRole[user.rol]++;
          }
        });

        // Fetch all tickets
        const ticketsResponse = await axios.get('/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalTickets = ticketsResponse.data.length;

        const ticketsByStatus = {};
        ticketsResponse.data.forEach(ticket => {
          ticketsByStatus[ticket.estado] = (ticketsByStatus[ticket.estado] || 0) + 1;
        });

        const ticketsByPriority = {};
        const priorities = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
        priorities.forEach(p => ticketsByPriority[p] = 0);
        ticketsResponse.data.forEach(ticket => {
          if (ticketsByPriority.hasOwnProperty(ticket.prioridad)) {
            ticketsByPriority[ticket.prioridad]++;
          }
        });

        const unassignedTickets = ticketsResponse.data.filter(ticket => !ticket.usuarioAnalista).length;

        // Calculate Analyst Performance
        const analysts = usersResponse.data.filter(user => user.rol === ROLES.ANALISTA);
        const analystPerformance = analysts.map(analyst => {
          const assignedTickets = ticketsResponse.data.filter(ticket => 
            ticket.usuarioAnalista?.idUsuario === analyst.idUsuario
          ).length;
          const resolvedTickets = ticketsResponse.data.filter(ticket => 
            ticket.usuarioAnalista?.idUsuario === analyst.idUsuario && ticket.estado === 'RESUELTO'
          ).length;
          return { 
            id: analyst.idUsuario,
            name: analyst.nombre,
            assigned: assignedTickets,
            resolved: resolvedTickets
          };
        });

        setSummary({
          totalUsers,
          totalTickets,
          ticketsByStatus,
          usersByRole,
          ticketsByPriority,
          unassignedTickets,
          analystPerformance,
        });
      } catch (err) {
        setError('Error al cargar los datos del dashboard: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <div className="dashboard-content">Cargando Dashboard de Superadmin...</div>;
  }

  if (error) {
    return <div className="dashboard-content" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="dashboard-content">
      <h2>Resumen del Dashboard de Superadmin</h2>
      <p>¡Bienvenido, Superadmin! Aquí hay un vistazo rápido al estado del sistema.</p>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Usuarios Totales</h3>
          <p>{summary.totalUsers}</p>
        </div>
        <div className="summary-card">
          <h3>Tickets Totales</h3>
          <p>{summary.totalTickets}</p>
        </div>
        <div className="summary-card">
          <h3>Tickets Sin Asignar</h3>
          <p>{summary.unassignedTickets}</p>
        </div>
      </div>

      <div className="recent-tickets">
        <h3>Usuarios por Rol</h3>
        {Object.keys(summary.usersByRole).length > 0 ? (
          <div className="ticket-list"> {/* Reusing ticket-list for grid layout */}
            {Object.entries(summary.usersByRole).map(([role, count]) => (
              <div key={role} className="ticket-item">
                <div className="ticket-item-info">
                  <h4>{role.replace(/_/g, ' ')}</h4>
                  <p>{count} usuarios</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No se encontraron usuarios en el sistema.</p>
        )}
      </div>

      <div className="recent-tickets" style={{ marginTop: '30px' }}>
        <h3>Tickets por Prioridad</h3>
        {Object.keys(summary.ticketsByPriority).length > 0 ? (
          <div className="ticket-list"> {/* Reusing ticket-list for grid layout */}
            {Object.entries(summary.ticketsByPriority).map(([priority, count]) => (
              <div key={priority} className="ticket-item">
                <div className="ticket-item-info">
                  <h4>{priority.replace(/_/g, ' ')}</h4>
                  <p>{count} tickets</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No se encontraron tickets en el sistema.</p>
        )}
      </div>

      <div className="recent-tickets" style={{ marginTop: '30px' }}>
        <h3>Rendimiento de Analistas</h3>
        {summary.analystPerformance.length > 0 ? (
          <div className="ticket-list"> {/* Reusing ticket-list for grid layout */}
            {summary.analystPerformance.map(analyst => (
              <div key={analyst.id} className="ticket-item">
                <div className="ticket-item-info">
                  <h4>{analyst.name}</h4>
                  <p>Asignados: {analyst.assigned}</p>
                  <p>Resueltos: {analyst.resolved}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No se encontraron analistas o datos de rendimiento.</p>
        )}
      </div>

      <div className="recent-tickets" style={{ marginTop: '30px' }}>
        <h3>Tickets por Estado (Todo el Sistema)</h3>
        {Object.keys(summary.ticketsByStatus).length > 0 ? (
          <div className="ticket-list">
            {Object.entries(summary.ticketsByStatus).map(([status, count]) => (
              <div key={status} className="ticket-item">
                <div className="ticket-item-info">
                  <h4>{status.replace(/_/g, ' ')}</h4>
                  <p>{count} tickets</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No se encontraron tickets en el sistema.</p>
        )}
      </div>
    </div>
  );
}

export default SuperadminDashboardHome;