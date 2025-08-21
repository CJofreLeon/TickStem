import DashboardHome from './DashboardHome';
import SuperadminDashboardHome from './SuperadminDashboardHome';
import JefaturaDashboardHome from './JefaturaDashboardHome';
import AnalystDashboardHome from './AnalystDashboardHome'; // Added import
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

function DashboardIndex() {
  const { user } = useAuth();
  console.log('DashboardIndex: User object:', user); // Added detailed log
  console.log('DashboardIndex: User role:', user?.rol);

  if (!user) {
    // This case should ideally be handled by PrivateRoute, but as a fallback
    return <div>Cargando datos de usuario...</div>;
  }

  if (user.rol === ROLES.CLIENTE) {
    return <DashboardHome />;
  } else if (user.rol === ROLES.SUPER_ADMIN) { // Ensure this matches the constant
    return <SuperadminDashboardHome />;
  } else if (user.rol === ROLES.JEFATURA) {
    return <JefaturaDashboardHome />;
  } else if (user.rol === ROLES.ANALISTA) { // Added condition for ANALISTA
    return <AnalystDashboardHome />;
  } else {
    // For other roles, you might want a different default or a generic dashboard
    return <DashboardHome />;
  }
}

export default DashboardIndex;