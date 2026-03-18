import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-glass">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    <span>CAPEX</span>
                    <span className="logo-dot">.</span>
                </Link>
                <div className="nav-links">
                    <Link to="/">Inicio</Link>
                    <Link to="/programas">Programas</Link>
                    <Link to="/quienes-somos">Nosotros</Link>
                    <Link to="/contacto">Contáctanos</Link>
                </div>
                <div className="nav-auth">
                    <Link to="/login" className="btn btn-primary btn-nav">
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;