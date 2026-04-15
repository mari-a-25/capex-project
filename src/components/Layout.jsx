import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/Dashboard.css';

/* ── Helpers ── */
const getInitials = (nombre = '', apellido = '') =>
    `${nombre?.charAt(0) || 'U'}${apellido?.charAt(0) || ''}`.toUpperCase() || 'U';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const initials = getInitials(user?.Nombre, user?.Apellido);
    const fullName  = `${user?.Nombre || 'Usuario'} ${user?.Apellido || ''}`.trim();
    const matricula = user?.Matricula || user?.ID_participante || 'CPX-2026-001';

    const certDisponibles = 1;
    const formsPendientes = 1; 

    const closeSidebar = () => setSidebarOpen(false);

    const navItems = [
        { key: 'dashboard',    path: '/dashboard',      label: 'Dashboard',      icon: 'fas fa-th-large' },
        { key: 'cursos',       path: '/mis-cursos',     label: 'Mis Cursos',     icon: 'fas fa-graduation-cap' },
        { key: 'certificados', path: '/certificados',   label: 'Certificados',   icon: 'fas fa-award', badge: certDisponibles },
        { key: 'encuestas',    path: '/encuestas',      label: 'Encuestas',      icon: 'fas fa-clipboard-list', badge: formsPendientes || null },
        { key: 'perfil',       path: '/perfil',         label: 'Mi Perfil',      icon: 'fas fa-user-circle' },
    ];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="db-shell">
            {/* ── SIDEBAR OVERLAY ── */}
            <div className={`db-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar} />

            {/* ── SIDEBAR ── */}
            <aside className={`db-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="db-sidebar-shape" />

                {/* Logo */}
                <div className="db-sidebar-logo">
                    <div className="db-logo-inner">
                        <div className="db-logo-mark">CX</div>
                        <div className="db-logo-text">
                            <span className="main">CAPEX</span>
                            <span className="sub">Portal del Participante</span>
                        </div>
                    </div>
                </div>

                {/* User mini */}
                <div className="db-sidebar-user">
                    <div className="db-user-row">
                        <div className="db-user-avatar">{initials}</div>
                        <div className="db-user-info">
                            <span className="name">{fullName}</span>
                            <span className="id">{matricula}</span>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="db-sidebar-nav">
                    <div className="db-nav-label">Menú principal</div>
                    {navItems.map(item => (
                        <Link
                            key={item.key}
                            to={item.path}
                            className={`db-nav-link ${isActive(item.path) ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <div className="db-nav-icon"><i className={item.icon} /></div>
                            {item.label}
                            {item.badge ? <span className="db-nav-badge">{item.badge}</span> : null}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="db-sidebar-footer">
                    <button className="db-logout-btn" onClick={logout}>
                        <i className="fas fa-sign-out-alt" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* ── TOPBAR ── */}
            <header className="db-topbar">
                <button className="db-hamburger" onClick={() => setSidebarOpen(o => !o)}>
                    <i className="fas fa-bars" />
                </button>

                <div className="db-topbar-search">
                    <i className="fas fa-search" />
                    <input type="text" placeholder="Buscar en el portal..." />
                </div>

                <div className="db-topbar-right">
                    <button className="db-topbar-btn" title="Notificaciones">
                        <i className="fas fa-bell" />
                        <span className="db-notif-dot" />
                    </button>
                    <div className="db-session-badge">
                        <span className="db-session-dot" />
                        Sesión Activa
                    </div>
                </div>
            </header>

            {/* ── MAIN ── */}
            <main className="db-main">
                <div className="db-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
