import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Coaching.css';

/* ── Hook reveal ── */
const useReveal = () => {
    useEffect(() => {
        const els = document.querySelectorAll('.ck-reveal');
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
const keyPoints = [
    'El coaching impulsa el potencial humano desde adentro hacia afuera.',
    'Facilita el autodescubrimiento y la toma de decisiones consciente.',
    'Acompaña procesos de cambio individual y organizacional.',
    'Genera resultados medibles en desempeño, liderazgo y bienestar.',
];

const tiposCoaching = [
    {
        icon: 'fas fa-user-tie',
        title: 'Coaching Ejecutivo',
        desc: 'Acompañamiento personalizado para líderes y directivos que buscan potenciar su estilo de liderazgo, toma de decisiones e impacto organizacional.',
    },
    {
        icon: 'fas fa-users',
        title: 'Coaching de Equipos',
        desc: 'Intervención grupal orientada a mejorar la cohesión, comunicación y rendimiento colectivo de equipos de trabajo de alto desempeño.',
    },
    {
        icon: 'fas fa-building',
        title: 'Coaching Corporativo',
        desc: 'Programa integral diseñado para alinear el desarrollo del talento humano con los objetivos estratégicos y la cultura de la organización.',
    },
    {
        icon: 'fas fa-chart-line',
        title: 'Coaching de Desempeño',
        desc: 'Enfocado en cerrar brechas entre el desempeño actual y el esperado, desarrollando habilidades específicas con planes de acción concretos.',
    },
    {
        icon: 'fas fa-compass',
        title: 'Coaching de Carrera',
        desc: 'Acompaña a profesionales en la clarificación de su propósito, dirección y estrategia de desarrollo dentro o fuera de la organización.',
    },
    {
        icon: 'fas fa-seedling',
        title: 'Coaching de Vida',
        desc: 'Proceso transformador que ayuda a las personas a identificar sus metas personales y trazar un camino claro hacia el bienestar y la plenitud.',
    },
];

const procesoPasos = [
    {
        num: '01',
        title: 'Diagnóstico Inicial',
        desc: 'Evaluamos el punto de partida, necesidades y objetivos del coachee o equipo.',
    },
    {
        num: '02',
        title: 'Plan de Acción',
        desc: 'Diseñamos un programa personalizado con metas claras y plazos definidos.',
    },
    {
        num: '03',
        title: 'Sesiones de Coaching',
        desc: 'Acompañamiento continuo mediante sesiones estructuradas y dinámicas.',
    },
    {
        num: '04',
        title: 'Medición de Resultados',
        desc: 'Evaluamos el progreso y ajustamos el proceso para maximizar el impacto.',
    },
];

export default function Coaching() {
    useReveal();

    return (
        <div className="ck-page">
            <Navbar />

            {/* ── HERO ─────────────────────────────────── */}
            <section className="ck-hero">
                <div className="ck-hero-bg" />
                <div className="ck-hero-shape-1" />
                <div className="ck-hero-shape-2" />

                <div className="ck-hero-content ck-reveal">
                    <div className="ck-hero-eyebrow">
                        <i className="fas fa-comments" />
                        Capex Way · Servicios Corporativos
                    </div>
                    <h1>Coaching Corporativo</h1>
                    <p className="ck-hero-desc">
                        Acompañamos a personas, equipos y organizaciones en
                        procesos de transformación profunda, potenciando su
                        capacidad de acción, liderazgo e impacto real.
                    </p>
                    <div className="ck-hero-actions">
                        <a href="#solicitar" className="ck-btn-primary">
                            <i className="fas fa-paper-plane" />
                            Solicitar Servicio
                        </a>
                        <a href="#que-es" className="ck-btn-outline">
                            <i className="fas fa-arrow-down" />
                            Conocer más
                        </a>
                    </div>
                    <div className="ck-hero-stats">
                        <div className="ck-hero-stat">
                            <span className="val">6</span>
                            <span className="lbl">Tipos de coaching</span>
                        </div>
                        <div className="ck-hero-stat">
                            <span className="val">4</span>
                            <span className="lbl">Etapas del proceso</span>
                        </div>
                        <div className="ck-hero-stat">
                            <span className="val">100%</span>
                            <span className="lbl">Personalizado</span>
                        </div>
                    </div>
                </div>

            </section>

            {/* ── QUÉ ES ───────────────────────────────── */}
            <section className="ck-que-es" id="que-es">
                <div className="ck-que-es-img ck-reveal">
                    <img
                        src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
                        alt="Coaching Corporativo CAPEX"
                    />
                    <div className="ck-img-badge">
                        <span className="val">360°</span>
                        <span className="lbl">Enfoque integral</span>
                    </div>
                </div>

                <div className="ck-que-es-content ck-reveal ck-reveal-delay-2">
                    <div className="ck-eyebrow">
                        <i className="fas fa-info-circle" />
                        ¿Qué es el Coaching?
                    </div>
                    <h2>
                        Un proceso de <em>transformación</em> orientado a resultados
                    </h2>
                    <p>
                        El coaching es una disciplina que facilita el desarrollo del
                        potencial humano a través de conversaciones estructuradas,
                        reflexión profunda y compromisos de acción. No se trata de dar
                        consejos, sino de acompañar al coachee a encontrar sus propias
                        respuestas y soluciones.
                    </p>
                    <p>
                        En CAPEX aplicamos metodologías internacionalmente reconocidas
                        adaptadas a la realidad del entorno corporativo dominicano,
                        garantizando resultados medibles y sostenibles en el tiempo.
                    </p>
                    <div className="ck-key-points">
                        {keyPoints.map((point, i) => (
                            <div className="ck-key-point" key={i}>
                                <i className="fas fa-check-circle" />
                                <span>{point}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TIPOS DE COACHING ────────────────────── */}
            <section className="ck-tipos">
                <div className="ck-tipos-shape" />
                <div className="ck-tipos-inner">
                    <div className="ck-section-header ck-reveal">
                        <div className="ck-section-eyebrow-white">
                            <i className="fas fa-layer-group" />
                            Modalidades disponibles
                        </div>
                        <h2 className="white">Tipos de Coaching</h2>
                        <p className="white">
                            Ofrecemos diferentes modalidades adaptadas a las
                            necesidades específicas de cada persona u organización.
                        </p>
                    </div>

                    <div className="ck-tipos-grid">
                        {tiposCoaching.map((tipo, i) => (
                            <div
                                key={i}
                                className={`ck-tipo-card ck-reveal ck-reveal-delay-${(i % 3) + 1}`}
                            >
                                <div className="ck-tipo-icon">
                                    <i className={tipo.icon} />
                                </div>
                                <h3>{tipo.title}</h3>
                                <p>{tipo.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PROCESO ──────────────────────────────── */}
            <section className="ck-proceso">
                <div className="ck-section-header ck-reveal">
                    <div className="ck-section-eyebrow">
                        <i className="fas fa-cogs" />
                        Cómo trabajamos
                    </div>
                    <h2>Nuestro Proceso de Coaching</h2>
                    <p>
                        Un camino estructurado en cuatro etapas que garantiza
                        resultados claros y transformaciones reales.
                    </p>
                </div>

                <div className="ck-proceso-grid">
                    {procesoPasos.map((paso, i) => (
                        <div
                            key={i}
                            className={`ck-proceso-item ck-reveal ck-reveal-delay-${i + 1}`}
                        >
                            <div className="ck-proceso-num">{paso.num}</div>
                            <h4>{paso.title}</h4>
                            <p>{paso.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA FINAL ────────────────────────────── */}
            <section className="ck-cta" id="solicitar">
                <div className="ck-cta-content ck-reveal">
                    <div
                        className="ck-section-eyebrow"
                        style={{ marginBottom: 16 }}
                    >
                        <i className="fas fa-envelope-open-text" />
                        ¿Listo para transformar tu equipo?
                    </div>
                    <h2>Da el salto hacia tu mejor versión</h2>
                    <p>
                        Contáctanos y un coach certificado diseñará un proceso
                        completamente personalizado para ti, tu equipo o tu
                        organización, con objetivos claros y resultados medibles.
                    </p>
                    <div className="ck-cta-actions">
                        <a href="mailto:info@capex.edu.do" className="ck-btn-primary">
                            <i className="fas fa-paper-plane" />
                            Solicitar información
                        </a>
                    </div>
                </div>

                <div className="ck-cta-card ck-reveal ck-reveal-delay-2">
                    <h4>Información de contacto</h4>
                    <div className="ck-cta-contact-item">
                        <div className="c-icon">
                            <i className="fas fa-envelope" />
                        </div>
                        <div className="c-text">
                            <strong>Correo</strong>
                            <span>info@capex.edu.do</span>
                        </div>
                    </div>
                    <div className="ck-cta-contact-item">
                        <div className="c-icon">
                            <i className="fas fa-phone" />
                        </div>
                        <div className="c-text">
                            <strong>Teléfono</strong>
                            <span>+1 (809) 575-1800</span>
                        </div>
                    </div>
                    <div className="ck-cta-contact-item">
                        <div className="c-icon">
                            <i className="fas fa-map-marker-alt" />
                        </div>
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