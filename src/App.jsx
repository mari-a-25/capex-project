import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import Surveys from './pages/Surveys';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Programas from './pages/Programas';
import SolicitudForm from './pages/SolicitudForm';
import './index.css';
import QuienesSomos from './pages/QuienesSomos';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import FloatingChat from './components/FloatingChat';

// Modern Login Style
import { Link } from 'react-router-dom';

const Login = () => {
  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { user, login, error } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(id, password);
  };

  return (
    <div className="page-with-site-footer">
      <div className="login-window-container">
      <div className="login-box">
        <div className="login-header-modern">
          <div className="branding-section">
            <h2 className="brand-navy">CAPEX</h2>
            <p className="sub-brand">Centro de Innovación y Educación</p>
          </div>
          <h3>Acceso al Portal</h3>
          <p className="login-subtitle">Introduce tus credenciales institucionales</p>
        </div>
        <div className="login-body-modern">
          <form onSubmit={handleSubmit}>
            <div className="form-group-modern">
              <label>Identificación / Correo</label>
              <input
                type="text"
                placeholder="Ej: 001-0000000-0 o correo@ejemplo.com"
                value={id}
                onChange={(e) => setId(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="form-group-modern">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-text-modern">{error}</p>}
            <div className="login-btns-footer">
              <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
            </div>
            <div className="login-back-link" style={{ marginTop: '2rem' }}>
              <Link to="/register" style={{ fontWeight: '700', color: 'var(--primary)' }}>¿No tienes acceso? Solicita una cuenta aquí</Link>
            </div>
          </form>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <FloatingChat />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registro" element={<SolicitudForm />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/programas" element={<Programas />} />
          <Route path="/contacto" element={<Contact />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificados"
            element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/encuestas"
            element={
              <ProtectedRoute>
                <Surveys />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
