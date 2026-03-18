import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    Phone,
    Mail,
    MapPin
} from 'lucide-react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <Navbar />

            <section className="hero-section">
                <div className="hero-background">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1470&auto=format&fit=crop"
                        alt="Contact CAPEX" className="hero-bg-image" />
                    <div className="hero-overlay" />
                </div>
                <div className="container hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">Contáctanos</div>
                        <h1>Estamos para ayudarte</h1>
                        <p className="hero-description">
                            Escríbenos o visítanos en nuestras oficinas en Santiago.
                        </p>
                    </div>
                </div>
            </section>

            <section className="contact-info section-padding">
                <div className="container contact-container">
                    <div className="contact-item">
                        <MapPin size={32} />
                        <p>Av. Mirador del Yanque, Esq. Av. Sur, Parque Industrial Víctor Espaillat Mera. Santiago, R.D.</p>
                    </div>
                    <div className="contact-item">
                        <Phone size={32} />
                        <p>+1 (809) 575-1800</p>
                    </div>
                    <div className="contact-item">
                        <Mail size={32} />
                        <p>info@capex.edu.do</p>
                    </div>
                </div>
            </section>

            {/* could expand with form or map later */}

            <Footer />
        </div>
    );
};

export default Contact;