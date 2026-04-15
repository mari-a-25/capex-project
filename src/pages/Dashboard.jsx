import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

/* ── Helpers ── */
const getInitials = (nombre = '', apellido = '') =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || 'U';

const getPctClass = (pct) => {
    if (pct >= 80) return '';
    if (pct >= 60) return 'warning';
    return 'danger';
};

/* ── Mini Calendario ── */
const MiniCalendar = ({ sessionDays = [] }) => {
    const [offset, setOffset] = useState(0);
    const today = new Date();
    const ref = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = ref.getFullYear();
    const month = ref.getMonth();

    const monthName = ref.toLocaleDateString('es-DO', { month: 'long', year: 'numeric' });
    const firstDay  = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayNames = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isToday  = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const hasSess  = (d) => sessionDays.includes(d) && month === today.getMonth() && year === today.getFullYear();

    return (
        <div>
            <div className="db-calendar-header">
                <span className="db-cal-month" style={{ textTransform: 'capitalize' }}>{monthName}</span>
                <div className="db-cal-nav">
                    <button className="db-cal-nav-btn" onClick={() => setOffset(o => o - 1)}>
                        <i className="fas fa-chevron-left" />
                    </button>
                    <button className="db-cal-nav-btn" onClick={() => setOffset(o => o + 1)}>
                        <i className="fas fa-chevron-right" />
                    </button>
                </div>
            </div>
            <div className="db-cal-grid">
                {dayNames.map(d => (
                    <div key={d} className="db-cal-day-name">{d}</div>
                ))}
                {cells.map((d, i) => (
                    <div
                        key={i}
                        className={`db-cal-day ${!d ? 'other-month' : ''} ${d && isToday(d) ? 'today' : ''} ${d && hasSess(d) ? 'has-session' : ''}`}
                    >
                        {d || ''}
                        {d && hasSess(d) && <span className="db-cal-dot" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ── Datos de demo ── */
const DEMO_PROGRAMS = [
    {
        id: 1,
        categoria: 'Diplomado',
        titulo: 'Gestión Estratégica y Liderazgo Organizacional',
        facilitador: 'Dra. Ana Castillo',
        modalidad: 'Presencial',
        moduloActual: 'Módulo 3 — Liderazgo Situacional',
        moduloNum: 3,
        totalModulos: 6,
        asistenciaPct: 88,
        formStatus: 'completed',
        hasAlert: false,
        status: 'active',
        sesiones: '3 de 5 sesiones',
        proximaSesion: 'Lun 14 Abr · 6:00 PM',
    },
    {
        id: 2,
        categoria: 'Taller',
        titulo: 'Comunicación Efectiva en Equipos de Alto Rendimiento',
        facilitador: 'Lic. Roberto Méndez',
        modalidad: 'Virtual',
        moduloActual: 'Módulo 2 — Feedback Constructivo',
        moduloNum: 2,
        totalModulos: 4,
        asistenciaPct: 75,
        formStatus: 'pending',
        hasAlert: true,
        status: 'warning',
        sesiones: '2 de 3 sesiones',
        proximaSesion: 'Mié 16 Abr · 7:00 PM',
    },
];

const DEMO_NOTIFS = [
    {
        id: 1,
        type: 'info',
        icon: 'fas fa-calendar-alt',
        title: 'Próxima sesión mañana',
        desc: 'Liderazgo Situacional · Aula 103 · 6:00 PM',
        time: 'Hoy',
        action: null,
    },
    {
        id: 2,
        type: 'warning',
        icon: 'fas fa-clipboard-list',
        title: 'Formulario pendiente',
        desc: 'Módulo 2 de Comunicación Efectiva requiere tu evaluación.',
        time: 'Hace 2d',
        action: { label: 'Completar ahora', style: 'primary' },
    },
    {
        id: 3,
        type: 'success',
        icon: 'fas fa-award',
        title: 'Certificado disponible',
        desc: 'Tu certificado de "Introducción al Liderazgo" está listo.',
        time: 'Hace 5d',
        action: { label: 'Descargar', style: 'success' },
    },
];

const SESSION_DAYS = [14, 16, 22, 28];

const UPCOMING = [
    { day: '14', month: 'ABR', title: 'Liderazgo Situacional', time: '6:00 PM · Aula 103' },
    { day: '16', month: 'ABR', title: 'Feedback Constructivo', time: '7:00 PM · Zoom' },
    { day: '22', month: 'ABR', title: 'Gestión del Cambio', time: '6:00 PM · Aula 103' },
];

/* ── Componente principal ── */
export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const initials = getInitials(user?.Nombre, user?.Apellido);
    const matricula = user?.Matricula || user?.ID_participante || 'CPX-2026-001';

    const totalActivos      = DEMO_PROGRAMS.length;
    const certDisponibles   = 1;
    const formsPendientes   = DEMO_PROGRAMS.filter(p => p.formStatus === 'pending').length;

    const handleNav = (key) => {
        if (key !== 'dashboard') navigate(`/${key}`);
    };

    return (
        <>
            {/* ── WELCOME BANNER ── */}
            <div className="db-welcome">
                <div className="db-welcome-shape-1" />
                <div className="db-welcome-shape-2" />

                <div className="db-welcome-left">
                    <div className="db-welcome-avatar">{initials}</div>
                    <div className="db-welcome-text">
                        <span className="greeting">Bienvenido de vuelta</span>
                        <h2>Hola, {user?.Nombre || 'Participante'} 👋</h2>
                        <span className="matricula">
                            <i className="fas fa-id-card" />
                            Matrícula: {matricula}
                        </span>
                    </div>
                </div>

                <div className="db-welcome-right">
                    <button className="db-quick-action" onClick={() => handleNav('mis-cursos')}>
                        <i className="fas fa-graduation-cap" />
                        <span>Mis<br />Cursos</span>
                    </button>
                    <button className="db-quick-action" onClick={() => handleNav('certificados')}>
                        <i className="fas fa-award" />
                        <span>Certificados</span>
                    </button>
                    <button className="db-quick-action" onClick={() => handleNav('perfil')}>
                        <i className="fas fa-user-circle" />
                        <span>Mi<br />Perfil</span>
                    </button>
                </div>
            </div>

            {/* ── STATS ROW ── */}
            <div className="db-stats-row">
                <div className="db-stat-mini">
                    <div className="db-stat-mini-icon blue">
                        <i className="fas fa-book-open" />
                    </div>
                    <div>
                        <span className="db-stat-mini-val">{totalActivos}</span>
                        <span className="db-stat-mini-label">Cursos Activos</span>
                    </div>
                </div>
                <div className="db-stat-mini">
                    <div className="db-stat-mini-icon green">
                        <i className="fas fa-award" />
                    </div>
                    <div>
                        <span className="db-stat-mini-val">{certDisponibles}</span>
                        <span className="db-stat-mini-label">Certificado disponible</span>
                    </div>
                </div>
                <div className="db-stat-mini">
                    <div className="db-stat-mini-icon orange">
                        <i className="fas fa-clipboard-list" />
                    </div>
                    <div>
                        <span className="db-stat-mini-val">{formsPendientes}</span>
                        <span className="db-stat-mini-label">Formulario pendiente</span>
                    </div>
                </div>
            </div>

            {/* ── GRID PRINCIPAL ── */}
            <div className="db-grid">

                {/* Columna izquierda — Programas */}
                <div>
                    <div className="db-section-title">
                        <i className="fas fa-layer-group" style={{ color: 'var(--capex-blue)', fontSize: '0.75rem' }} />
                        Mis Programas Activos
                    </div>

                    {DEMO_PROGRAMS.length === 0 ? (
                        <div className="db-empty-state">
                            <i className="fas fa-book-open" />
                            <h4>Sin programas registrados</h4>
                            <p>No tienes inscripciones activas en este momento.<br />Contacta a soporte académico si crees que esto es un error.</p>
                        </div>
                    ) : (
                        <div className="db-programs-list">
                            {DEMO_PROGRAMS.map(prog => {
                                const pctClass = getPctClass(prog.asistenciaPct);
                                return (
                                    <div
                                        key={prog.id}
                                        className={`db-program-card ${prog.hasAlert ? 'has-alert' : ''}`}
                                    >
                                        {/* Alerta formulario pendiente */}
                                        {prog.hasAlert && (
                                            <div className="db-program-alert">
                                                <i className="fas fa-exclamation-triangle" />
                                                <span>Tienes un formulario pendiente que bloquea tu acceso al siguiente módulo.</span>
                                                <button
                                                    className="db-program-alert-btn"
                                                    onClick={() => handleNav('encuestas')}
                                                >
                                                    Completar →
                                                </button>
                                            </div>
                                        )}

                                        <div className="db-program-header">
                                            <div className="db-program-header-left">
                                                <div className="db-program-category">
                                                    <i className="fas fa-tag" />
                                                    {prog.categoria} · {prog.modalidad}
                                                </div>
                                                <div className="db-program-title">{prog.titulo}</div>
                                                <div className="db-program-meta">
                                                    <span>
                                                        <i className="fas fa-chalkboard-teacher" />
                                                        {prog.facilitador}
                                                    </span>
                                                    <span>
                                                        <i className="fas fa-cubes" />
                                                        {prog.totalModulos} módulos
                                                    </span>
                                                    <span>
                                                        <i className="fas fa-calendar-alt" />
                                                        {prog.proximaSesion}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`db-status-pill ${prog.status === 'active' ? 'db-status-active' : 'db-status-warning'}`}>
                                                {prog.status === 'active' ? 'Activo' : 'Atención'}
                                            </div>
                                        </div>

                                        {/* Módulo actual */}
                                        <div className="db-current-module">
                                            <div className="db-current-module-label">Módulo actual</div>
                                            <div className="db-current-module-name">
                                                <span className="db-module-num">M{prog.moduloNum}</span>
                                                {prog.moduloActual.replace(/^Módulo \d+ — /, '')}
                                            </div>
                                        </div>

                                        {/* Asistencia */}
                                        <div className="db-attendance">
                                            <div className="db-attendance-header">
                                                <span className="db-attendance-label">
                                                    <i className="fas fa-user-check" />
                                                    Asistencia acumulada · {prog.sesiones}
                                                </span>
                                                <span className={`db-attendance-pct ${pctClass}`}>
                                                    {prog.asistenciaPct}%
                                                </span>
                                            </div>
                                            <div className="db-progress-track">
                                                <div
                                                    className={`db-progress-fill ${pctClass}`}
                                                    style={{ width: `${prog.asistenciaPct}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="db-program-footer">
                                            <div className={`db-form-status ${prog.formStatus === 'completed' ? 'done' : 'pending'}`}>
                                                <i className={prog.formStatus === 'completed' ? 'fas fa-check-circle' : 'fas fa-clock'} />
                                                {prog.formStatus === 'completed'
                                                    ? 'Formulario del módulo completado'
                                                    : 'Formulario del módulo pendiente'}
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {prog.formStatus === 'pending' && (
                                                    <button
                                                        className="db-program-action primary"
                                                        onClick={() => handleNav('encuestas')}
                                                    >
                                                        <i className="fas fa-clipboard-check" />
                                                        Evaluar módulo
                                                    </button>
                                                )}
                                                <button
                                                    className="db-program-action secondary"
                                                    onClick={() => handleNav('mis-cursos')}
                                                >
                                                    <i className="fas fa-eye" />
                                                    Ver detalle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Columna derecha */}
                <div className="db-right-col">

                    {/* Notificaciones */}
                    <div className="db-panel-card">
                        <div className="db-panel-card-title">
                            Centro de Notificaciones
                            <span className="count">{DEMO_NOTIFS.length}</span>
                        </div>
                        <div className="db-notif-list">
                            {DEMO_NOTIFS.map((notif, idx) => (
                                <React.Fragment key={notif.id}>
                                    <div className="db-notif-item">
                                        <div className={`db-notif-icon ${notif.type}`}>
                                            <i className={notif.icon} />
                                        </div>
                                        <div className="db-notif-body">
                                            <strong>{notif.title}</strong>
                                            <span>{notif.desc}</span>
                                            {notif.action && (
                                                <button
                                                    className={`db-notif-action ${notif.action.style}`}
                                                    onClick={() => {
                                                        if (notif.action.style === 'primary') handleNav('encuestas');
                                                        if (notif.action.style === 'success') handleNav('certificados');
                                                    }}
                                                >
                                                    {notif.action.label}
                                                    <i className="fas fa-arrow-right" />
                                                </button>
                                            )}
                                        </div>
                                        <span className="db-notif-time">{notif.time}</span>
                                    </div>
                                    {idx < DEMO_NOTIFS.length - 1 && (
                                        <div className="db-notif-divider" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Mini Calendario */}
                    <div className="db-panel-card">
                        <div className="db-panel-card-title">
                            Calendario de Sesiones
                        </div>
                        <MiniCalendar sessionDays={SESSION_DAYS} />
                        <div className="db-upcoming-sessions">
                            {UPCOMING.map((s, i) => (
                                <div key={i} className="db-upcoming-item">
                                    <div className="db-upcoming-date">
                                        <span className="day">{s.day}</span>
                                        <span className="month">{s.month}</span>
                                    </div>
                                    <div className="db-upcoming-info">
                                        <strong>{s.title}</strong>
                                        <span>
                                            <i className="fas fa-clock" style={{ color: 'var(--capex-blue)', fontSize: '0.65rem' }} />
                                            {s.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}