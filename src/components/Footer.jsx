import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>CAPEX</h4>
                        <p>Centro de innovación y educación transformando el talento de la región norte.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Enlaces</h4>
                        <ul>
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/programas">Programas</Link></li>
                            <li><Link to="/quienes-somos">Nosotros</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Redes</h4>
                        <div className="social-icons">
                            <a href="#" target="_blank" rel="noreferrer"><Instagram size={20} /></a>
                            <a href="#" target="_blank" rel="noreferrer"><Facebook size={20} /></a>
                            <a href="#" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 CAPEX. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;