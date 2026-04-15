import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CapexEspacios.css';

/* ── Hook reveal ── */
const useReveal = () => {
    useEffect(() => {
        const els = document.querySelectorAll('.ce-reveal');
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }),
            { threshold: 0.1 }
        );
        els.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

/* ── Datos ── */
const espacios = [
    {
        key: 'salas',
        tag: 'Reuniones Ejecutivas',
        title: 'Salas de Reunión',
        desc: 'Espacios diseñados para reuniones ejecutivas, talleres y dinámicas de trabajo colaborativo. Equipados con tecnología audiovisual de vanguardia para potenciar cada encuentro.',
        capacidad: 'Hasta 20 personas',
        features: [
            { icon: 'fas fa-tv',        label: 'Pantalla 4K' },
            { icon: 'fas fa-video',     label: 'Videoconferencia' },
            { icon: 'fas fa-wifi',      label: 'WiFi rápido' },
            { icon: 'fas fa-microphone',label: 'Sistema de audio' },
            { icon: 'fas fa-coffee',    label: 'Coffee break' },
            { icon: 'fas fa-lock',      label: 'Privacidad total' },
        ],
        images: [
            'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1462826303086-329426d1aef5?auto=format&fit=crop&w=900&q=80',
        ],
        reverse: false,
    },
    {
        key: 'laboratorio',
        tag: 'Innovación & Tecnología',
        title: 'Laboratorio',
        desc: 'Espacio de innovación y práctica tecnológica, dotado del equipamiento necesario para actividades técnicas, científicas y de formación especializada.',
        capacidad: 'Hasta 30 personas',
        features: [
            { icon: 'fas fa-laptop',        label: 'Computadoras HP' },
            { icon: 'fas fa-network-wired', label: 'Red cableada' },
            { icon: 'fas fa-shield-alt',    label: 'Seguridad física' },
            { icon: 'fas fa-server',        label: 'Servidor local' },
            { icon: 'fas fa-print',         label: 'Impresoras' },
            { icon: 'fas fa-headphones',    label: 'Audífonos' },
        ],
        images: [
            'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
        ],
        reverse: true,
    },
    {
        key: 'auditorio',
        tag: 'Grandes Eventos',
        title: 'Auditorio',
        desc: 'El escenario ideal para conferencias magistrales, presentaciones corporativas, ceremonias y eventos de gran envergadura. Diseñado con acústica de primer nivel.',
        capacidad: 'Hasta 200 personas',
        features: [
            { icon: 'fas fa-microphone-alt',  label: 'Sonido envolvente' },
            { icon: 'fas fa-lightbulb',       label: 'Iluminación escénica' },
            { icon: 'fas fa-film',            label: 'Proyección Full HD' },
            { icon: 'fas fa-chair',           label: 'Butacas numeradas' },
            { icon: 'fas fa-broadcast-tower', label: 'Transmisión live' },
            { icon: 'fas fa-wheelchair',      label: 'Accesibilidad' },
        ],
        images: [
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=80',
        ],
        reverse: false,
    },
    {
        key: 'multiuso',
        tag: 'Versatilidad Total',
        title: 'Espacio Multiuso',
        desc: 'La versatilidad en su máxima expresión. Un espacio totalmente adaptable a cualquier tipo de evento, actividad o requerimiento. Configúralo según tu visión.',
        capacidad: 'Hasta 150 personas',
        features: [
            { icon: 'fas fa-expand-arrows-alt', label: 'Área amplia' },
            { icon: 'fas fa-sliders-h',         label: 'Configuración libre' },
            { icon: 'fas fa-palette',           label: 'Ambientación personalizada' },
            { icon: 'fas fa-parking',           label: 'Estacionamiento' },
            { icon: 'fas fa-utensils',          label: 'Área de catering' },
            { icon: 'fas fa-door-open',         label: 'Múltiples accesos' },
        ],
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
        ],
        reverse: true,
    },
];

const aulaData = {
    key: 'aulas',
    tag: 'Enseñanza & Desarrollo',
    title: 'Aulas',
    desc: 'Salones concebidos como unidades básicas de enseñanza y desarrollo. Ambientes apropiados para el aprendizaje efectivo con equipamiento de calidad y distribución óptima.',
    capacidad: 'Hasta 40 personas',
    features: [
        { icon: 'fas fa-chalkboard', label: 'Pizarras inteligentes' },
        { icon: 'fas fa-wifi',       label: 'WiFi de alta velocidad' },
        { icon: 'fas fa-snowflake',  label: 'Climatización' },
        { icon: 'fas fa-chair',      label: 'Mobiliario ergonómico' },
        { icon: 'fas fa-video',      label: 'Proyector incluido' },
        { icon: 'fas fa-plug',       label: 'Estaciones de carga' },
    ],
    images: [
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85',
    ],
};

