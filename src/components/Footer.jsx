import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d30092.1691672225!2d-70.732569!3d19.476202!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c6101450dbeb%3A0x5ce5f2f6ead38b21!2sZona%20Franca%20Industrial%20Manuel%20Espaillat!5e0!3m2!1ses!2sdo!4v1774397939107!5m2!1ses!2sdo';

const Footer = () => {
  const handleNewsletter = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="capex-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-main-grid">
          <div className="footer-section capex-brand">
            <h4>CAPEX</h4>
            <p>Centro de innovación y educación transformando el talento de la región norte.</p>
            <div className="map-wrapper">
              <iframe
                title="Ubicación CAPEX — Zona Franca Industrial Manuel Espaillat"
                src={MAP_EMBED_SRC}
                width="350"
                height="350"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-overlay" aria-hidden="true">
                <i className="fas fa-map-marker-alt" />
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/programas">Programas</Link>
              </li>
              <li>
                <Link to="/quienes-somos">Nosotros</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="social-circle-grid">
              <a href="#" className="social-item" aria-label="Instagram" target="_blank" rel="noreferrer">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" className="social-item" aria-label="Facebook" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="social-item" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin-in" />
              </a>
              <a href="#" className="social-item" aria-label="YouTube" target="_blank" rel="noreferrer">
                <i className="fab fa-youtube" />
              </a>
            </div>
            <div className="footer-phone-block">
              <p>
                <i className="fas fa-phone-alt" aria-hidden="true" />
                809-575-1800
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Newsletter</h4>
            <form className="newsletter-box" onSubmit={handleNewsletter}>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Tu correo electrónico..."
                aria-label="Correo electrónico para newsletter"
              />
              <button type="submit" className="btn-subscribe-minimal">
                Suscribirme
              </button>
            </form>

            <h4 className="newsletter-spaced">Métodos de Pago</h4>
            <div className="payment-methods-grid">
              <div className="payment-card">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                  alt="Visa"
                />
              </div>
              <div className="payment-card">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                />
              </div>
              <div className="payment-card">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
                  alt="American Express"
                />
              </div>
              <div className="payment-card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
              </div>
              <div className="payment-card">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg"
                  alt="Discover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider" />
        <div className="footer-bottom-text">© 2026 CAPEX. Todos los derechos reservados.</div>
      </div>
    </footer>
  );
};

export default Footer;
