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
import MisCursos from './pages/MisCursos';
import DetalleCurso from './pages/DetalleCurso';
import FormularioCierre from './pages/FormularioCierre';
import Eventos from './pages/Eventos';
import Footer from './components/Footer';
import FloatingChat from './components/FloatingChat';

import Login from './pages/Login';
import LiderazgoIntegral from './pages/LiderazgoIntegral';
import MandosMedios from './pages/MandosMedios';
import Consultoria from './pages/Consultoria';
import Coaching from './pages/Coaching';
import CapexEspacios from './pages/CapexEspacios';
import Carrito from './pages/Carrito';

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
          <Route path="/eventos" element={<Eventos />} />
          
          <Route path="/liderazgo-integral" element={<LiderazgoIntegral />} />
          <Route path="/mandos-medios" element={<MandosMedios />} />
          <Route path="/consultoria" element={<Consultoria />} />
          <Route path="/coaching" element={<Coaching />} />
          <Route path="/capex-espacios" element={<CapexEspacios />} />
          <Route path="/carrito" element={<Carrito />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-cursos"
            element={
              <ProtectedRoute>
                <MisCursos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-cursos/detalle/:id"
            element={
              <ProtectedRoute>
                <DetalleCurso />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-cursos/detalle/:cursoId/formulario/:moduloId"
            element={
              <ProtectedRoute>
                <FormularioCierre />
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