/* ── Componente carrusel mini dentro de la card ── */
const CardGallery = ({ images, title }) => {
    const [active, setActive] = useState(0);
    return (
        <div className="ce-espacio-img-wrap">
            <div className="ce-espacio-img-main">
                <img src={images[active]} alt={title} />
                <div className="ce-espacio-img-overlay" />
                <div className="ce-espacio-img-tag">Capex Espacios</div>
            </div>
            <div className="ce-thumbs">
                {images.map((img, i) => (
                    <div
                        key={i}
                        className={`ce-thumb ${i === active ? 'active' : ''}`}
                        onClick={() => setActive(i)}
                    >
                        <img src={img} alt={`${title} ${i + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ── Modal con carrusel ── */
const EspacioModal = ({ espacio, onClose }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!espacio) return;
        setCurrent(0);
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % espacio.images.length);
            if (e.key === 'ArrowLeft')  setCurrent(c => (c - 1 + espacio.images.length) % espacio.images.length);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [espacio, onClose]);

    useEffect(() => {
        document.body.style.overflow = espacio ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [espacio]);

    if (!espacio) return null;

    const prev = () => setCurrent(c => (c - 1 + espacio.images.length) % espacio.images.length);
    const next = () => setCurrent(c => (c + 1) % espacio.images.length);

    return (
        <div
            className={`ce-modal-backdrop ${espacio ? 'active' : ''}`}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="ce-modal-box">
                {/* Galería del modal */}
                <div className="ce-modal-gallery">
                    <img
                        src={espacio.images[current]}
                        alt={espacio.title}
                        className="ce-modal-gallery-img"
                    />
                    <div className="ce-modal-gallery-overlay" />

                    {/* Navegación */}
                    <button className="ce-gallery-nav prev" onClick={prev} aria-label="Anterior">
                        <i className="fas fa-chevron-left" />
                    </button>
                    <button className="ce-gallery-nav next" onClick={next} aria-label="Siguiente">
                        <i className="fas fa-chevron-right" />
                    </button>

                    {/* Dots */}
                    <div className="ce-gallery-dots">
                        {espacio.images.map((_, i) => (
                            <button
                                key={i}
                                className={`ce-gallery-dot ${i === current ? 'active' : ''}`}
                                onClick={() => setCurrent(i)}
                                aria-label={`Imagen ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Botón cerrar */}
                    <button className="ce-modal-close" onClick={onClose} aria-label="Cerrar">
                        <i className="fas fa-times" />
                    </button>
                </div>

                {/* Miniaturas del modal */}
                <div className="ce-modal-thumbs">
                    {espacio.images.map((img, i) => (
                        <div
                            key={i}
                            className={`ce-modal-thumb ${i === current ? 'active' : ''}`}
                            onClick={() => setCurrent(i)}
                        >
                            <img src={img} alt={`${espacio.title} ${i + 1}`} />
                        </div>
                    ))}
                </div>

                {/* Cuerpo del modal */}
                <div className="ce-modal-body">
                    <div className="ce-modal-tag">
                        <i className="fas fa-building" />
                        {espacio.tag}
                    </div>
                    <h3>{espacio.title}</h3>
                    <p>{espacio.desc}</p>
                    <div className="ce-modal-features">
                        {espacio.features.map((f, i) => (
                            <div className="ce-modal-feature" key={i}>
                                <i className={f.icon} />
                                {f.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Página principal ── */
export default function CapexEspacios() {
    useReveal();
    const [modalEspacio, setModalEspacio] = useState(null);

    return (
        <div className="ce-page">
            <Navbar />

            {/* ── HERO ─────────────────────────────────── */}
            <section className="ce-hero">
                <div className="ce-hero-bg" />
                <div className="ce-hero-shape-1" />
                <div className="ce-hero-shape-2" />

                <div className="ce-hero-content ce-reveal">
                    <div className="ce-hero-eyebrow">
                        <i className="fas fa-building" />
                        Capex Espacios
                    </div>
                    <h1>Espacios que Potencian tus Ideas</h1>
                    <p className="ce-hero-desc">
                        Instalaciones de primer nivel diseñadas para individuos,
                        empresas e instituciones que buscan productividad y excelencia.
                    </p>
                    <div className="ce-hero-stats">
                        <div className="ce-hero-stat">
                            <span className="val">5+</span>
                            <span className="lbl">Tipos de espacio</span>
                        </div>
                        <div className="ce-hero-stat">
                            <span className="val">500+</span>
                            <span className="lbl">Eventos / año</span>
                        </div>
                        <div className="ce-hero-stat">
                            <span className="val">98%</span>
                            <span className="lbl">Satisfacción</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── INTRO ────────────────────────────────── */}
            <section className="ce-intro">
                <div className="ce-intro-content ce-reveal">
                    <div className="ce-intro-eyebrow">
                        <i className="fas fa-info-circle" />
                        Sobre el servicio
                    </div>
                    <h2>Infraestructura Diseñada para el Éxito</h2>
                    <p>
                        Capex pone a disposición de individuos, empresas e
                        instituciones sus instalaciones para la realización de
                        presentaciones, conferencias, charlas, seminarios, reuniones,
                        ruedas de prensa, entrevistas laborales y demás actividades.
                    </p>
                    <p>
                        Nuestros espacios están concebidos, diseñados y equipados
                        con la finalidad de mejorar la productividad de las personas
                        que los utilizan, adaptándose a los criterios de los clientes
                        más selectivos.
                    </p>
                </div>
                <div className="ce-intro-img-wrap ce-reveal ce-reveal-delay-2">
                    <img
                        src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"
                        alt="Capex Espacios"
                    />
                    <div className="ce-intro-badge">
                        <span className="num">5+</span>
                        <span className="lbl">Tipos de Espacio</span>
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ────────────────────────────── */}
            <div className="ce-stats-bar ce-reveal">
                {[
                    { icon: 'fas fa-users',    num: '500+', lbl: 'Eventos por Año' },
                    { icon: 'fas fa-building', num: '5',    lbl: 'Tipos de Espacios' },
                    { icon: 'fas fa-wifi',     num: '100%', lbl: 'Equipados' },
                    { icon: 'fas fa-star',     num: '98%',  lbl: 'Satisfacción' },
                ].map((s, i) => (
                    <div className="ce-stat-item" key={i}>
                        <i className={s.icon} />
                        <span className="num">{s.num}</span>
                        <span className="lbl">{s.lbl}</span>
                    </div>
                ))}
            </div>

            {/* ── SECTION HEADER ───────────────────────── */}
            <div className="ce-section-header ce-reveal">
                <div className="ce-section-eyebrow">
                    <i className="fas fa-th-large" />
                    Nuestros Espacios
                </div>
                <h2>Elige tu Espacio Ideal</h2>
                <p>
                    Cada ambiente está pensado para maximizar tu rendimiento
                    y el de tu equipo.
                </p>
                <div className="ce-divider" />
            </div>

            {/* ── ESPACIOS ─────────────────────────────── */}
            <section className="ce-espacios">

                {/* Aulas — card hero ancha */}
                <div
                    className="ce-aula-hero ce-reveal"
                    onClick={() => setModalEspacio(aulaData)}
                >
                    <img
                        src={aulaData.images[0]}
                        alt="Aulas Capex"
                    />
                    <div className="ce-aula-overlay" />
                    <div className="ce-aula-content">
                        <span className="ce-aula-tag">
                            <i className="fas fa-graduation-cap" style={{ marginRight: 6 }} />
                            {aulaData.tag}
                        </span>
                        <h3>{aulaData.title}</h3>
                        <p>{aulaData.desc}</p>
                        <button
                            className="ce-btn-visualizar"
                            onClick={(e) => { e.stopPropagation(); setModalEspacio(aulaData); }}
                        >
                            <i className="fas fa-images" /> Ver galería
                        </button>
                    </div>
                </div>

                {/* Cards alternadas con galería de miniaturas */}
                {espacios.map((esp, i) => (
                    <div
                        key={esp.key}
                        className={`ce-espacio-card ce-reveal ce-reveal-delay-${(i % 3) + 1} ${esp.reverse ? 'reverse' : ''}`}
                    >
                        <CardGallery images={esp.images} title={esp.title} />

                        <div className="ce-espacio-content">
                            <div className="ce-espacio-tag">
                                <i className="fas fa-building" />
                                {esp.tag}
                            </div>
                            <h3>{esp.title}</h3>
                            <p>{esp.desc}</p>
                            <div className="ce-capacidad">
                                <i className="fas fa-users" />
                                {esp.capacidad}
                            </div>
                            <div className="ce-features">
                                {esp.features.map((f, j) => (
                                    <span className="ce-feature-pill" key={j}>
                                        <i className={f.icon} />
                                        {f.label}
                                    </span>
                                ))}
                            </div>
                            <button
                                className="ce-btn-visualizar"
                                onClick={() => setModalEspacio(esp)}
                            >
                                <i className="fas fa-images" /> Ver galería
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {/* ── CTA FINAL ────────────────────────────── */}
            <section className="ce-cta">
                <div className="ce-cta-shape" />
                <div className="ce-cta-inner ce-reveal">
                    <div className="ce-cta-eyebrow">
                        <i className="fas fa-calendar-check" />
                        ¿Listo para reservar?
                    </div>
                    <h2>Reserva tu Espacio Hoy</h2>
                    <p>
                        Contáctanos y un asesor te guiará para encontrar el espacio
                        perfecto para tu próximo evento o actividad.
                    </p>
                    <a href="mailto:info@capex.edu.do" className="ce-btn-white">
                        <i className="fas fa-envelope" />
                        Solicitar Información
                    </a>
                </div>
            </section>

            {/* ── MODAL ────────────────────────────────── */}
            <EspacioModal
                espacio={modalEspacio}
                onClose={() => setModalEspacio(null)}
            />

            <Footer />
        </div>
    );
}