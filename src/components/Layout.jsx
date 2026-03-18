import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Award,
    ClipboardList,
    User,
    LogOut,
    Bell,
    Search,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Certificados', path: '/certificados', icon: <Award size={20} /> },
        { name: 'Encuestas', path: '/encuestas', icon: <ClipboardList size={20} /> },
        { name: 'Mi Perfil', path: '/perfil', icon: <User size={20} /> },
    ];

    return (
        <aside className="modern-sidebar">
            <div className="sidebar-brand">
                <Link to="/" className="logo-link">
                    <span className="logo-main">CAPEX</span>
                    <span className="logo-sub">LMS</span>
                </Link>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.name}</span>
                        {location.pathname === item.path && <ChevronRight size={16} className="nav-arrow" />}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-mini-card">
                    <div className="user-avatar">
                        {(user?.Nombre?.[0] || 'U')}{(user?.Apellido?.[0] || '')}
                    </div>
                    <div className="user-details">
                        <p className="user-name">{user?.Nombre || 'Usuario'} {user?.Apellido || 'LMS'}</p>
                        <button onClick={logout} className="logout-btn">
                            <LogOut size={14} /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <header className="top-nav">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Buscar en el portal..." />
                    </div>
                    <div className="top-nav-actions">
                        <button className="icon-btn"><Bell size={20} /></button>
                        <div className="v-divider"></div>
                        <div className="active-session-badge">Sesión Activa</div>
                    </div>
                </header>
                <main className="content-view">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
