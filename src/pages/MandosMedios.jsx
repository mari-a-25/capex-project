import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './MandosMedios.css';

/* ── Hook reveal ── */
const useReveal = () => {
    useEffect(() => {
        const els = document.querySelectorAll('.mm-reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add('active');
                });
            },
            { threshold: 0.12 }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

/* ── Datos ── */
const competencias = [
    { icon: 'fas fa-users',            text: 'Facultará a sus equipos para multiplicar destrezas colectivas.' },
    { icon: 'fas fa-sitemap',          text: 'Analizará su función desde múltiples perspectivas gerenciales.' },
    { icon: 'fas fa-handshake',        text: 'Mantendrá relaciones constructivas y positivas con su equipo.' },
    { icon: 'fas fa-graduation-cap',   text: 'Aplicará conocimientos avanzados en conducción de personal.' },
    { icon: 'fas fa-balance-scale',    text: 'Resolverá conflictos de manera efectiva y empática.' },
    { icon: 'fas fa-chart-bar',        text: 'Incrementará la productividad global de su organización.' },
    { icon: 'fas fa-user-check',       text: 'Mejorará el desempeño real de sus colaboradores.' },
    { icon: 'fas fa-clipboard-list',   text: 'Aplicará planes de mantenimiento junto a su personal.' },
];

const perfiles = [
    { icon: 'fas fa-user-tie',    label: 'Encargados de área' },
    { icon: 'fas fa-users-cog',   label: 'Jefes de departamento' },
    { icon: 'fas fa-hard-hat',    label: 'Supervisores' },
    { icon: 'fas fa-user-plus',   label: 'Personal en formación' },
];

const metodoPasos = [
    { num: '01', title: 'Diagnóstico situacional',   desc: 'Identificamos brechas y oportunidades de mejora.' },
    { num: '02', title: 'Formación práctica',        desc: 'Aprendizaje basado en casos reales del sector.' },
    { num: '03', title: 'Aplicación inmediata',      desc: 'Herramientas de uso directo en el puesto de trabajo.' },
    { num: '04', title: 'Medición de resultados',    desc: 'KPIs y seguimiento del progreso individual.' },
];

const habilidades = [
    {
        icon: 'fas fa-comments',
        title: 'Trabajo en Equipo',
        desc: 'Liderazgo, inteligencia emocional, comunicación efectiva y manejo de conflictos para cohesionar equipos de alto rendimiento.',
    },
    {
        icon: 'fas fa-chart-line',
        title: 'Gestión Estratégica',
        desc: 'Gestión por KPIs e indicadores clave de rendimiento para garantizar el logro de metas y la alineación organizacional.',
    },
    {
        icon: 'fas fa-eye',
        title: 'Monitoreo y Control',
        desc: 'Instrucción en reducción de costos, estimación de estándares eficientes y supervisión de procesos operativos.',
    },
];

export default function MandosMedios() {
    useReveal();

    return (
        <div className="mm-page">
            <Navbar />

            {/* ── HERO ───────────────────────────────────────── */}
            <section className="mm-hero">
                <div className="mm-hero-bg" />
                <div className="mm-hero-shape-1" />
                <div className="mm-hero-shape-2" />

                <div className="mm-hero-content mm-reveal">
                    <div className="mm-hero-eyebrow">
                        <i className="fas fa-award" />
                        Programa Insignia CAPEX
                    </div>
                    <h1>
                        Profesionalización de{' '}
                        <span>Mandos Medios</span>
                    </h1>
                    <p className="mm-hero-desc">
                        Cambia del enfoque individual a uno de equipo: faculta, apoya
                        y promueve el desarrollo de tus colaboradores para multiplicar
                        el impacto de tu organización.
                    </p>
                    <div className="mm-hero-actions">
                        <a href="#inscripcion" className="mm-btn-primary">
                            <i className="fas fa-ticket-alt" />
                            Quiero Participar
                        </a>
                        <a href="#competencias" className="mm-btn-outline">
                            <i className="fas fa-arrow-down" />
                            Ver programa
                        </a>
                    </div>
                    <div className="mm-hero-stats">
                        <div className="mm-hero-stat">
                            <span className="val">8</span>
                            <span className="lbl">Competencias</span>
                        </div>
                        <div className="mm-hero-stat">
                            <span className="val">3</span>
                            <span className="lbl">Habilidades clave</span>
                        </div>
                        <div className="mm-hero-stat">
                            <span className="val">100%</span>
                            <span className="lbl">Aplicable</span>
                        </div>
                    </div>
                </div>

                <div className="mm-hero-scroll">
                    <i className="fas fa-chevron-down" />
                </div>
            </section>

            {/* ── DIRIGIDO A ─────────────────────────────────── */}
            <section className="mm-dirigido">
                <div className="mm-dirigido-inner mm-reveal">
                    <div className="mm-dirigido-icon">
                        <i className="fas fa-users-cog" />
                    </div>
                    <div className="mm-dirigido-text">
                        <span className="tag">¿A quién va dirigido?</span>
                        <h2>Diseñado para líderes en acción</h2>
                        <p>
                            Este programa está pensado para encargados, jefes de área o
                            departamento, supervisores y personal en entrenamiento para
                            ocupar posiciones de supervisión que deseen elevar su impacto.
                        </p>
                        <div className="mm-perfiles">
                            {perfiles.map((p, i) => (
                                <div className="mm-perfil-pill" key={i}>
                                    <i className={p.icon} />
                                    {p.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── COMPETENCIAS ───────────────────────────────── */}
            <section className="mm-competencias" id="competencias">
                <div className="mm-section-header mm-reveal">
                    <div className="mm-section-eyebrow">
                        <i className="fas fa-trophy" />
                        Lo que vas a lograr
                    </div>
                    <h2>Competencias y Habilidades a Desarrollar</h2>
                    <p>
                        Un conjunto sólido de capacidades directivas diseñadas para
                        transformar tu estilo de liderazgo desde el primer módulo.
                    </p>
                </div>

                <div className="mm-competencias-grid">
                    {competencias.map((item, i) => (
                        <div
                            className={`mm-competencia-item mm-reveal mm-reveal-delay-${(i % 4) + 1}`}
                            key={i}
                        >
                            <div className="mm-competencia-icon">
                                <i className={item.icon} />
                            </div>
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── METODOLOGÍA ────────────────────────────────── */}
            <section className="mm-metodologia">
                <div className="mm-metodo-inner">
                    <div className="mm-metodo-left mm-reveal">
                        <h2>Metodología<br />"Aprender Haciendo"</h2>
                        <p>
                            Empleamos un enfoque pragmático-funcional orientado totalmente
                            en resultados de inmediata aplicabilidad. Estarás facultado
                            para desarrollar soluciones a cualquier problema, necesidad u
                            oportunidad que se presente en tu organización.
                        </p>
                        <div className="mm-metodo-badge">
                            <i className="fas fa-bolt" />
                            Resultados desde el primer día
                        </div>
                    </div>

                    <div className="mm-metodo-steps mm-reveal mm-reveal-delay-2">
                        {metodoPasos.map((step, i) => (
                            <div className="mm-metodo-step" key={i}>
                                <div className="mm-step-num">{step.num}</div>
                                <div className="mm-step-info">
                                    <strong>{step.title}</strong>
                                    <span>{step.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HABILIDADES ────────────────────────────────── */}
            <section className="mm-habilidades">
                <div className="mm-section-header mm-reveal">
                    <div className="mm-section-eyebrow">
                        <i className="fas fa-layer-group" />
                        Áreas de formación
                    </div>
                    <h2>Tres Ejes de Desarrollo</h2>
                    <p>
                        Cada eje está diseñado para fortalecer una dimensión crítica
                        de la gestión de mandos medios.
                    </p>
                </div>

                <div className="mm-habilidades-grid">
                    {habilidades.map((item, i) => (
                        <div
                            className={`mm-habilidad-card mm-reveal mm-reveal-delay-${i + 1}`}
                            key={i}
                        >
                            <div className="mm-habilidad-icon">
                                <i className={item.icon} />
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA FINAL ──────────────────────────────────── */}
            <section className="mm-cta" id="inscripcion">
                <div className="mm-cta-content mm-reveal">
                    <div className="mm-section-eyebrow" style={{ marginBottom: 16 }}>
                        <i className="fas fa-envelope-open-text" />
                        ¿Listo para transformar tu liderazgo?
                    </div>
                    <h2>Da el salto que tu equipo está esperando</h2>
                    <p>
                        Únete a los supervisores y mandos medios que ya transformaron
                        su forma de gestionar equipos. Las plazas son limitadas,
                        reserva la tuya hoy mismo y empieza a generar impacto real.
                    </p>
                    <div className="mm-cta-actions">
                        <a href="mailto:info@capex.edu.do" className="mm-btn-primary">
                            <i className="fas fa-paper-plane" />
                            Solicitar información
                        </a>
                    </div>
                </div>

                <div className="mm-cta-card mm-reveal mm-reveal-delay-2">
                    <h4>Información de contacto</h4>
                    <div className="mm-cta-contact-item">
                        <div className="c-icon"><i className="fas fa-envelope" /></div>
                        <div className="c-text">
                            <strong>Correo</strong>
                            <span>info@capex.edu.do</span>
                        </div>
                    </div>
                    <div className="mm-cta-contact-item">
                        <div className="c-icon"><i className="fas fa-phone" /></div>
                        <div className="c-text">
                            <strong>Teléfono</strong>
                            <span>+1 (809) 575-1800</span>
                        </div>
                    </div>
                    <div className="mm-cta-contact-item">
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