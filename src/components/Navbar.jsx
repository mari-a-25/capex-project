import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Ocultar al bajar, mostrar al subir
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                setHidden(true);
            } else {
                setHidden(false);
            }

            // Cambiar fondo al hacer scroll
            setScrolled(currentScrollY > 50);

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`} id="navbar">
            <div className="top-bar">
                <div className="top-right">
                    <div className="socials">
                        <i className="fab fa-facebook-f"></i>
                        <i className="fab fa-linkedin-in"></i>
                        <i className="fab fa-instagram"></i>
                        <i className="fab fa-youtube"></i>
                    </div>
                    <div className="top-links">
                        <span>Mi carrito</span>
                        <span onClick={() => navigate('/login')}>Iniciar sesión</span>
                    </div>
                </div>
            </div>
            <nav className="main-nav">
                <div className="nav-left">
                    <Link to="/quienes-somos">NOSOTROS</Link>
                    <Link to="/eventos">EVENTOS</Link>
                    <Link to="/programas">PROGRAMAS</Link>
                    <div className="dropdown">
                        <span className="dropbtn">+</span>
                        <div className="dropdown-content extended-menu">
                            <div className="menu-group">
                                <div className="menu-header">PROGRAMAS INSIGNIA <i className="fas fa-caret-down"></i></div>
                                <Link to="/liderazgo-integral">LIDERAZGO INTEGRAL</Link>
                                <Link to="/mandos-medios">PROFESIONALIZACIÓN DE MANDOS MEDIOS</Link>
                            </div>
                            <div className="menu-group">
                                <div className="menu-header">SERVICIOS <i className="fas fa-caret-down"></i></div>
                                <Link to="/consultoria">CONSULTORIA</Link>
                                <Link to="/coaching">COACHING CORPORATIVO</Link>
                                <Link to="/capex-espacios">CAPEX ESPACIOS</Link>
                            </div>
                            <Link to="/contacto" className="single-link">CONTACTO</Link>
                        </div>
                    </div>
                </div>
                <div className="logo-container">
                    <Link to="/">
                        {/* La imagen Capex.jpg se levanta directamente de la carpeta /public */}
                        <img src="/Capex.jpg" alt="Logo Capex" />
                    </Link>
                </div>
                <div className="nav-right">
                    <div className="search-bar">
                        <input type="text" placeholder="Buscar..." />
                        <i className="fas fa-search"></i>
                    </div>
                    <button className="btn-contact" onClick={() => navigate('/contacto')}>Contáctenos</button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;