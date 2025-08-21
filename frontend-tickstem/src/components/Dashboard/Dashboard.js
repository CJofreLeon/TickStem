import React from 'react';
import Header from './Header';
import MainContent from './MainContent';


function Dashboard() {
  return (
    <div className="dashboard-container">
      <Header />
      <MainContent />
    </div>
  );
}

export default Dashboard;