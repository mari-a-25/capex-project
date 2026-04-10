import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LiderazgoIntegral.css';

/* ── Hook de reveal con IntersectionObserver ── */
const useReveal = () => {
    useEffect(() => {
        const els = document.querySelectorAll('.li-reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.12 }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

/* ── Hook de contadores animados ── */
const useCounters = () => {
    useEffect(() => {
        const counters = document.querySelectorAll('.li-counter');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    if (el.dataset.counted) return;
                    el.dataset.counted = 'true';
                    const target = Number(el.dataset.target);
                    const suffix = el.dataset.suffix || '';
                    let count = 0;
                    const step = target / 80;
                    const tick = () => {
                        count += step;
                        if (count < target) {
                            el.textContent = Math.ceil(count) + suffix;
                            requestAnimationFrame(tick);
                        } else {
                            el.textContent = target + suffix;
                        }
                    };
                    requestAnimationFrame(tick);
                    observer.unobserve(el);
                });
            },
            { threshold: 0.5 }
        );
        counters.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

/* ── Datos de metodología ── */
const metodologia = [
    { icon: 'fas fa-brain',             title: 'Aprendizaje basado en problemas', desc: 'Soluciones reales a desafíos gerenciales.' },
    { icon: 'fas fa-chalkboard-teacher',title: 'Método expositivo',               desc: 'Presentaciones claras y estructuradas.' },
    { icon: 'fas fa-microphone-alt',    title: 'Conferencias',                    desc: 'Charlas inspiradoras de expertos.' },
    { icon: 'fas fa-user-tie',          title: 'Coaching',                        desc: 'Acompañamiento personalizado.' },
    { icon: 'fas fa-wifi',              title: 'E-learning',                      desc: 'Formación flexible y en línea.' },
    { icon: 'fas fa-gamepad',           title: 'Gamificación',                    desc: 'Aprende de forma lúdica y competitiva.' },
];

/* ── Datos de info bar ── */
const infoItems = [
    { icon: 'fas fa-graduation-cap', label: 'Programa',  value: 'Desarrollo de Liderazgo Integral' },
    { icon: 'fas fa-calendar-alt',   label: 'Fechas',    value: '25 Mayo – 09 Julio 2025' },
    { icon: 'far fa-clock',          label: 'Horario',   value: 'Lun y Mié | 6PM – 9PM' },
    { icon: 'fas fa-laptop',         label: 'Modalidad', value: 'Virtual / Híbrido' },
];

/* ── Puntos clave ── */
const keyPoints = [
    'Desarrolla influencia positiva sobre tu equipo.',
    'Aprende a redirigir energías hacia el logro de objetivos.',
    'Demuestra empatía, don de mando y toma de decisiones.',
    'Construye un liderazgo que deja legado organizacional.',
];

export default function LiderazgoIntegral() {
    useReveal();
    useCounters();

    return (
        <div className="li-page">
            <Navbar />

            {/* ── HERO ───────────────────────────────────────── */}
            <section className="li-hero">
                <div className="li-hero-content li-reveal">
                    <div className="li-hero-eyebrow">
                        <i className="fas fa-star" />
                        Programa Insignia CAPEX
                    </div>
                    <h1>
                        Escuela de <span>Gerentes</span>
                    </h1>
                    <p className="li-hero-desc">
                        Sigue la guía precisa de este cuerpo de profesionales expertos y
                        dispuestos a confiarte los secretos que otorgan longevidad y
                        relevancia en las carreras que dejan legado.
                    </p>
                    <div className="li-hero-actions">
                        <a href="#inscripcion" className="li-btn-primary">
                            <i className="fas fa-ticket-alt" />
                            Únete al Programa
                        </a>
                    </div>
                    <div className="li-hero-stats">
                        <div className="li-hero-stat">
                            <span className="val">44h</span>
                            <span className="lbl">Duración</span>
                        </div>
                        <div className="li-hero-stat">
                            <span className="val">6</span>
                            <span className="lbl">Módulos</span>
                        </div>
                        <div className="li-hero-stat">
                            <span className="val">100%</span>
                            <span className="lbl">Virtual</span>
                        </div>
                    </div>
                </div>

                <div className="li-hero-img-wrap li-reveal li-reveal-delay-2">
                    <img
                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
                        alt="Líder Ejecutivo CAPEX"
                    />
                    <div className="li-img-badge">
                        <div className="badge-icon">
                            <i className="fas fa-award" />
                        </div>
                        <div className="badge-text">
                            <strong>Certificado</strong>
                            <span>Al completar el programa</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── BARRA DE INFO ──────────────────────────────── */}
            <div className="li-info-bar li-reveal">
                <div className="li-info-bar-inner">
                    {infoItems.map((item, i) => (
                        <div className="li-info-item" key={i}>
                            <div className="li-info-icon">
                                <i className={item.icon} />
                            </div>
                            <div className="li-info-text">
                                <strong>{item.label}</strong>
                                <span>{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── REFLEXIÓN ──────────────────────────────────── */}
            <section className="li-reflexion">
                <div className="li-reflexion-content li-reveal">
                    <h2>
                        ¿Cuándo fue la última vez que experimentaste{' '}
                        <em>plenitud</em> en tu posición directiva?
                    </h2>
                    <p>
                        Puede que pienses que la vida de un directivo se trata de elegir
                        los resultados sobre las personas, y esto probablemente afecta la
                        dinámica con tus colaboradores y tus niveles de autosatisfacción.
                    </p>
                    <p>
                        Las organizaciones exitosas requieren de un líder capaz de
                        redirigir las energías del capital humano hacia el logro de
                        objetivos, con aptitudes que desplieguen una influencia positiva.
                    </p>
                    <div className="li-key-points">
                        {keyPoints.map((point, i) => (
                            <div className="li-key-point" key={i}>
                                <i className="fas fa-check-circle" />
                                <span>{point}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="li-reflexion-img li-reveal li-reveal-delay-2">
                    <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
                        alt="Liderazgo CAPEX"
                    />
                </div>
            </section>

            {/* ── MÉTRICAS ───────────────────────────────────── */}
            <section className="li-metrics">
                <div className="li-metrics-eyebrow li-reveal">
                    <i className="fas fa-chart-line" />
                    Datos del programa
                </div>
                <h2 className="li-reveal li-reveal-delay-1">
                    Renueva tu perspectiva, visión,<br />
                    credibilidad e impacto profesional.
                </h2>
                <p className="li-metrics-sub li-reveal li-reveal-delay-2">
                    Un programa diseñado para directivos que buscan trascender y
                    dejar una huella real en sus organizaciones.
                </p>

                <div className="li-metrics-grid">
                    {/* Card 1 — Horas */}
                    <div className="li-metric-card li-reveal li-reveal-delay-1">
                        <div className="li-metric-icon-wrap">
                            <i className="fas fa-history" />
                        </div>
                        <h3
                            className="li-counter"
                            data-target="44"
                            data-suffix="h"
                        >
                            0h
                        </h3>
                        <p>Horas de formación intensiva</p>
                    </div>

                    {/* Card 2 — Módulos */}
                    <div className="li-metric-card li-reveal li-reveal-delay-2">
                        <div className="li-metric-icon-wrap">
                            <i className="fas fa-cubes" />
                        </div>
                        <h3
                            className="li-counter"
                            data-target="6"
                        >
                            0
                        </h3>
                        <p>Módulos especializados</p>
                    </div>

                    {/* Card 3 — CTA */}
                    <div className="li-metric-card cta-card li-reveal li-reveal-delay-3">
                        <div className="li-metric-icon-wrap">
                            <i className="fas fa-rocket" />
                        </div>
                        <h3>¡Empieza ya!</h3>
                        <p>Las inscripciones están abiertas ahora mismo.</p>
                        <a href="#inscripcion" className="li-btn-white">
                            <i className="fas fa-arrow-right" />
                            Inscribirme
                        </a>
                    </div>
                </div>
            </section>

            {/* ── METODOLOGÍA ────────────────────────────────── */}
            <section className="li-metodologia">
                <div className="li-section-header li-reveal">
                    <div className="li-section-eyebrow">
                        <i className="fas fa-cogs" />
                        Cómo aprendemos
                    </div>
                    <h2>Metodología de Aprendizaje</h2>
                    <p>
                        Combinamos las técnicas más efectivas para garantizar un
                        aprendizaje profundo y aplicable desde el primer día.
                    </p>
                </div>

                <div className="li-timeline-wrap">
                    <div className="li-metodo-grid">
                        {metodologia.map((item, i) => (
                            <div
                                className={`li-metodo-item li-reveal li-reveal-delay-${i + 1}`}
                                key={i}
                            >
                                <div className="li-metodo-icon">
                                    <i className={item.icon} />
                                </div>
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA FINAL ──────────────────────────────────── */}
            <section className="li-cta" id="inscripcion">
                <div className="li-cta-content li-reveal">
                    <div className="li-section-eyebrow" style={{ marginBottom: 16 }}>
                        <i className="fas fa-envelope-open-text" />
                        ¿Listo para comenzar?
                    </div>
                    <h2>Da el siguiente paso en tu carrera directiva</h2>
                    <p>
                        Únete a los líderes que ya transformaron su forma de dirigir
                        equipos y organizaciones. Las plazas son limitadas, reserva
                        la tuya hoy mismo.
                    </p>
                    <div className="li-cta-actions">
                        <a href="mailto:info@capex.edu.do" className="li-btn-primary">
                            <i className="fas fa-paper-plane" />
                            Solicitar información
                        </a>
                    </div>
                </div>

                <div className="li-cta-card li-reveal li-reveal-delay-2">
                    <h4>Información de contacto</h4>
                    <div className="li-cta-contact-item">
                        <div className="c-icon"><i className="fas fa-envelope" /></div>
                        <div className="c-text">
                            <strong>Correo</strong>
                            <span>info@capex.edu.do</span>
                        </div>
                    </div>
                    <div className="li-cta-contact-item">
                        <div className="c-icon"><i className="fas fa-phone" /></div>
                        <div className="c-text">
                            <strong>Teléfono</strong>
                            <span>+1 (809) 575-1800</span>
                        </div>
                    </div>
                    <div className="li-cta-contact-item">
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