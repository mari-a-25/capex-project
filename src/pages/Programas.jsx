import React, { useEffect, useState } from 'react';
import { Star, Info, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Programas.css';
import './QuienesSomos.css';
import { useAirtableData } from '../services/useAirtableData';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const ProgramaMetric = ({ iconClassName, value, label, suffix }) => {
    const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
    return (
        <div className="qs-metric-item" ref={ref}>
            <i className={iconClassName} aria-hidden="true" />
            <h3>
                {inView ? (
                    <CountUp end={value} duration={2.2} separator="," suffix={suffix || ''} />
                ) : (
                    '0'
                )}
            </h3>
            <p>{label}</p>
        </div>
    );
};

const Programas = () => {
    const { getCursos, registerEnrollment, queueEmail } = useAirtableData();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [enrolling, setEnrolling] = useState(false);
    // payment UI state
    const [showPayment, setShowPayment] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({ email: '', cardNumber: '' });

    // Fetch courses from Airtable on mount
    useEffect(() => {
        const fetch = async () => {
            try {
                const records = await getCursos();
                const formatted = records.map(r => ({
                    id: r.id,
                    title: r.fields.Titulo || r.fields.Name || r.fields.Title || 'Curso sin título',
                    shortDesc: r.fields.Descripcion || r.fields.Description || '',
                    longDesc: r.fields.LongDescription || r.fields.Descripción_larga || r.fields.Descripcion || '',
                    image: (() => {
                        const img = r.fields.Imagen;
                        if (Array.isArray(img)) return img[0]?.url || '';
                        return typeof img === 'string' ? img : '';
                    })(),
                    cupos: r.fields.Cupos ?? 0,
                    precio: r.fields.Costo ?? r.fields.Precio ?? 0,
                    duracion: r.fields.Duracion || '',
                    nivel: r.fields.Nivel || '',
                    instructor: r.fields.Instructor || '',
                    horario: r.fields.Horario || '',
                    rating: r.fields.Rating ?? 0,
                    estudiantes: r.fields.Estudiantes ?? 0,
                }));
                setCourses(formatted);
            } catch (e) {
                console.error('Error fetching courses', e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    // Handle enrollment (creates a record in MATRÍCULAS)
    // emailArg is optional; when payment modal collects email we'll pass it
    const handleEnroll = async (curso, emailArg) => {
        let email = emailArg;
        if (!email) {
            email = window.prompt('Introduce tu correo electrónico para recibir el formulario de registro:');
        }
        if (!email) {
            return; // user cancelled
        }
        setEnrolling(true);
        try {
            // record provisional matrícula (using email in Usuario field for now)
            await registerEnrollment({
                Curso: [curso.id],
                Usuario: email,
                Estado: 'Pendiente',
                Pago: 'Pendiente',
            });

            // build link to the detailed form
            const formLink = `${window.location.origin}/registro?cursoId=${curso.id}&email=${encodeURIComponent(email)}`;

            // queue email via Airtable; an automation can pick this up and send it
            await queueEmail({
                To: email,
                Subject: `Completa tu registro para ${curso.title}`,
                Body: `Gracias por tu pago conectado al curso ${curso.title}.\n" +
                      "Por favor, completa tu información en el siguiente enlace:\n${formLink}`
            });

            // redirect user immediately so they can fill the form right away
            window.location.href = formLink;
        } catch (e) {
            console.error(e);
            alert('Error al procesar la inscripción.');
        } finally {
            setEnrolling(false);
            setSelected(null);
        }
    };

    return (
        <div className="cursos-page">
            {/* shared Navbar */}
            <Navbar />

            {/* Info Blocks (duplicados de Nosotros) */}
            <header className="qs-hero-wrap programas-hero">
                <div className="qs-hero-content">
                    <h1>Programas y Cursos</h1>
                    <p>Formación práctica para impulsar talento, innovación y productividad en la región.</p>
                </div>
            </header>

            <section className="qs-metrics-shell" aria-label="Métricas CAPEX">
                <div className="qs-metrics-container">
                    <ProgramaMetric iconClassName="fas fa-user-graduate" value={8500} label="Egresados" />
                    <ProgramaMetric iconClassName="fas fa-handshake" value={150} label="Empresas Aliadas" />
                    <ProgramaMetric iconClassName="fas fa-calendar-alt" value={500} label="Eventos Anuales" />
                    <ProgramaMetric iconClassName="fas fa-award" value={98} label="Calidad Educativa" suffix="%" />
                </div>
            </section>

            <section className="qs-about-section programas-about">
                <div className="qs-about-content">
                    <span className="qs-tagline">Nuestra oferta</span>
                    <h2>Aprendizaje orientado a resultados</h2>
                    <p>Programas alineados a la realidad del mercado, con un enfoque práctico para el crecimiento profesional.</p>
                    <p>Explora los cursos disponibles y completa tu inscripción en minutos.</p>
                </div>
                <div className="qs-about-img-frame">
                    <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop"
                        alt="Programas CAPEX"
                    />
                    <div className="qs-floating-metric" aria-label="Más de 50,000 estudiantes">
                        <div>
                            <span className="number">+50,000</span>
                            <span className="label">Estudiantes</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="qs-mvv-container programas-mvv">
                <div className="qs-mvv-grid">
                    <div className="qs-mvv-card">
                        <div className="qs-icon-box">
                            <i className="fas fa-bullseye fa-2x" aria-hidden="true" />
                        </div>
                        <h4>Misión</h4>
                        <p>Fortalecemos el talento humano de las organizaciones para el logro de su desarrollo sostenible.</p>
                    </div>
                    <div className="qs-mvv-card">
                        <div className="qs-icon-box">
                            <i className="fas fa-eye fa-2x" aria-hidden="true" />
                        </div>
                        <h4>Visión</h4>
                        <p>Transformamos el conocimiento en riqueza.</p>
                    </div>
                    <div className="qs-mvv-card">
                        <div className="qs-icon-box">
                            <i className="fas fa-star fa-2x" aria-hidden="true" />
                        </div>
                        <h4>Valores</h4>
                        <div className="qs-valores-pills">
                            <span className="qs-pill">Excelencia</span>
                            <span className="qs-pill">Compromiso</span>
                            <span className="qs-pill">Sostenibilidad</span>
                            <span className="qs-pill">Innovación</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Grid */}
            <section className="section-padding courses-section" id="cursos">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Descubre nuestros cursos</h2>
                        <p className="section-subtitle">Formación práctica y cercana para impulsar tu carrera.</p>
                    </div>
                    {loading ? (
                        <p className="loading-text">Cargando cursos…</p>
                    ) : (
                        <div className="courses-grid">
                            {courses.map(c => (
                                <div key={c.id} className="course-card">
                                    <div className="course-image-wrapper">
                                        {c.image ? (
                                            <img src={c.image} alt={c.title} className="course-image" />
                                        ) : (
                                            <div className="placeholder-image">Imagen pendiente</div>
                                        )}
                                    </div>
                                    <div className="course-content">
                                        <h3 className="course-title">{c.title}</h3>
                                        <p className="course-description">{c.shortDesc}</p>
                                        <div className="course-info">
                                            <span className="duration">Duración: {c.duracion}</span>
                                            {c.nivel && <span className="level">Nivel: {c.nivel}</span>}
                                            <span className="price">Precio: ${c.precio}</span>
                                            <span className="cupo">Cupos: {c.cupos}</span>
                                        </div>
                                        <div className="course-actions">
                                            <button className="btn btn-secondary" onClick={() => setSelected(c)}>
                                                Más información
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal Detail View */}
            {selected && !showPayment && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
                        <div className="modal-image">
                            {selected.image && <img src={selected.image} alt={selected.title} />}
                        </div>
                        <div className="modal-body">
                            <h2>{selected.title}</h2>
                            <p className="modal-description">{selected.longDesc || selected.shortDesc}</p>
                            <div className="modal-details-grid">
                                {selected.duracion && <div className="detail-box"><h4>Duración</h4><p>{selected.duracion}</p></div>}
                                {selected.nivel && <div className="detail-box"><h4>Nivel</h4><p>{selected.nivel}</p></div>}
                                {selected.instructor && <div className="detail-box"><h4>Instructor</h4><p>{selected.instructor}</p></div>}
                                {selected.horario && <div className="detail-box"><h4>Horario</h4><p>{selected.horario}</p></div>}
                                <div className="detail-box price-box"><h4>Precio</h4><p className="big-price">${selected.precio}</p></div>
                                <div className="detail-box"><h4>Cupos disponibles</h4><p>{selected.cupos}</p></div>
                                {selected.rating > 0 && (
                                    <div className="detail-box">
                                        <h4>Rating</h4>
                                        <p><Star size={16} /> {selected.rating}</p>
                                    </div>
                                )}
                                {selected.estudiantes > 0 && (
                                    <div className="detail-box">
                                        <h4>Estudiantes</h4>
                                        <p><Users size={16} /> {selected.estudiantes}</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button className="btn btn-primary btn-lg" onClick={() => handleEnroll(selected)} disabled={enrolling}>
                                    {enrolling ? 'Registrando…' : 'Inscribirme y Pagar'}
                                </button>
                                <button className="btn btn-secondary btn-lg" onClick={() => alert('Próximamente: formulario de contacto directo con instructor')}>
                                    <Info size={16} style={{ marginRight: 8 }} />
                                    Consultar instructor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* payment modal */}
            {showPayment && selected && (
                <div className="modal-overlay" onClick={() => setShowPayment(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowPayment(false)}>&times;</button>
                        <div className="modal-body">
                            <h2>Pagar curso: {selected.title}</h2>
                            <p>Introduce tu correo y datos de pago.</p>
                            <div className="form-group-modern">
                                <label>Correo electrónico</label>
                                <input
                                    type="email"
                                    value={paymentInfo.email}
                                    onChange={e => setPaymentInfo({ ...paymentInfo, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group-modern">
                                <label>Número de tarjeta (simulado)</label>
                                <input
                                    type="text"
                                    value={paymentInfo.cardNumber}
                                    onChange={e => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                                    placeholder="0000 0000 0000 0000"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={async () => {
                                        // pretend payment succeeded
                                        setShowPayment(false);
                                        await handleEnroll(selected, paymentInfo.email);
                                    }}
                                    disabled={!paymentInfo.email || !paymentInfo.cardNumber || enrolling}
                                >
                                    Confirmar pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Programas;
