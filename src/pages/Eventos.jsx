import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAirtableData } from '../services/useAirtableData';
import './Eventos.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80';

const normalizeEvent = (record) => {
    const fields = record.fields || {};
    const imageField = fields.Imagen || fields.Image;
    const image = Array.isArray(imageField)
        ? imageField[0]?.url
        : (typeof imageField === 'string' ? imageField : '');
    const startRaw = fields.FechaInicio || fields.Fecha || fields.Date || '';
    const endRaw   = fields.FechaFin || '';
    const startDate = startRaw ? new Date(startRaw) : null;
    const endDate   = endRaw   ? new Date(endRaw)   : null;
    const statusRaw = fields.Estado || fields.Status || 'Abierto';
    const status    = statusRaw === 'Activo' ? 'Abierto' : statusRaw;
    const title     = fields.Titulo || fields.Title || fields.Name || 'Evento CAPEX';
    const shortDescription = fields.Descripcion || fields.Description || fields.DescripcionCorta || 'Detalles del evento disponibles en CAPEX.';
    const longDescription  = fields.DescripcionLarga || fields.Descripcion_detallada || shortDescription;

    return {
        id: record.id,
        title,
        shortDescription,
        longDescription,
        location: fields.Ubicacion || fields.Location || 'Ubicación por confirmar',
        category: fields.Categoria || 'General',
        startDate,
        endDate,
        status,
        featured: Boolean(fields.Destacado || fields.Featured),
        registrationUrl: fields.LinkRegistro || fields.Link || '',
        cupoTotal: Number(fields.CupoTotal || 0),
        cupoDisponible: Number(fields.CupoDisponible || 0),
        image: image || FALLBACK_IMAGE,
    };
};

const formatDateChip = (date) => {
    if (!date || Number.isNaN(date.getTime())) return { day: '--', month: '---' };
    const day   = `${date.getDate()}`.padStart(2, '0');
    const month = date.toLocaleDateString('es-DO', { month: 'short' }).replace('.', '').toUpperCase();
    return { day, month };
};

const formatDateLong = (date) => {
    if (!date || Number.isNaN(date.getTime())) return 'Fecha por confirmar';
    return date.toLocaleDateString('es-DO', { day: '2-digit', month: 'long', year: 'numeric' });
};

const getSimilarityScore = (event, query) => {
    const q = query.trim().toLowerCase();
    if (!q) return 0;
    const haystack = [event.title, event.shortDescription, event.longDescription,
        event.location, event.category, event.status, formatDateLong(event.startDate)]
        .join(' ').toLowerCase();
    if (haystack.includes(q)) return 4;
    const terms   = q.split(/\s+/).filter(Boolean);
    const matches = terms.filter((t) => haystack.includes(t)).length;
    return matches > 0 ? Math.min(3, matches) : 0;
};

