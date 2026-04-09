import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAirtableData } from '../services/useAirtableData';
import './Eventos.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80';

const normalizeEvent = (record) => {
    const fields = record.fields || {};
    const imageField = fields.Imagen || fields.Image;
    const image = Array.isArray(imageField) ? imageField[0]?.url : (typeof imageField === 'string' ? imageField : '');
    const startRaw = fields.FechaInicio || fields.Fecha || fields.Date || '';
    const endRaw = fields.FechaFin || '';
    const startDate = startRaw ? new Date(startRaw) : null;
    const endDate = endRaw ? new Date(endRaw) : null;
    const statusRaw = fields.Estado || fields.Status || 'Abierto';
    const status = statusRaw === 'Activo' ? 'Abierto' : statusRaw;
    const title = fields.Titulo || fields.Title || fields.Name || 'Evento CAPEX';
    const shortDescription = fields.Descripcion || fields.Description || fields.DescripcionCorta || 'Detalles del evento disponibles en CAPEX.';
    const longDescription = fields.DescripcionLarga || fields.Descripcion_detallada || shortDescription;

    return {
        id: record.id,
        title,
        shortDescription,
        longDescription,
        location: fields.Ubicacion || fields.Location || 'Ubicacion por confirmar',
        category: fields.Categoria || 'General',
        startDate,
        endDate,
        status,
        featured: Boolean(fields.Destacado || fields.Featured),
        registrationUrl: fields.LinkRegistro || fields.Link || '',
        cupoTotal: Number(fields.CupoTotal || 0),
        cupoDisponible: Number(fields.CupoDisponible || 0),
        image: image || FALLBACK_IMAGE
    };
};

const formatDateChip = (date) => {
    if (!date || Number.isNaN(date.getTime())) return { day: '--', month: '---' };
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = date.toLocaleDateString('es-DO', { month: 'short' }).replace('.', '').toUpperCase();
    return { day, month };
};

