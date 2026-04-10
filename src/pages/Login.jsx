import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
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
          <Link to="/" style={{display: 'inline-flex', alignItems: 'center', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1.5rem', textDecoration: 'none'}}>
             <i className="fas fa-arrow-left" style={{marginRight: '8px'}}></i> Volver a inicio
          </Link>
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

export default Login;