/* ── Barra de progreso de cupos ────────────────────────── */
const CupoBar = ({ cupoTotal, cupoDisponible, className = '' }) => {
    if (!cupoTotal) return null;
    const used    = cupoTotal - cupoDisponible;
    const pct     = Math.min(100, Math.round((used / cupoTotal) * 100));
    const fillCls = pct >= 100 ? 'full' : pct >= 75 ? 'warning' : '';
    return (
        <div className={`cupo-bar-wrap ${className}`}>
            <div className="cupo-bar-header">
                <span>Cupos disponibles</span>
                <span>{cupoDisponible}/{cupoTotal}</span>
            </div>
            <div className="cupo-bar-track">
                <div className={`cupo-bar-fill ${fillCls}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
};

/* ── Modal mejorado ────────────────────────────────────── */
const EventModal = ({ event, onClose }) => {
    useEffect(() => {
        if (!event) return;
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [event, onClose]);

    if (!event) return null;
    const { day, month } = formatDateChip(event.startDate);
    const cupoTotal      = event.cupoTotal;
    const cupoDisponible = event.cupoDisponible;
    const used           = cupoTotal ? cupoTotal - cupoDisponible : 0;
    const pct            = cupoTotal ? Math.min(100, Math.round((used / cupoTotal) * 100)) : 0;
    const fillCls        = pct >= 100 ? 'full' : pct >= 75 ? 'warning' : '';

    return (
        <div className="event-modal-overlay" onClick={onClose}>
            <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="event-modal-close" onClick={onClose} aria-label="Cerrar">
                    &times;
                </button>

                {/* Imagen con overlay e info superpuesta */}
                <div className="event-modal-img-wrap">
                    <img src={event.image} alt={event.title} className="event-modal-image" />
                    <div className="event-modal-img-overlay" />
                    <div className="event-modal-img-info">
                        {day !== '--' && (
                            <div className="event-modal-img-date">
                                <span className="day">{day}</span>
                                <span className="month">{month}</span>
                            </div>
                        )}
                        <div className="event-modal-img-title">
                            <h2>{event.title}</h2>
                            <span className={`status-pill status-${event.status.toLowerCase()}`}>
                                {event.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="event-modal-body">
                    {/* Chip de categoría */}
                    <div className="event-modal-chip">
                        <i className="fas fa-tag"></i>
                        {event.category}
                    </div>

                    {/* Descripción */}
                    <p className="event-modal-desc">{event.longDescription}</p>

                    {/* Grid de meta datos */}
                    <div className="event-modal-meta">
                        <div className="event-modal-meta-item">
                            <div className="meta-icon"><i className="fas fa-map-marker-alt"></i></div>
                            <div>
                                <div style={{ fontSize: '0.72rem', color: '#718096', fontWeight: 600, marginBottom: 2 }}>UBICACIÓN</div>
                                <div>{event.location}</div>
                            </div>
                        </div>
                        <div className="event-modal-meta-item">
                            <div className="meta-icon"><i className="fas fa-calendar-alt"></i></div>
                            <div>
                                <div style={{ fontSize: '0.72rem', color: '#718096', fontWeight: 600, marginBottom: 2 }}>FECHA</div>
                                <div>{formatDateLong(event.startDate)}</div>
                            </div>
                        </div>
                        {event.endDate && (
                            <div className="event-modal-meta-item">
                                <div className="meta-icon"><i className="fas fa-calendar-check"></i></div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', color: '#718096', fontWeight: 600, marginBottom: 2 }}>FECHA FIN</div>
                                    <div>{formatDateLong(event.endDate)}</div>
                                </div>
                            </div>
                        )}
                        <div className="event-modal-meta-item">
                            <div className="meta-icon"><i className="fas fa-layer-group"></i></div>
                            <div>
                                <div style={{ fontSize: '0.72rem', color: '#718096', fontWeight: 600, marginBottom: 2 }}>CATEGORÍA</div>
                                <div>{event.category}</div>
                            </div>
                        </div>
                    </div>

                    {/* Barra de cupos en modal */}
                    {cupoTotal > 0 && (
                        <div className="modal-cupo-section">
                            <div className="modal-cupo-header">
                                <span>Disponibilidad de cupos</span>
                                <span>{cupoDisponible} de {cupoTotal} disponibles</span>
                            </div>
                            <div className="modal-cupo-track">
                                <div className={`modal-cupo-fill ${fillCls}`} style={{ width: `${pct}%` }} />
                            </div>
                            <p className="modal-cupo-note">
                                {pct >= 100
                                    ? '⚠️ Cupos agotados. Puedes unirte a la lista de espera.'
                                    : pct >= 75
                                        ? `🔥 ¡Quedan pocos cupos! Solo ${cupoDisponible} disponibles.`
                                        : `✅ Aún hay cupos disponibles para este evento.`}
                            </p>
                        </div>
                    )}

                    {/* Acciones */}
                    <div className="event-modal-actions">
                        {event.registrationUrl && (
                            <a
                                className="btn-main"
                                href={event.registrationUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i className="fas fa-ticket-alt"></i>
                                Reservar mi cupo
                            </a>
                        )}
                        <button className="btn-secondary" onClick={onClose}>
                            <i className="fas fa-arrow-left"></i>
                            Volver a eventos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const isEventPast = (event, today) => {
    const st = event.status ? event.status.toLowerCase() : '';
    if (st === 'cerrado' || st === 'agotado' || st === 'cancelado') return true;
    if (event.startDate && event.startDate < today) return true;
    return false;
};

/* ── Página principal ─────────────────────────────────── */
export default function Eventos() {
    const { getEventos } = useAirtableData();
    const [events,        setEvents]        = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [activeTab,     setActiveTab]     = useState('todos');
    const [search,        setSearch]        = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const records = await getEventos();
                setEvents(records.map(normalizeEvent));
            } catch (error) {
                console.error('Error cargando eventos:', error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [getEventos]);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    /* Contadores por tab */
    const counts = useMemo(() => ({
        todos:    events.length,
        proximos: events.filter(e => !isEventPast(e, today)).length,
        pasados:  events.filter(e => isEventPast(e, today)).length,
    }), [events, today]);

    const featuredEvent = useMemo(() => {
        const f = events.find(e => e.featured);
        if (f) return f;
        return [...events]
            .filter(e => e.startDate && e.startDate >= today)
            .sort((a, b) => a.startDate - b.startDate)[0] || events[0] || null;
    }, [events, today]);

    const filteredEvents = useMemo(() => {
        const tabFiltered = events.filter(e => {
            if (activeTab === 'todos') return true;
            if (activeTab === 'proximos') return !isEventPast(e, today);
            if (activeTab === 'pasados')  return isEventPast(e, today);
            return true;
        });

        if (!search.trim()) {
            return tabFiltered.sort((a, b) => {
                const da = a.startDate ? a.startDate.getTime() : Number.MAX_SAFE_INTEGER;
                const db = b.startDate ? b.startDate.getTime() : Number.MAX_SAFE_INTEGER;
                return da - db;
            });
        }

        return tabFiltered
            .map(e => ({ e, score: getSimilarityScore(e, search) }))
            .filter(r => r.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                const da = a.e.startDate ? a.e.startDate.getTime() : Number.MAX_SAFE_INTEGER;
                const db = b.e.startDate ? b.e.startDate.getTime() : Number.MAX_SAFE_INTEGER;
                return da - db;
            })
            .map(r => r.e);
    }, [activeTab, events, search, today]);

    return (
        <div className="eventos-page">
            <Navbar />

            {/* HERO */}
            <header className="events-hero-capex">
                <div className="hero-shapes">
                    <div className="shape-1" />
                    <div className="shape-2" />
                    <div className="shape-3" />
                </div>
                <div className="hero-content">
                    <div className="hero-eyebrow">
                        <i className="fas fa-calendar-alt" />
                        Agenda CAPEX
                    </div>
                    <h1>Explora nuestros Eventos</h1>
                    <p>Formación de alto impacto para el crecimiento empresarial y profesional.</p>
                    {!loading && (
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="num">{counts.todos}</span>
                                <span className="lbl">Eventos totales</span>
                            </div>
                            <div className="hero-stat">
                                <span className="num">{counts.proximos}</span>
                                <span className="lbl">Próximos</span>
                            </div>
                            <div className="hero-stat">
                                <span className="num">{counts.pasados}</span>
                                <span className="lbl">Realizados</span>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* DESTACADO */}
            {featuredEvent && !loading && (
                <section className="featured-section-capex">
                    <div className="featured-card-capex">
                        <div
                            className="featured-img-capex"
                            style={{ backgroundImage: `url(${featuredEvent.image})` }}
                        >
                            {(() => {
                                const { day, month } = formatDateChip(featuredEvent.startDate);
                                return day !== '--' ? (
                                    <div className="featured-date-overlay">
                                        <span className="day">{day}</span>
                                        <span className="month">{month}</span>
                                    </div>
                                ) : null;
                            })()}
                        </div>
                        <div className="featured-info-capex">
                            <span className="featured-badge-capex">
                                <i className="fas fa-star" /> EVENTO DESTACADO
                            </span>
                            <h2>{featuredEvent.title}</h2>
                            <p className="desc">{featuredEvent.shortDescription}</p>
                            <div className="featured-meta">
                                <div className="featured-meta-item">
                                    <i className="fas fa-calendar-alt" />
                                    {formatDateLong(featuredEvent.startDate)}
                                </div>
                                <div className="featured-meta-item">
                                    <i className="fas fa-map-marker-alt" />
                                    {featuredEvent.location}
                                </div>
                                <div className="featured-meta-item">
                                    <i className="fas fa-layer-group" />
                                    {featuredEvent.category}
                                </div>
                            </div>
                            <div className="featured-actions">
                                <button
                                    className="btn-main"
                                    onClick={() => setSelectedEvent(featuredEvent)}
                                >
                                    <i className="fas fa-eye" /> Ver detalles
                                </button>
                                {featuredEvent.registrationUrl && (
                                    <a
                                        className="btn-secondary"
                                        href={featuredEvent.registrationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <i className="fas fa-ticket-alt" /> Reservar cupo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* FILTROS */}
            <div className="filter-bar-capex">
                <div className="tabs-capex">
                    {[
                        { key: 'todos',    label: 'Todos' },
                        { key: 'proximos', label: 'Próximos' },
                        { key: 'pasados',  label: 'Pasados' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            className={`tab-btn-capex ${activeTab === key ? 'active' : ''}`}
                            onClick={() => setActiveTab(key)}
                        >
                            {label}
                            <span className="tab-count">{counts[key]}</span>
                        </button>
                    ))}
                </div>
                <div className="search-capex">
                    <i className="fas fa-search" />
                    <input
                        type="text"
                        placeholder="Buscar por título, fecha, estado o categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* GRID */}
            <section className="events-grid-capex">
                {loading && (
                    <div className="events-loading">
                        <div className="loading-spinner" />
                        <span>Cargando eventos...</span>
                    </div>
                )}

                {!loading && filteredEvents.length === 0 && (
                    <div className="events-empty">
                        <i className="fas fa-calendar-times" />
                        <h4>No hay eventos disponibles</h4>
                        <p>Prueba con otro filtro o término de búsqueda.</p>
                    </div>
                )}

                {!loading && filteredEvents.map((event) => {
                    const { day, month } = formatDateChip(event.startDate);
                    return (
                        <article className="event-card-capex" key={event.id}>
                            <div className="event-img-capex">
                                <div className="event-date-capex">
                                    {day}
                                    <span>{month}</span>
                                </div>
                                {event.category && (
                                    <div className="event-category-badge">{event.category}</div>
                                )}
                                <img src={event.image} alt={event.title} loading="lazy" />
                            </div>

                            <div className="event-content-capex">
                                <h3>{event.title}</h3>
                                <p className="event-location">
                                    <i className="fas fa-map-marker-alt" />
                                    {event.location}
                                </p>
                                <p className="event-desc">{event.shortDescription}</p>

                                {event.cupoTotal > 0 && (
                                    <CupoBar
                                        cupoTotal={event.cupoTotal}
                                        cupoDisponible={event.cupoDisponible}
                                    />
                                )}

                                <div className="event-meta-line">
                                    <span>{formatDateLong(event.startDate)}</span>
                                    <span className={`status-pill status-${event.status.toLowerCase()}`}>
                                        {event.status}
                                    </span>
                                </div>

                                <div className="event-actions">
                                    <button
                                        className="btn-main"
                                        onClick={() => setSelectedEvent(event)}
                                    >
                                        <i className="fas fa-eye" /> Ver detalles
                                    </button>
                                    {event.registrationUrl && (
                                        <a
                                            className="btn-secondary"
                                            href={event.registrationUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Registro
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </section>

            <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            <Footer />
        </div>
    );
}