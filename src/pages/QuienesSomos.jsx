import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './QuienesSomos.css';

const QuienesSomos = () => {
    return (
        <div className="quienes-somos-page">
            {/* shared Navbar */}
            <Navbar />

            {/* Hero – reuse landing hero-section for consistency */}
            <section className="hero-section">
                <div className="hero-background">
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop"
                        alt="CAPEX" className="hero-bg-image" />
                    <div className="hero-overlay" />
                </div>
                <div className="container hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">Quiénes Somos</div>
                        <h1>Centro de Innovación y Educación</h1>
                        <p className="hero-description">
                            Centro de Innovación y Educación que impulsa el talento y la competitividad de la Región Norte.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main content – mission, vision, values */}
            <section className="about-section">
                <div className="container about-container">
                    <div className="about-image">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop" alt="Campus CAPEX" />
                    </div>
                    <div className="about-text">
                        <div className="hero-badge">Misión</div>
                        <h2>Impulsar el Talento de la Región Norte</h2>
                        <p>
                            Somos un órgano catalizador de grandes proyectos de emprendimiento e innovación para Santiago y la Región Norte.
                            Desarrollamos iniciativas, programas y propuestas novedosas vinculadas al ámbito educativo para potenciar el talento dominicano.
                        </p>
                        <div className="hero-badge" style={{ marginTop: '2rem' }}>Visión</div>
                        <h2>Ser el referente de educación ejecutiva y desarrollo empresarial en la zona franca</h2>
                        <p>
                            Queremos consolidarnos como la plataforma líder que brinda formación de alta calidad, alianzas estratégicas y oportunidades de crecimiento para empresas y profesionales.
                        </p>
                        <div className="hero-badge" style={{ marginTop: '2rem' }}>Valores</div>
                        <ul className="values-list">
                            <li>Innovación</li>
                            <li>Excelencia</li>
                            <li>Compromiso Social</li>
                            <li>Transparencia</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Hitos / timeline */}
            <section className="hitos-section section-padding">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Nuestros Hitos</h2>
                        <p className="section-subtitle">Un recorrido por los momentos clave que marcaron nuestra historia.</p>
                    </div>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-year">2020</div>
                            <p>Fundación de CAPEX como catalizador de innovación.</p>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-year">2021</div>
                            <p>Lanzamiento del primer diplomado y expansión a 5 provincias.</p>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-year">2023</div>
                            <p>5,000+ participantes capacitados y alianzas estratégicas.</p>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-year">2026</div>
                            <p>Expansión nacional y programas ejecutivos en marcha.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer – reuse same markup as Landing */}
            <Footer />
        </div>
    );
};

export default QuienesSomos;
