import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const headerRef = useRef(null);

    // Scroll behavior
    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            setScrolled(currentScrollY > 50);
            lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Clases del body para padding-top
    useEffect(() => {
        document.body.classList.toggle('nav-hidden', hidden);
        document.body.classList.toggle('nav-visible', !hidden);
        return () => {
            document.body.classList.remove('nav-hidden');
            document.body.classList.remove('nav-visible');
        };
    }, [hidden]);

    // Altura dinámica del header
    useEffect(() => {
        const updateHeaderHeight = () => {
            const h = headerRef.current?.offsetHeight || 0;
            if (h > 0) {
                document.documentElement.style.setProperty('--site-header-height', `${h}px`);
            }
        };
        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);
        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);

    // Bloquear scroll cuando el drawer móvil está abierto
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const closeMobile = () => setMobileOpen(false);

    const handleNavContact = () => {
        navigate('/contacto');
        closeMobile();
    };

    return (
        <>
            <header
                ref={headerRef}
                className={`header ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}
                id="navbar"
            >
                {/* TOP BAR */}
                <div className="top-bar">
                    <div className="top-right">
                        <div className="socials">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                        <div className="top-links">
                            <button onClick={() => navigate('/carrito')}>Mi carrito</button>
                            <button
                                className="btn-login"
                                onClick={() => navigate('/login')}
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    </div>
                </div>

                {/* MAIN NAV */}
                <nav className="main-nav">
                    {/* Hamburger — solo visible en móvil */}
                    <button
                        className={`hamburger ${mobileOpen ? 'open' : ''}`}
                        onClick={() => setMobileOpen(prev => !prev)}
                        aria-label="Abrir menú"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    {/* LINKS IZQUIERDA — ocultos en móvil */}
                    <div className="nav-left">
                        <Link to="/quienes-somos">NOSOTROS</Link>
                        <Link to="/eventos">EVENTOS</Link>
                        <Link to="/programas">PROGRAMAS</Link>

                        {/* DROPDOWN ELEGANTE */}
                        <div className="dropdown">
                            <div className="dropbtn">
                                <div className="menu-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                MÁS
                            </div>
                            <div className="dropdown-content">
                                <div className="dropdown-cols">
                                    {/* Columna 1 — Programas insignia */}
                                    <div className="dropdown-col">
                                        <div className="dropdown-col-title">
                                            <i className="fas fa-star"></i> Programas
                                        </div>
                                        <Link to="/liderazgo-integral">
                                            <div className="link-icon">
                                                <i className="fas fa-users-cog"></i>
                                            </div>
                                            Liderazgo Integral
                                        </Link>
                                        <Link to="/mandos-medios">
                                            <div className="link-icon">
                                                <i className="fas fa-sitemap"></i>
                                            </div>
                                            Mandos Medios
                                        </Link>
                                    </div>

                                    {/* Columna 2 — Servicios */}
                                    <div className="dropdown-col">
                                        <div className="dropdown-col-title">
                                            <i className="fas fa-briefcase"></i> Servicios
                                        </div>
                                        <Link to="/consultoria">
                                            <div className="link-icon">
                                                <i className="fas fa-chart-line"></i>
                                            </div>
                                            Consultoría
                                        </Link>
                                        <Link to="/coaching">
                                            <div className="link-icon">
                                                <i className="fas fa-comments"></i>
                                            </div>
                                            Coaching Corp.
                                        </Link>
                                        <Link to="/capex-espacios">
                                            <div className="link-icon">
                                                <i className="fas fa-building"></i>
                                            </div>
                                            Capex Espacios
                                        </Link>
                                    </div>
                                </div>

                                {/* Footer del dropdown */}
                                <div className="dropdown-footer">
                                    <Link to="/contacto">
                                        <div className="link-icon">
                                            <i className="fas fa-envelope"></i>
                                        </div>
                                        Contáctenos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LOGO CENTRADO */}
                    <div className="logo-container">
                        <Link to="/">
                            <img src="/Capex.jpg" alt="Logo Capex" />
                        </Link>
                    </div>

                    {/* DERECHA — buscador y botón */}
                    <div className="nav-right">
                        <div className="search-bar">
                            <i className="fas fa-search"></i>
                            <input type="text" placeholder="Buscar..." />
                        </div>
                        <button className="btn-contact" onClick={handleNavContact}>
                            Contáctenos
                        </button>
                    </div>
                </nav>
            </header>

            {/* BACKDROP móvil */}
            <div
                className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`}
                onClick={closeMobile}
            />

            {/* DRAWER MÓVIL */}
            <nav className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <span className="mobile-logo">CAPEX</span>
                    <button className="mobile-close" onClick={closeMobile}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Buscador móvil */}
                <div className="mobile-search">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Buscar programas, servicios..." />
                </div>

                {/* Navegación principal */}
                <div className="mobile-section-title">Menú principal</div>
                <Link to="/quienes-somos" onClick={closeMobile}>
                    <div className="mob-icon"><i className="fas fa-info-circle"></i></div>
                    Nosotros
                </Link>
                <Link to="/eventos" onClick={closeMobile}>
                    <div className="mob-icon"><i className="fas fa-calendar-alt"></i></div>
                    Eventos
                </Link>
                <Link to="/programas" onClick={closeMobile}>
                    <div className="mob-icon"><i className="fas fa-graduation-cap"></i></div>
                    Programas
                </Link>

                <div className="mobile-divider" />

                {/* Programas insignia */}
                <div className="mobile-section-title">Programas insignia</div>
                <Link to="/liderazgo-integral" onClick={closeMobile}>
                    <div className="mob-icon"><i className="fas fa-users-cog"></i></div>
                    Liderazgo Integral
                </Link>
                <Link to="/mandos-medios" onClick={closeMobile}>
                    <div className="mob-icon"><i className="fas fa-sitemap"></i></div>
                    Mandos Medios
                </Link>

                <div className="mobile-divider" />

                {/* Servicios */}
                <div className="mobile-section-title">Servicios</div>
                <Link to="/consultoria" onClick={closeMobile}>
                    <div className="mob-icon"><i className="fas fa-chart-line"></i></div>
                    Consultoría
                </Link>
                <Link to="/coaching" onClick={closeMobile}>
                    <div className="mob-icon"><i className="fas fa-comments"></i></div>
                    Coaching Corporativo
                </Link>
                <Link to="/capex-espacios" onClick={closeMobile}>
                    <div className="mob-icon"><i className="fas fa-building"></i></div>
                    Capex Espacios
                </Link>

                <div className="mobile-divider" />

                {/* Sesión */}
                <div className="mobile-section-title">Mi cuenta</div>
                <Link to="/login" onClick={closeMobile}>
                    <div className="mob-icon"><i className="fas fa-user"></i></div>
                    Iniciar sesión
                </Link>
                <Link to="/carrito" onClick={closeMobile}>
                    <div className="mob-icon"><i className="fas fa-shopping-cart"></i></div>
                    Mi carrito
                </Link>

                {/* Footer del drawer */}
                <div className="mobile-footer">
                    <button className="btn-mobile-contact" onClick={handleNavContact}>
                        <i className="fas fa-envelope"></i>
                        Contáctenos
                    </button>
                    <div className="mobile-socials">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                            <i className="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;