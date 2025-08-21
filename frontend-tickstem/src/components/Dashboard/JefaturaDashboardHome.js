import React from 'react';
import AnalystsGrid from './AnalystsGrid'; // Import AnalystsGrid
import TicketsByStatusGrid from './TicketsByStatusGrid'; // Import TicketsByStatusGrid
import ClientsList from './ClientsList'; // Import ClientsList


function JefaturaDashboardHome() {
  return (
    <div className="jefatura-dashboard-home">
      <h2>Dashboard de Jefatura</h2>
      <p>¡Bienvenido, Jefatura! Este es su panel de control personalizado.</p>
      <div className="jefatura-dashboard-grid"> {/* Added grid container */}
        <AnalystsGrid />
        <TicketsByStatusGrid />
        <ClientsList />
      </div>
    </div>
  );
}

export default JefaturaDashboardHome;
