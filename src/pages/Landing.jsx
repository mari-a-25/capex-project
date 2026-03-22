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
        <section className="hero">
            <div className="hero-left">
                <div className="hero-badge-tag">CENTRO DE INNOVACIÓN Y EDUCACIÓN</div>
                <h1>Transformando la Región<br />Norte a través del Conocimiento</h1>
                <p>Impulsamos el desarrollo profesional con programas innovadores diseñados para el crecimiento empresarial.</p>
                <div className="hero-buttons">
                    <Link to="/login" className="hero-btn-primary">ACCEDER →</Link>
                    <button onClick={scrollToPrograms} className="hero-btn-secondary">EXPLORAR OFERTA →</button>
                </div>
            </div>
            <div className="right-hero">
                <div className="hero-card-image">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978" alt="Training" />
                </div>
                <div className="small-card">+50,000 profesionales capacitados</div>
            </div>
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

// ============= PROGRAMS SECTION (CAROUSEL) =============
const ProgramsSection = () => {
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [programs, setPrograms] = useState([]);
    const { getCursos } = useAirtableData();
    const [currentIndex, setCurrentIndex] = useState(0);

    const fallbacks = [
        {
            id: 'f1', title: 'Escuela de Gerentes', description: 'Transformamos profesionales en líderes estratégicos con visión global y herramientas innovadoras de gestión.',
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800', nivel: 'Diplomado', duracion: '6 Meses'
        },
        {
            id: 'f2', title: 'HR Mastery: Gestión Humana', description: 'Potenciamos a los líderes de gestión humana con metodologías avanzadas e inteligencia emocional.',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', nivel: 'Especialidad', duracion: 'Flexible'
        },
        {
            id: 'f3', title: 'Mandos Medios', description: 'Preparamos a los mandos medios para convertirse en el motor de ejecución estratégica de la empresa.',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', nivel: 'Taller', duracion: 'Presencial'
        }
    ];

    useEffect(() => {
        getCursos().then(records => {
            if (records.length > 0) {
                const formatted = records.map(r => ({
                    id: r.id,
                    title: r.fields.Titulo || r.fields.Name || r.fields.Title || '',
                    description: r.fields.Descripcion || r.fields.Description || r.fields.DescripcionCorta || 'Programa de alto nivel para profesionales.',
                    longDesc: r.fields.LongDescription || r.fields.Descripción_larga || r.fields.Descripcion || '',
                    image: (() => {
                        const img = r.fields.Imagen;
                        if (Array.isArray(img)) return img[0]?.url || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800';
                        return typeof img === 'string' ? img : 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800';
                    })(),
                    nivel: r.fields.Nivel || r.fields.Tipo || 'Programa',
                    duracion: r.fields.Duracion || 'Flexible',
                })).filter(p => p.title.trim() !== '');
                setPrograms(formatted.length >= 3 ? formatted : [...formatted, ...fallbacks.slice(formatted.length)]);
            } else {
                setPrograms(fallbacks);
            }
        }).catch(err => {
            console.error('Error cargando programas', err);
            setPrograms(fallbacks);
        });
    }, [getCursos]);

    const visibleCards = 3;
    const maxIndex = Math.max(0, programs.length - visibleCards);

    const handleNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Calculate translate offset dynamically matching the 40px gap defined in CSS
    const translateOffset = `calc(-${currentIndex} * (33.333% - 27px + 40px))`;

    return (
        <section className="destacados-section" id="programas">
            <div className="section-header-carousel">
                <h2>Programas Insignia</h2>
                <p>Formación ejecutiva de alto impacto diseñada para los retos del mercado actual.</p>
            </div>
            
            <div className="carousel-container">
                <button 
                    className="carousel-btn prev" 
                    onClick={handlePrev}
                    style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                    className="carousel-btn next" 
                    onClick={handleNext}
                    style={{ visibility: currentIndex >= maxIndex ? 'hidden' : 'visible' }}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
                
                <div 
                    className="carousel-track" 
                    style={{ transform: `translateX(${translateOffset})` }}
                >
                    {programs.map((program, idx) => (
                        <div className="program-card-carrusel" key={program.id || idx}>
                            <div className="card-image-wrapper">
                                <img src={program.image} alt={program.title} />
                            </div>
                            <div className="card-content-carrusel">
                                <h3>{program.title}</h3>
                                <p>{program.description}</p>
                                <div className="card-tags">
                                    <span className="tag">{program.nivel}</span>
                                    <span className="tag">{program.duracion}</span>
                                </div>
                                <button className="card-btn-carrusel" onClick={() => setSelectedProgram(program)}>Ver Programa</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Program Details Modal (Mantenido intacto el diseño existente al abrir) */}
            {selectedProgram && (
                <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedProgram(null)}>
                    <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedProgram(null)}>✕</button>
                        <div className="modal-header">
                            <BookOpen size={48} />
                            <h2>{selectedProgram.title}</h2>
                        </div>
                        <div className="modal-body">
                            <p>{selectedProgram.longDesc || selectedProgram.description}</p>
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
                                    <p>Modalidad: {selectedProgram.duracion}. Horarios compatibles con jornada laboral.</p>
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

// ============= CONOCE NUESTROS PROGRAMAS SECTION =============
const ConoceProgramasSection = () => {
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <section className={`conoce-section ${inView ? 'reveal' : ''}`} id="conoce-section" ref={ref}>
            <div className="conoce-image-container">
                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1600" alt="Equipo Capex" />
            </div>
            <div className="conoce-text-container">
                <h2>Conoce Nuestros Programas</h2>
                <p>Nos transformamos digitalmente para servirte. Mantenemos la experiencia acumulada durante años y nos renovamos con las mejores prácticas actuales.</p>
                <Link to="/programas" className="btn-ver-programas">VER PRÓXIMOS PROGRAMAS</Link>
            </div>
        </section>
    );
};

// ============= ESPECIALIZACIONES SECTION =============
const EspecializacionesSection = () => {
    return (
        <section className="especializaciones-section">
            <div className="esp-header">
                <h2>Especializaciones</h2>
                <p>Alcanza todo tu potencial</p>
            </div>
            <div className="especialidades-grid">
                <div className="esp-card">
                    <i className="fas fa-laptop-code"></i> <h3>Tecnología</h3>
                    <p>Domina las herramientas digitales que están liderando la transformación global.</p>
                </div>
                <div className="esp-card">
                    <i className="fas fa-sitemap"></i> <h3 className="highlight-underline">Desarrollo <br/> Organizacional</h3>
                    <p>Potencia el talento humano y la cultura de tu empresa para resultados sostenibles.</p>
                </div>
                <div className="esp-card">
                    <i className="fas fa-chart-pie"></i> <h3>Negocios</h3>
                    <p>Estrategias comerciales y financieras diseñadas para el mercado competitivo actual.</p>
                </div>
                <div className="esp-card">
                    <i className="fas fa-cogs"></i> <h3>Operaciones</h3>
                    <p>Optimiza procesos y cadena de suministro con metodologías de eficiencia de clase mundial.</p>
                </div>
            </div>
        </section>
    );
};

// ============= ALIADOS SECTION =============
const AliadosSection = () => {
    // Definimos los aliados base
    const aliados = [
        { img: "/aliados/human.png", alt: "Human" },
        { img: "/aliados/change.png", alt: "Change" },
        { img: "/aliados/brainx.png", alt: "Brainx" },
        { img: "/aliados/afp.png", alt: "AFP" },
        { img: "/aliados/Katy.png", alt: "Katy" },
        { img: "/aliados/Lissette.png", alt: "Lissette" },
        { img: "/aliados/venti.png", alt: "Venti" }
    ];

    // Duplicamos el array para que el scroll infinito funcione fluidamente
    const aliadosDuplicados = [...aliados, ...aliados];

    return (
        <div className="aliados-container">
            <h2 className="aliados-title">Nuestros Aliados Estratégicos</h2>
            <div className="logo-slider">
                {aliadosDuplicados.map((aliado, idx) => (
                    <div className="logo-slide" key={idx}>
                        <img src={aliado.img} alt={aliado.alt} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============= SIMPOSIO SECTION =============
const SimposioSection = () => {
    return (
        <section className="simposio-section" id="simposio">
            <div className="simposio-container">
                <div className="simposio-poster">
                    <img src="/simpiosio.png" alt="Regeneración Educativa" />
                </div>
                <div className="simposio-info">
                    <p style={{ color: '#5abaf1', fontWeight: '600', marginBottom: '10px' }}>PROYECTO ESPECIAL</p>
                    <h2>10mo. Simposio de Capacitación en la República Dominicana:<br/> <span>"Regeneración Educativa: Innovación y Trascendencia"</span></h2>
                    <a href="https://www.youtube.com/watch?v=FOfpE_9E4_o" target="_blank" rel="noopener noreferrer" className="btn-acceder">
                        Ver Video Completo <i className="fas fa-play" style={{ marginLeft: '10px', fontSize: '14px' }}></i>
                    </a>
                </div>
            </div>
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
            <ConoceProgramasSection />
            <EspecializacionesSection />
            <AliadosSection />
            <SimposioSection />
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
