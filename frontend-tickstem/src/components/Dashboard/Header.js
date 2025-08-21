import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

import TickStemLogo from '../../assets/logo-tickstem.svg';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', roles: [ROLES.CLIENTE, ROLES.ANALISTA, ROLES.JEFATURA, ROLES.SUPER_ADMIN] },
    { label: 'Tickets', path: '/dashboard/tickets', roles: [ROLES.CLIENTE, ROLES.ANALISTA, ROLES.JEFATURA, ROLES.SUPER_ADMIN] },
    { label: 'Crear Ticket', path: '/dashboard/create', roles: [ROLES.CLIENTE] },
    { label: 'Usuarios', path: '/dashboard/users', roles: [ROLES.JEFATURA, ROLES.SUPER_ADMIN] },
    { label: 'Configuración', path: '/dashboard/settings', roles: [ROLES.CLIENTE, ROLES.ANALISTA, ROLES.JEFATURA, ROLES.SUPER_ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.rol));

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img src={TickStemLogo} alt="TickStem Logo" className="header-logo" />
        <nav className="header-nav">
          <ul>
            {filteredNavItems.map((item) => (
              <li key={item.label}>
                <NavLink to={item.path} end={item.path === '/dashboard'}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="header-user-info">
        {user ? (
          <>
            <span>¡Bienvenido, {user.nombre}!</span>
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
          </>
        ) : (
          <span>Cargando usuario...</span>
        )}
      </div>
    </header>
  );
}

export default Header;