const formatDateLong = (date) => {
    if (!date || Number.isNaN(date.getTime())) return 'Fecha por confirmar';
    return date.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const getSimilarityScore = (event, query) => {
    const q = query.trim().toLowerCase();
    if (!q) return 0;

    const haystack = [
        event.title,
        event.shortDescription,
        event.longDescription,
        event.location,
        event.category,
        event.status,
        formatDateLong(event.startDate)
    ].join(' ').toLowerCase();

    if (haystack.includes(q)) return 4;
    const terms = q.split(/\s+/).filter(Boolean);
    const matches = terms.filter((term) => haystack.includes(term)).length;
    return matches > 0 ? Math.min(3, matches) : 0;
};

const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    const { day, month } = formatDateChip(event.startDate);
    return (
        <div className="event-modal-overlay" onClick={onClose}>
            <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="event-modal-close" onClick={onClose}>&times;</button>
                <img src={event.image} alt={event.title} className="event-modal-image" />
                <div className="event-modal-body">
                    <div className="event-modal-chip">{day} {month}</div>
                    <h2>{event.title}</h2>
                    <p>{event.longDescription}</p>
                    <div className="event-modal-meta">
                        <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                        <span><i className="fas fa-calendar-alt"></i> {formatDateLong(event.startDate)}</span>
                        <span><i className="fas fa-tag"></i> Estado: {event.status}</span>
                        {(event.cupoTotal > 0 || event.cupoDisponible > 0) && (
                            <span><i className="fas fa-ticket-alt"></i> Cupos: {event.cupoDisponible}/{event.cupoTotal || 'N/A'}</span>
                        )}
                    </div>
                    {event.registrationUrl && (
                        <a className="btn btn-primary" href={event.registrationUrl} target="_blank" rel="noreferrer">
                            Reservar mi cupo
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Eventos() {
    const { getEventos } = useAirtableData();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('todos');
    const [search, setSearch] = useState('');
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const featuredEvent = useMemo(() => {
        const featured = events.find((event) => event.featured);
        if (featured) return featured;
        return [...events]
            .filter((event) => event.startDate && event.startDate >= today)
            .sort((a, b) => a.startDate - b.startDate)[0] || events[0] || null;
    }, [events, today]);

    const filteredEvents = useMemo(() => {
        const tabFiltered = events.filter((event) => {
            if (!event.startDate) return activeTab === 'todos';
            if (activeTab === 'proximos') return event.startDate >= today;
            if (activeTab === 'pasados') return event.startDate < today;
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
            .map((event) => ({ event, score: getSimilarityScore(event, search) }))
            .filter((row) => row.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                const da = a.event.startDate ? a.event.startDate.getTime() : Number.MAX_SAFE_INTEGER;
                const db = b.event.startDate ? b.event.startDate.getTime() : Number.MAX_SAFE_INTEGER;
                return da - db;
            })
            .map((row) => row.event);
    }, [activeTab, events, search, today]);

    return (
        <div className="eventos-page">
            <Navbar />

            <header className="events-hero-capex">
                <div className="hero-shapes">
                    <div className="shape-1"></div>
                    <div className="shape-2"></div>
                </div>
                <div className="hero-content">
                    <h1>Explora nuestros Eventos</h1>
                    <p>Formación de alto impacto para el crecimiento empresarial.</p>
                </div>
            </header>

            {featuredEvent && (
                <section className="featured-section-capex">
                    <div className="featured-card-capex">
                        <div className="featured-img-capex" style={{ backgroundImage: `url(${featuredEvent.image})` }}></div>
                        <div className="featured-info-capex">
                            <span className="featured-badge-capex"><i className="fas fa-star"></i> EVENTO DESTACADO</span>
                            <h2>{featuredEvent.title}</h2>
                            <p className="text-dark-main">{featuredEvent.shortDescription}</p>
                            <div className="featured-meta">
                                <span><i className="fas fa-calendar-alt"></i> {formatDateLong(featuredEvent.startDate)}</span>
                                <span><i className="fas fa-map-marker-alt"></i> {featuredEvent.location}</span>
                                <span className={`status-pill status-${featuredEvent.status.toLowerCase()}`}>{featuredEvent.status}</span>
                            </div>
                            <div className="featured-actions">
                                <button className="btn btn-primary" onClick={() => setSelectedEvent(featuredEvent)}>Ver detalles</button>
                                {featuredEvent.registrationUrl && (
                                    <a className="btn btn-secondary" href={featuredEvent.registrationUrl} target="_blank" rel="noreferrer">Reservar cupo</a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <div className="filter-bar-capex">
                <div className="tabs-capex">
                    <button className={`tab-btn-capex ${activeTab === 'todos' ? 'active' : ''}`} onClick={() => setActiveTab('todos')}>Todos</button>
                    <button className={`tab-btn-capex ${activeTab === 'proximos' ? 'active' : ''}`} onClick={() => setActiveTab('proximos')}>Próximos</button>
                    <button className={`tab-btn-capex ${activeTab === 'pasados' ? 'active' : ''}`} onClick={() => setActiveTab('pasados')}>Pasados</button>
                </div>
                <div className="search-capex">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Buscar por título, fecha, estado o categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <section className="events-grid-capex">
                {loading && <p className="events-empty">Cargando eventos desde la base de datos...</p>}
                {!loading && filteredEvents.length === 0 && (
                    <p className="events-empty">No hay eventos para este filtro o búsqueda.</p>
                )}
                {!loading && filteredEvents.map((event) => {
                    const { day, month } = formatDateChip(event.startDate);
                    return (
                        <article className="event-card-capex" key={event.id}>
                            <div className="event-img-capex">
                                <div className="event-date-capex">{day} <span>{month}</span></div>
                                <img src={event.image} alt={event.title} />
                            </div>
                            <div className="event-content-capex">
                                <h3>{event.title}</h3>
                                <p className="event-location text-dark-main"><i className="fas fa-map-marker-alt"></i> {event.location}</p>
                                <p className="event-desc text-dark-main">{event.shortDescription}</p>
                                <div className="event-meta-line">
                                    <span>{formatDateLong(event.startDate)}</span>
                                    <span className={`status-pill status-${event.status.toLowerCase()}`}>{event.status}</span>
                                </div>
                                <div className="event-actions">
                                    <button className="btn btn-primary" onClick={() => setSelectedEvent(event)}>Ver detalles</button>
                                    {event.registrationUrl && (
                                        <a className="btn btn-secondary" href={event.registrationUrl} target="_blank" rel="noreferrer">Registro</a>
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
