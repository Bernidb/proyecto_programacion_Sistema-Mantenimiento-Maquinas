import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/Home';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { AuthProvider, useAuthContext } from './hooks/AuthContext'; // ajusta ruta si hace falta
import { MachinesPage } from './components/MachinesPage'; // importá el nuevo componente

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const DashboardWrapper: React.FC = () => {
  const { user, logout } = useAuthContext();
  return <Dashboard user={user!} onLogout={logout} />;
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardWrapper />
              </PrivateRoute>
            }
          />

          <Route
            path="/machines"
            element={
              <PrivateRoute>
                <MachinesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
