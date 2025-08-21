import React from 'react';
import { Outlet } from 'react-router-dom';


function MainContent() {
  return (
    <main className="dashboard-content">
      <Outlet />
    </main>
  );
}

export default MainContent;
