import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Consultoria.css';

/* ── Hook reveal ── */
const useReveal = () => {
    useEffect(() => {
        const els = document.querySelectorAll('.cs-reveal');
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('active');
            }),
            { threshold: 0.12 }
        );
        els.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

/* ── Datos ── */
const radioItems = [
    { icon: 'fas fa-user-check', text: 'Evaluar si una persona es apta para ocupar una nueva posición dentro de la organización.' },
    { icon: 'fas fa-tasks', text: 'Evaluar si el personal cumple con las competencias requeridas para su puesto actual.' },
    { icon: 'fas fa-map-signs', text: 'Elaborar el plan de carrera de la empresa con criterios objetivos y medibles.' },
    { icon: 'fas fa-sitemap', text: 'Tomar decisiones de reestructuración organizacional basadas en datos reales.' },
    { icon: 'fas fa-trophy', text: 'Determinar y sacar provecho a las ventajas competitivas de su capital humano.' },
];

const servicios = [
    {
        icon: 'fas fa-brain',
        title: 'Evaluaciones Psicométricas',
        desc: 'Medición 360 de cualidades mentales, conductas, personalidades y actitudes, tanto de candidatos elegibles a posiciones vacantes como del talento humano de su empresa.',
    },
    {
        icon: 'fas fa-microphone-alt',
        title: 'Charlas y Conferencias',
        desc: 'Ponencias de reconocidos expertos en diversas áreas: innovación, servicios, calidad, procesos, ventas, proyectos, liderazgo, coaching y otros temas que requieran nuestros clientes.',
    },
    {
        icon: 'fas fa-briefcase',
        title: 'Jornadas de Empleo',
        desc: 'Gestionamos estas ferias para ayudar a satisfacer las demandas de personal altamente capacitado del sector productivo de la Región Norte.',
    },
];

export default function Consultoria() {
    useReveal();

    return (
        <div className="cs-page">
            <Navbar />

            {/* ── HERO ─────────────────────────────────── */}
            <section className="cs-hero">
                <div className="cs-hero-bg" />
                <div className="cs-hero-shape-1" />
                <div className="cs-hero-shape-2" />
                <div className="cs-hero-content cs-reveal">
                    <div className="cs-hero-eyebrow">
                        <i className="fas fa-handshake" />
                        Capex Way · Servicios Corporativos
                    </div>
                    <h1>Consultoría &amp; Acompañamiento</h1>
                    <p className="cs-hero-desc">
                        Ponemos al servicio de nuestros clientes corporativos esta
                        herramienta con la finalidad de suministrarles una radiografía
                        organizacional que les permita conocer sus ventajas, necesidades
                        y oportunidades puntuales de desarrollo.
                    </p>
                    <div className="cs-hero-actions">
                        <a href="#solicitar" className="cs-btn-primary">
                            <i className="fas fa-paper-plane" />
                            Solicitar Servicio
                        </a>
                        <a href="#radiografia" className="cs-btn-outline">
                            <i className="fas fa-arrow-down" />
                            Ver más
                        </a>
                    </div>
                    <div className="cs-hero-stats">
                        <div className="cs-hero-stat">
                            <span className="val">5</span>
                            <span className="lbl">Áreas clave</span>
                        </div>
                        <div className="cs-hero-stat">
                            <span className="val">3</span>
                            <span className="lbl">Servicios</span>
                        </div>
                        <div className="cs-hero-stat">
                            <span className="val">360°</span>
                            <span className="lbl">Evaluación</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── RADIOGRAFÍA ──────────────────────────── */}
            <section className="cs-radiografia" id="radiografia">
                <div className="cs-section-header cs-reveal">
                    <div className="cs-section-eyebrow">
                        <i className="fas fa-search" />
                        Radiografía organizacional
                    </div>
                    <h2>¿Para qué sirve este servicio?</h2>
                    <p>
                        Nuestro diagnóstico organizacional te permite tomar
                        decisiones estratégicas respaldadas por datos objetivos.
                    </p>
                </div>
                <div className="cs-radio-grid">
                    {radioItems.map((item, i) => (
                        <div
                            key={i}
                            className={`cs-radio-item cs-reveal cs-reveal-delay-${i + 1}`}
                        >
                            <div className="cs-radio-num">
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <div className="cs-radio-icon">
                                <i className={item.icon} />
                            </div>
                            <span className="cs-radio-text">{item.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SERVICIOS ────────────────────────────── */}
            <section className="cs-servicios">
                <div className="cs-servicios-shape" />
                <div className="cs-servicios-inner">
                    <div className="cs-section-header cs-reveal">
                        <div className="cs-section-eyebrow-white">
                            <i className="fas fa-layer-group" />
                            Lo que ofrecemos
                        </div>
                        <h2 className="white">Nuestros Servicios</h2>
                        <p className="white">
                            Soluciones diseñadas para potenciar el capital humano
                            y la competitividad de tu organización.
                        </p>
                    </div>
                    <div className="cs-cards-grid">
                        {servicios.map((s, i) => (
                            <div
                                key={i}
                                className={`cs-service-card cs-reveal cs-reveal-delay-${i + 1}`}
                            >
                                <div className="cs-card-icon-wrap">
                                    <i className={s.icon} />
                                </div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA FINAL ────────────────────────────── */}
            <section className="cs-cta" id="solicitar">
                <div className="cs-cta-content cs-reveal">
                    <div className="cs-section-eyebrow" style={{ marginBottom: 16 }}>
                        <i className="fas fa-envelope-open-text" />
                        ¿Listo para transformar tu organización?
                    </div>
                    <h2>Da el primer paso hacia la excelencia</h2>
                    <p>
                        Contáctanos y un consultor especializado evaluará las
                        necesidades de tu empresa para diseñar una solución
                        a la medida de tus objetivos estratégicos.
                    </p>
                    <div className="cs-cta-actions">
                        <a href="mailto:info@capex.edu.do" className="cs-btn-primary">
                            <i className="fas fa-paper-plane" />
                            Solicitar información
                        </a>
                    </div>
                </div>
                <div className="cs-cta-card cs-reveal cs-reveal-delay-2">
                    <h4>Información de contacto</h4>
                    <div className="cs-cta-contact-item">
                        <div className="c-icon"><i className="fas fa-envelope" /></div>
                        <div className="c-text">
                            <strong>Correo</strong>
                            <span>info@capex.edu.do</span>
                        </div>
                    </div>
                    <div className="cs-cta-contact-item">
                        <div className="c-icon"><i className="fas fa-phone" /></div>
                        <div className="c-text">
                            <strong>Teléfono</strong>
                            <span>+1 (809) 575-1800</span>
                        </div>
                    </div>
                    <div className="cs-cta-contact-item">
                        <div className="c-icon"><i className="fas fa-map-marker-alt" /></div>
                        <div className="c-text">
                            <strong>Ubicación</strong>
                            <span>Santiago, República Dominicana</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}