
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import CreateTicket from './components/CreateTicket';
import TicketList from './components/TicketList';
import UserList from './components/UserList';
import Settings from './components/Settings';
import DashboardHome from './components/Dashboard/DashboardHome';
import DashboardIndex from './components/Dashboard/DashboardIndex';
import TicketDetail from './components/TicketDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ROLES } from './constants/roles';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Dashboard Route with Nested Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={[ROLES.CLIENTE, ROLES.ANALISTA, ROLES.JEFATURA, ROLES.SUPER_ADMIN]}>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardIndex />} />
            <Route 
              path="tickets" 
              element={
                <PrivateRoute roles={[ROLES.CLIENTE, ROLES.ANALISTA, ROLES.JEFATURA, ROLES.SUPER_ADMIN]}>
                  <TicketList />
                </PrivateRoute>
              } 
            />
            <Route
              path="create"
              element={
                <PrivateRoute roles={[ROLES.CLIENTE, ROLES.INVITADO]}>
                  <CreateTicket />
                </PrivateRoute>
              }
            />
            <Route 
              path="users" 
              element={
                <PrivateRoute roles={[ROLES.JEFATURA, ROLES.SUPER_ADMIN]}>
                  <UserList />
                </PrivateRoute>
              } 
            />
            <Route 
              path="settings" 
              element={
                <PrivateRoute roles={[ROLES.CLIENTE, ROLES.ANALISTA, ROLES.JEFATURA, ROLES.SUPER_ADMIN]}>
                  <Settings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="tickets/:id" 
              element={
                <PrivateRoute roles={[ROLES.CLIENTE, ROLES.ANALISTA, ROLES.JEFATURA, ROLES.SUPER_ADMIN]}>
                  <TicketDetail />
                </PrivateRoute>
              } 
            />
          </Route>

          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
