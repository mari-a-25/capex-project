import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Users, BookOpen, ShieldCheck, MapPin, Calendar, Phone, Mail, MessageCircle } from 'lucide-react';
import { useAirtableData } from '../services/useAirtableData';

import './QuienesSomos.css';
import './Landing.css'; // Mantenemos los estilos de Landing que controlan las tarjetas de estos componentes.

// ============= SCROLL ANIMATION HOOK =============
const useScrollAnimation = () => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });
    return { ref, inView };
};

// ============= METRICS SECTION =============
const MetricCounter = ({ label, value, icon: Icon, isSuffix, delay }) => {
    const { ref, inView } = useScrollAnimation();

    return (
        <motion.div
            ref={ref}
            className="metric-counter"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay, duration: 0.6 }}
        >
            <div className="metric-icon">
                <Icon size={36} />
            </div>
            <div className="metric-number">
                {inView ? (
                    <CountUp
                        end={value}
                        duration={2.5}
                        suffix={isSuffix ? '%' : ''}
                        separator=","
                    />
                ) : (
                    '0'
                )}
            </div>
            <div className="metric-label">{label}</div>
        </motion.div>
    );
};

const MetricsSection = () => {
    const { ref: containerRef, inView } = useScrollAnimation();
    const { getMetrics } = useAirtableData();
    const [metricsData, setMetricsData] = useState([
        { label: 'Estudiantes activos', value: 2300, icon: Users },
        { label: 'Personas capacitadas', value: 8540, icon: BookOpen },
        { label: 'Satisfacción', value: 95, icon: ShieldCheck, isSuffix: true },
        { label: 'Provincias con capacitaciones', value: 12, icon: MapPin }
    ]);

    useEffect(() => {
        getMetrics().then(records => {
            const filtered = records.filter(r => r.fields && r.fields.Nombre && typeof r.fields.Valor !== 'undefined');
            if (filtered.length > 0) {
                setMetricsData(
                    filtered.map((r, i) => ({
                        label: r.fields.Nombre,
                        value: r.fields.Valor,
                        icon: [Users, BookOpen, ShieldCheck, MapPin][i % 4],
                        isSuffix: r.fields.Tipo === 'porcentaje'
                    }))
                );
            }
        }).catch(err => console.error('Error loading metrics:', err));
    }, []);

    return (
        <section className="section-padding metrics-section" ref={containerRef}>
            <div className="container">
                <motion.div className="section-header" initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}>
                    <h2 className="section-title">Nuestro Impacto</h2>
                    <p className="section-subtitle">Datos en tiempo real sobre nuestra labor y alcance.</p>
                </motion.div>

                <div className="metrics-grid">
                    {metricsData.map((metric, i) => (
                        <MetricCounter key={i} {...metric} delay={i * 0.15} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============= MISSION SECTION =============
const MissionSection = () => {
    const { ref, inView } = useScrollAnimation();
    const [showTimeline, setShowTimeline] = useState(false);

    return (
        <section className="section-padding mission-section" ref={ref}>
            <div className="container mission-container">
                <motion.div className="mission-image" initial={{ opacity: 0, x: -50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop" alt="CAPEX Team" />
                </motion.div>

                <motion.div className="mission-text" initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
                    <div className="hero-badge">Nuestra Misión</div>
                    <h2>Impulsando el Talento de la Región Norte</h2>

                    {inView && (
                        <div className="mission-paragraph">
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                Somos un órgano catalizador de grandes proyectos de emprendimiento e innovación para Santiago y la Región Norte.
                            </motion.p>
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                                Desarrollamos iniciativas, programas y propuestas novedosas vinculadas al ámbito educativo para potenciar el talento dominicano.
                            </motion.p>
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                                Desde 2020, hemos transformado miles de vidas a través de la educación continua, el emprendimiento y la innovación.
                            </motion.p>
                        </div>
                    )}

                    <motion.button
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setShowTimeline(true)}
                    >
                        Conoce Nuestra Historia
                    </motion.button>

                    {showTimeline && (
                        <motion.div className="timeline-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowTimeline(false)}>
                            <motion.div className="timeline-content" initial={{ scale: 0.8 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}>
                                <button onClick={() => setShowTimeline(false)} className="modal-close">✕</button>
                                <h3>Hitos de CAPEX</h3>
                                <div className="timeline">
                                    <motion.div className="timeline-item" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
                                        <div className="timeline-year">2020</div>
                                        <p>Fundación de CAPEX como catalizador de innovación</p>
                                    </motion.div>
                                    <motion.div className="timeline-item" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                                        <div className="timeline-year">2021</div>
                                        <p>Primer diplomado y alcance a 5 provincias</p>
                                    </motion.div>
                                    <motion.div className="timeline-item" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                                        <div className="timeline-year">2023</div>
                                        <p>5,000+ participantes capacitados</p>
                                    </motion.div>
                                    <motion.div className="timeline-item" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                        <div className="timeline-year">2026</div>
                                        <p>Expansión nacional y programas ejecutivos</p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

// ============= TESTIMONIALS SECTION =============
const TestimonialsSection = () => {
    const testimonials = [
        {
            name: 'María García',
            company: 'Tech Startup',
            quote: 'Gracias a CAPEX lancé mi empresa. El diplomado fue transformador.',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1470&auto=format&fit=crop'
        },
        {
            name: 'Juan Rodríguez',
            company: 'Emprendimiento',
            quote: 'Las charlas de innovación me dieron nuevas perspectivas para mi negocio.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop'
        },
        {
            name: 'Carla López',
            company: 'Empresa Regional',
            quote: 'El taller in-company fue exactamente lo que nuestro equipo necesitaba.',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop'
        },
        {
            name: 'Pablo Martínez',
            company: 'Consultor',
            quote: 'Conecté con gente amazing en las charlas. Vale cada momento.',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1470&auto=format&fit=crop'
        },
        {
            name: 'Sofía Fernández',
            company: 'Innovadora',
            quote: 'CAPEX no solo educa, inspira. Lo recomiendo a todos.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop'
        },
        {
            name: 'Roberto Sánchez',
            company: 'Empresario',
            quote: 'El mejor ROI en capacitación que he hecho. Gracias CAPEX.',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop'
        }
    ];

    return (
        <section className="section-padding testimonials-section">
            <div className="container">
                <motion.div className="section-header" initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}>
                    <h2 className="section-title">Comunidad CAPEX</h2>
                    <p className="section-subtitle">Historias de éxito de nuestros egresados.</p>
                </motion.div>

                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.6 }}
                            viewport={{ once: true, margin: '-100px' }}
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        >
                            <img src={t.image} alt={t.name} className="testimonial-image" />
                            <div className="testimonial-content">
                                <p className="testimonial-quote">"{t.quote}"</p>
                                <p className="testimonial-name">{t.name}</p>
                                <p className="testimonial-company">{t.company}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============= UPCOMING EVENTS SECTION =============
const UpcomingEventsSection = () => {
    const events = [
        {
            title: 'Charla: Transformación Digital',
            date: '2026-03-19',
            daysLeft: 8,
            speaker: 'Dr. Carlos Pérez',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop'
        },
        {
            title: 'Taller: Liderazgo en Equipos Remotos',
            date: '2026-03-24',
            daysLeft: 13,
            speaker: 'Mg. Laura González',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop'
        },
        {
            title: 'Seminario: Finanzas para Emprendedores',
            date: '2026-04-04',
            daysLeft: 24,
            speaker: 'Lic. Fernando López',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop'
        }
    ];

    return (
        <section className="section-padding events-section">
            <div className="container">
                <motion.div className="section-header" initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}>
                    <h2 className="section-title">Próximos Eventos</h2>
                    <p className="section-subtitle">Charlas y talleres que no te puedes perder.</p>
                </motion.div>

                <div className="events-grid">
                    {events.map((event, i) => (
                        <motion.div
                            key={i}
                            className="event-card"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            viewport={{ once: true, margin: '-100px' }}
                            whileHover={{ x: 5 }}
                        >
                            <div className="event-image">
                                <img src={event.image} alt={event.title} />
                                <div className="event-days-badge">{event.daysLeft} días</div>
                            </div>
                            <div className="event-content">
                                <h4>{event.title}</h4>
                                <p className="event-speaker">👤 {event.speaker}</p>
                                <p className="event-date">📅 {new Date(event.date).toLocaleDateString('es-ES')}</p>
                                <motion.button className="btn btn-sm btn-primary" whileHover={{ scale: 1.05 }}>
                                    Reservar <Calendar size={14} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============= FLOATING CHAT BUTTON =============
const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.button
                className="floating-chat-btn"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <MessageCircle size={24} />
            </motion.button>

            {isOpen && (
                <motion.div className="chat-popup" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <div className="chat-header">
                        <h4>¿Necesitas ayuda?</h4>
                        <button onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                    <div className="chat-body">
                        <p>Contáctanos por WhatsApp para consultas rápidas o solicita una propuesta personizada.</p>
                        <div className="chat-actions">
                            <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                                WhatsApp
                            </a>
                            <Link to="#contacto" className="btn btn-sm btn-outline">
                                Formulario
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

const QuienesSomos = () => {
    return (
        <div className="quienes-somos-page">
            <Navbar />

            {/* Hero Section */}
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
                            Impulsando el talento y la competitividad de la Región Norte a través de educación continua, emprendimiento e innovación.
                        </p>
                    </div>
                </div>
            </section>

            <MetricsSection />
            <MissionSection />
            <TestimonialsSection />
            <UpcomingEventsSection />
            
            <FloatingChat />

            {/* Contact Section */}
            <section className="section-padding contact-section" id="contacto">
                <div className="container">
                    <motion.div className="section-header" initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}>
                        <h2 className="section-title">Contáctanos</h2>
                        <p className="section-subtitle">Estamos aquí para responder tus preguntas.</p>
                    </motion.div>

                    <motion.div className="contact-grid" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}>
                        <div className="contact-item">
                            <Phone size={28} />
                            <h4>Teléfono</h4>
                            <p>+1 (809) XXX-XXXX</p>
                        </div>
                        <div className="contact-item">
                            <Mail size={28} />
                            <h4>Email</h4>
                            <p>info@capex.do</p>
                        </div>
                        <div className="contact-item">
                            <MapPin size={28} />
                            <h4>Ubicación</h4>
                            <p>Santiago, Región Norte</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default QuienesSomos;
