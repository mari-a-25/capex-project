import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import {
    BookOpen,
    Users,
    Lightbulb,
    MapPin,
    Phone,
    Mail,
    Instagram,
    Facebook,
    Linkedin,
    ArrowRight,
    ShieldCheck,
    MessageCircle,
    Calendar,
    Play
} from 'lucide-react';
import { useAirtableData } from '../services/useAirtableData';
import './Landing.css';

// ============= SCROLL ANIMATION HOOK =============
const useScrollAnimation = () => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });
    return { ref, inView };
};

// ============= TYPEWRITER EFFECT =============
const TypewriterText = ({ text, delay = 0 }) => {
    const [displayText, setDisplayText] = useState('');
    useEffect(() => {
        if (displayText.length === text.length) return;
        const timer = setTimeout(() => {
            setDisplayText(text.slice(0, displayText.length + 1));
        }, 50);
        return () => clearTimeout(timer);
    }, [displayText, text]);

    return <span>{displayText}</span>;
};

// ============= HERO SECTION =============
const HeroSection = () => {
    const scrollToPrograms = () => {
        const element = document.getElementById('programas');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="hero-section">
            <div className="hero-background">
                <div className="particles">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="particle"
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 8 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>
                <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop"
                    alt="CAPEX Hero"
                    className="hero-bg-image"
                />
                <div className="hero-overlay" />
            </div>

            <div className="container hero-container">
                <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="hero-badge">Centro de Innovación y Educación</div>
                    <h1 className="hero-title">
                        <TypewriterText text="Transformando la Región Norte a través del Conocimiento" />
                    </h1>
                    <motion.p className="hero-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                        CAPEX es un órgano catalizador de grandes proyectos de emprendimiento e innovación,
                        desarrollando iniciativas académicas enfocadas en el ámbito profesional y empresarial.
                    </motion.p>

                    <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
                        <Link to="/login" className="btn btn-primary btn-lg hero-btn">
                            Acceder <ArrowRight size={18} />
                        </Link>
                        <button onClick={scrollToPrograms} className="btn btn-outline btn-lg hero-btn">
                            Explorar Oferta <ArrowRight size={18} />
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Quick Programs Bar */}
            <motion.div className="quick-programs-bar" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.5 }}>
                {[
                    { icon: BookOpen, label: 'Diplomados' },
                    { icon: Users, label: 'Talleres' },
                    { icon: Lightbulb, label: 'Charlas' },
                    { icon: Users, label: 'Networking' }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className="quick-item"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 3.5 + i * 0.2 }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                    >
                        <item.icon size={24} />
                        <span>{item.label}</span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

// ============= PROGRAM CARD =============
const ProgramCard = ({ title, description, icon: Icon, image, features, cta, delay, onDetailsClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="program-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6 }}
            viewport={{ once: true, margin: '-100px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="program-card-image">
                <img src={image} alt={title} />
                <motion.div className="program-overlay" animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }}>
                    <Icon size={48} />
                </motion.div>
            </div>

            <div className="program-card-content">
                <h3 className="program-title">{title}</h3>
                <p className="program-description">{description}</p>

                {features && (
                    <div className="program-features">
                        {features.map((feature, i) => (
                            <span key={i} className="feature-badge">
                                {feature}
                            </span>
                        ))}
                    </div>
                )}

                <motion.button className="btn btn-primary btn-sm program-cta" whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(16,115,179,0.6)' }} onClick={onDetailsClick}>
                    {cta} <ArrowRight size={16} />
                </motion.button>
            </div>
        </motion.div>
    );
};

// ============= PROGRAMS SECTION =============
const ProgramsSection = () => {
    const [selectedProgram, setSelectedProgram] = useState(null);

    const programs = [
        {
            id: 1,
            title: 'Diplomados',
            description: 'Programas profundos con certificación académica avalada y enfoque práctico.',
            icon: BookOpen,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop',
            features: ['Certificación avalada', 'Enfoque práctico', '6-12 meses'],
            cta: 'Ver programa'
        },
        {
            id: 2,
            title: 'Talleres In-Company',
            description: 'Formación personalizada diseñada exclusivamente para las necesidades de su empresa.',
            icon: Users,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop',
            features: ['Personalizado', 'Tu equipo', 'Flexible'],
            cta: 'Solicitar propuesta'
        },
        {
            id: 3,
            title: 'Charlas de Innovación',
            description: 'Espacios de networking y vanguardia sobre tendencias globales y emprendimiento.',
            icon: Lightbulb,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop',
            features: ['En vivo', 'Networking', 'Próxima en 18 días'],
            cta: 'Reservar asiento'
        },
        {
            id: 4,
            title: 'Programas Ejecutivos',
            description: 'Formación de alto nivel para líderes y ejecutivos en transformación digital.',
            icon: ShieldCheck,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop',
            features: ['Ejecutivos', 'Transformación', 'Premium'],
            cta: 'Más información'
        }
    ];

    return (
        <section className="section-padding programs-section" id="programas">
            <div className="container">
                <motion.div className="section-header" initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}>
                    <h2 className="section-title">Programas Destacados</h2>
                    <p className="section-subtitle">Formación ejecutiva diseñada para los retos del mercado actual.</p>
                </motion.div>

                <div className="programs-grid">
                    {programs.map((program, i) => (
                        <ProgramCard
                            key={program.id}
                            {...program}
                            delay={i * 0.1}
                            onDetailsClick={() => setSelectedProgram(program)}
                        />
                    ))}
                </div>

                <div className="programs-banner">
                    <div className="programs-banner-content">
                        <h3>¿Quieres ver más programas?</h3>
                        <p>
                            Aquí mostramos una selección destacada, pero hay mucho más por descubrir.
                            Visita la página completa o solicita un programa diseñado a tu medida.
                        </p>
                        <Link to="/programas" className="btn btn-secondary btn-lg">
                            Ver catálogo completo
                        </Link>
                    </div>
                </div>
            </div>

            {/* Program Details Modal */}
            {selectedProgram && (
                <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedProgram(null)}>
                    <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedProgram(null)}>✕</button>
                        <div className="modal-header">
                            <selectedProgram.icon size={48} />
                            <h2>{selectedProgram.title}</h2>
                        </div>
                        <div className="modal-body">
                            <p>{selectedProgram.description}</p>
                            <div className="modal-accordion">
                                <details>
                                    <summary>📚 Temario</summary>
                                    <ul>
                                        <li>Módulo 1: Fundamentos</li>
                                        <li>Módulo 2: Aplicación práctica</li>
                                        <li>Módulo 3: Casos de estudio</li>
                                        <li>Módulo 4: Proyecto final</li>
                                    </ul>
                                </details>
                                <details>
                                    <summary>💰 Inversión</summary>
                                    <p>Precio competitivo con opciones de pago flexible. Consulta disponibilidad de becas.</p>
                                </details>
                                <details>
                                    <summary>⏰ Horario y Modalidad</summary>
                                    <p>Modalidad híbrida o presencial. Horarios compatibles con jornada laboral.</p>
                                </details>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Link to="/programas" className="btn btn-primary">
                                Inscribirme Ahora
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
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
        { label: 'Estudiantes Activos', value: 2300, icon: Users },
        { label: 'Personas Capacitadas', value: 8540, icon: BookOpen },
        { label: 'Satisfacción', value: 95, icon: ShieldCheck, isSuffix: true },
        { label: 'Provincias Alcanzadas', value: 12, icon: MapPin }
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
            date: '2026-03-20',
            daysLeft: 8,
            speaker: 'Dr. Carlos Pérez',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop'
        },
        {
            title: 'Taller: Liderazgo en Equipos Remotos',
            date: '2026-03-25',
            daysLeft: 13,
            speaker: 'Mg. Laura González',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop'
        },
        {
            title: 'Seminario: Finanzas para Emprendedores',
            date: '2026-04-05',
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

// ============= MAIN LANDING PAGE =============
export default function Landing() {
    React.useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }, []);

    return (
        <div className="landing-page">
            {/* Navbar shared across pages */}
            <Navbar />

            <HeroSection />
            <ProgramsSection />
            <MetricsSection />
            <MissionSection />
            <TestimonialsSection />
            <UpcomingEventsSection />

            {/* Floating Chat */}
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

            {/* Footer */}
            <Footer />
        </div>
    );
}
