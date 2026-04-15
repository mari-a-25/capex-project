import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MisCursos.css';

/* ── Helpers ── */
const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const getPctFill = (pct) => {
    if (pct >= 80) return 'blue';
    if (pct >= 60) return 'warning';
    return 'danger';
};

/* ── Gauge circular ── */
const AttendanceGauge = ({ pct }) => {
    const r = 28;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (pct / 100) * circumference;
    const colorClass = getPctFill(pct);

    return (
        <div className="mc-gauge">
            <svg width="72" height="72" viewBox="0 0 72 72">
                <circle className="mc-gauge-track" cx="36" cy="36" r={r} />
                <circle
                    className={`mc-gauge-fill ${colorClass}`}
                    cx="36" cy="36" r={r}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="mc-gauge-label">{pct}%</div>
        </div>
    );
};

/* ── Datos de demo ── */
const DEMO_COURSES = [
    {
        id: 1,
        categoria: 'Diplomado',
        titulo: 'Gestión Estratégica y Liderazgo Organizacional',
        facilitador: 'Dra. Ana Castillo',
        facilitadorRole: 'Facilitadora Senior · EduCapex',
        modalidad: 'Presencial',
        fechaInicio: '10 Ene 2026',
        fechaFin: '30 Jun 2026',
        asistenciaPct: 88,
        progresoPct: 50,
        status: 'active',
        totalModulos: 6,
        modulosCompletados: 2,
        totalSesiones: 18,
        sesionesCompletadas: 9,
        modulos: [
            {
                id: 1,
                nombre: 'Fundamentos del Liderazgo Moderno',
                sesiones: 3,
                estado: 'completed',
                asistenciaPct: 100,
                formStatus: 'completed',
                facilitador: 'Dra. Ana Castillo',
                items: [
                    { fecha: '12 Ene', nombre: 'Introducción al Liderazgo', duracion: '3h', asistencia: 'presente' },
                    { fecha: '19 Ene', nombre: 'Estilos de Liderazgo', duracion: '3h', asistencia: 'presente' },
                    { fecha: '26 Ene', nombre: 'Liderazgo Situacional I', duracion: '3h', asistencia: 'presente' },
                ],
            },
            {
                id: 2,
                nombre: 'Comunicación y Cultura Organizacional',
                sesiones: 3,
                estado: 'completed',
                asistenciaPct: 67,
                formStatus: 'completed',
                facilitador: 'Lic. Roberto Méndez',
                items: [
                    { fecha: '02 Feb', nombre: 'Comunicación Efectiva', duracion: '3h', asistencia: 'presente' },
                    { fecha: '09 Feb', nombre: 'Gestión del Cambio', duracion: '3h', asistencia: 'ausente' },
                    { fecha: '16 Feb', nombre: 'Cultura Organizacional', duracion: '3h', asistencia: 'presente' },
                ],
            },
            {
                id: 3,
                nombre: 'Liderazgo Situacional Avanzado',
                sesiones: 3,
                estado: 'active',
                asistenciaPct: 67,
                formStatus: 'na',
                facilitador: 'Dra. Ana Castillo',
                items: [
                    { fecha: '02 Mar', nombre: 'Delegación Efectiva', duracion: '3h', asistencia: 'presente' },
                    { fecha: '09 Mar', nombre: 'Toma de Decisiones', duracion: '3h', asistencia: 'presente' },
                    { fecha: '16 Mar', nombre: 'Coaching de Equipos', duracion: '3h', asistencia: 'pendiente' },
                ],
            },
            {
                id: 4,
                nombre: 'Gestión del Desempeño y Feedback',
                sesiones: 3,
                estado: 'locked',
                asistenciaPct: 0,
                formStatus: 'na',
                facilitador: 'Dra. Ana Castillo',
                items: [],
            },
            {
                id: 5,
                nombre: 'Innovación y Pensamiento Estratégico',
                sesiones: 3,
                estado: 'locked',
                asistenciaPct: 0,
                formStatus: 'na',
                facilitador: 'Lic. Carlos Vega',
                items: [],
            },
            {
                id: 6,
                nombre: 'Proyecto Final Integrador',
                sesiones: 3,
                estado: 'locked',
                asistenciaPct: 0,
                formStatus: 'na',
                facilitador: 'Dra. Ana Castillo',
                items: [],
            },
        ],
    },
    {
        id: 2,
        categoria: 'Taller',
        titulo: 'Comunicación Efectiva en Equipos de Alto Rendimiento',
        facilitador: 'Lic. Roberto Méndez',
        facilitadorRole: 'Facilitador · RRHH',
        modalidad: 'Virtual',
        fechaInicio: '03 Mar 2026',
        fechaFin: '30 May 2026',
        asistenciaPct: 75,
        progresoPct: 40,
        status: 'warning',
        totalModulos: 4,
        modulosCompletados: 1,
        totalSesiones: 12,
        sesionesCompletadas: 5,
        modulos: [
            {
                id: 1,
                nombre: 'Fundamentos de la Comunicación',
                sesiones: 3,
                estado: 'completed',
                asistenciaPct: 100,
                formStatus: 'completed',
                facilitador: 'Lic. Roberto Méndez',
                items: [
                    { fecha: '03 Mar', nombre: 'Comunicación verbal y no verbal', duracion: '2h', asistencia: 'presente' },
                    { fecha: '10 Mar', nombre: 'Escucha activa', duracion: '2h', asistencia: 'presente' },
                    { fecha: '17 Mar', nombre: 'Barreras comunicacionales', duracion: '2h', asistencia: 'presente' },
                ],
            },
            {
                id: 2,
                nombre: 'Feedback Constructivo',
                sesiones: 3,
                estado: 'active',
                asistenciaPct: 50,
                formStatus: 'pending',
                facilitador: 'Lic. Roberto Méndez',
                items: [
                    { fecha: '24 Mar', nombre: 'Modelo SBI de Feedback', duracion: '2h', asistencia: 'presente' },
                    { fecha: '31 Mar', nombre: 'Conversaciones difíciles', duracion: '2h', asistencia: 'ausente' },
                    { fecha: '07 Abr', nombre: 'Práctica de feedback', duracion: '2h', asistencia: 'pendiente' },
                ],
            },
            {
                id: 3,
                nombre: 'Comunicación en Equipos Virtuales',
                sesiones: 3,
                estado: 'locked',
                asistenciaPct: 0,
                formStatus: 'na',
                facilitador: 'Lic. Roberto Méndez',
                items: [],
            },
            {
                id: 4,
                nombre: 'Liderazgo Comunicacional',
                sesiones: 3,
                estado: 'locked',
                asistenciaPct: 0,
                formStatus: 'na',
                facilitador: 'Lic. Roberto Méndez',
                items: [],
            },
        ],
    },
];

/* ── Módulo expandible ── */
const ModuleItem = ({ modulo, index, onFormClick }) => {
    const [open, setOpen] = useState(modulo.estado === 'active');

    const stateIcon = {
        completed: 'fas fa-check',
        active:    'fas fa-play',
        locked:    'fas fa-lock',
    };

    const stateBadge = {
        completed: { label: 'Completado', cls: 'completed' },
        active:    { label: 'En curso',   cls: 'active' },
        locked:    { label: 'Bloqueado',  cls: 'locked' },
    };

    const formLabel = {
        completed: { label: 'Formulario completado', icon: 'fas fa-check-circle', cls: 'done' },
        pending:   { label: 'Formulario pendiente',  icon: 'fas fa-clock',        cls: 'pending' },
        na:        { label: 'Formulario no disponible aún', icon: 'fas fa-minus-circle', cls: 'na' },
    };

    const pctFill = modulo.estado === 'completed'
        ? (modulo.asistenciaPct >= 80 ? 'success' : 'warning')
        : '';

    const handleToggle = () => {
        if (modulo.estado !== 'locked') setOpen(o => !o);
    };

    return (
        <div className={`mc-module-item ${modulo.estado}`}>
            <div className="mc-module-header" onClick={handleToggle}>
                {/* Ícono de estado */}
                <div className={`mc-module-state-icon ${modulo.estado}`}>
                    <i className={stateIcon[modulo.estado]} />
                </div>

                {/* Info principal */}
                <div className="mc-module-main">
                    <div className="mc-module-num-label">Módulo {index + 1}</div>
                    <div className="mc-module-name">{modulo.nombre}</div>
                    <div className="mc-module-meta-row">
                        <span className="mc-module-meta-chip">
                            <i className="fas fa-calendar-alt" />
                            {modulo.sesiones} sesiones
                        </span>
                        <span className="mc-module-meta-chip">
                            <i className="fas fa-chalkboard-teacher" />
                            {modulo.facilitador.split(' ').slice(0, 2).join(' ')}
                        </span>
                    </div>
                </div>

                {/* Badges y progreso */}
                <div className="mc-module-badges">
                    {modulo.estado !== 'locked' && modulo.asistenciaPct > 0 && (
                        <div className="mc-module-mini-prog">
                            <div className="mc-module-mini-track">
                                <div
                                    className={`mc-module-mini-fill ${pctFill}`}
                                    style={{ width: `${modulo.asistenciaPct}%` }}
                                />
                            </div>
                            <span className="mc-module-mini-pct">{modulo.asistenciaPct}%</span>
                        </div>
                    )}
                    <span className={`mc-badge ${stateBadge[modulo.estado].cls}`}>
                        {stateBadge[modulo.estado].label}
                    </span>
                    {modulo.formStatus === 'pending' && (
                        <span className="mc-badge pending">
                            <i className="fas fa-exclamation" />
                            Formulario
                        </span>
                    )}
                </div>

                {modulo.estado !== 'locked' && (
                    <i className={`fas fa-chevron-down mc-module-chevron ${open ? 'open' : ''}`} />
                )}
            </div>

            {/* Contenido expandido */}
            <div className={`mc-module-body ${open && modulo.estado !== 'locked' ? 'open' : ''}`}>
                {modulo.estado === 'locked' ? (
                    <div className="mc-locked-msg">
                        <i className="fas fa-lock" />
                        Este módulo se desbloqueará al completar el formulario del módulo anterior.
                    </div>
                ) : (
                    <>
                        {/* Facilitador del módulo */}
                        <div className="mc-module-facilitator">
                            <div className="mc-facilitator-avatar">
                                {getInitials(modulo.facilitador)}
                            </div>
                            <div className="mc-facilitator-info">
                                <span className="label">Facilitador del módulo</span>
                                <span className="name">{modulo.facilitador}</span>
                            </div>
                        </div>

                        {/* Sesiones */}
                        {modulo.items.length > 0 && (
                            <>
                                <div className="mc-sessions-title">Sesiones del módulo</div>
                                <div className="mc-sessions-list">
                                    {modulo.items.map((s, i) => (
                                        <div className="mc-session-row" key={i}>
                                            <div className={`mc-attend-indicator ${s.asistencia}`} />
                                            <span className="mc-session-date">{s.fecha}</span>
                                            <span className="mc-session-name">{s.nombre}</span>
                                            <span className="mc-session-duration">
                                                <i className="fas fa-clock" />
                                                {s.duracion}
                                            </span>
                                            <span className={`mc-session-status ${s.asistencia}`}>
                                                {s.asistencia === 'presente'  ? 'Presente'  : ''}
                                                {s.asistencia === 'ausente'   ? 'Ausente'   : ''}
                                                {s.asistencia === 'pendiente' ? 'Pendiente' : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Footer del módulo */}
                        <div className="mc-module-footer">
                            <div className={`mc-form-status-row ${formLabel[modulo.formStatus].cls}`}>
                                <i className={formLabel[modulo.formStatus].icon} />
                                {formLabel[modulo.formStatus].label}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {modulo.formStatus === 'pending' && (
                                    <button
                                        className="mc-module-action primary"
                                        onClick={() => onFormClick(modulo)}
                                    >
                                        <i className="fas fa-clipboard-check" />
                                        Completar formulario
                                    </button>
                                )}
                                {modulo.formStatus === 'completed' && (
                                    <button className="mc-module-action secondary">
                                        <i className="fas fa-eye" />
                                        Ver respuestas
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

/* ── Vista lista de cursos ── */
const CourseList = ({ courses, onSelectCourse }) => {
    const [filter, setFilter] = useState('todos');

    const filtered = courses.filter(c => {
        if (filter === 'activos')     return c.status === 'active' || c.status === 'warning';
        if (filter === 'completados') return c.status === 'completed';
        return true;
    });

    const counts = {
        todos:      courses.length,
        activos:    courses.filter(c => c.status === 'active' || c.status === 'warning').length,
        completados: courses.filter(c => c.status === 'completed').length,
    };

    return (
        <>
            <div className="mc-page-header">
                <h1 className="mc-page-title">Mis Cursos</h1>
                <p className="mc-page-subtitle">
                    Gestiona y consulta todos tus programas académicos.
                </p>
            </div>

            <div className="mc-filters">
                {[
                    { key: 'todos',       label: 'Todos' },
                    { key: 'activos',     label: 'Activos' },
                    { key: 'completados', label: 'Completados' },
                ].map(f => (
                    <button
                        key={f.key}
                        className={`mc-filter-btn ${filter === f.key ? 'active' : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                        <span className="mc-filter-count">{counts[f.key]}</span>
                    </button>
                ))}
            </div>

            <div className="mc-courses-grid">
                {filtered.length === 0 ? (
                    <div className="mc-empty">
                        <i className="fas fa-folder-open" />
                        <h4>Sin cursos en esta categoría</h4>
                        <p>No tienes programas registrados aquí por el momento.</p>
                    </div>
                ) : (
                    filtered.map(course => {
                        const pctFill = getPctFill(course.asistenciaPct);
                        const topClass = course.status === 'warning' ? 'warning'
                                       : course.status === 'completed' ? 'success' : '';

                        return (
                            <div
                                key={course.id}
                                className="mc-course-card"
                                onClick={() => onSelectCourse(course)}
                            >
                                <div className={`mc-course-card-top ${topClass}`} />
                                <div className="mc-course-card-body">
                                    <div className="mc-course-card-header">
                                        <div className={`mc-course-card-icon ${topClass}`}>
                                            <i className={
                                                course.categoria === 'Diplomado' ? 'fas fa-graduation-cap'
                                                : course.categoria === 'Taller'  ? 'fas fa-tools'
                                                : 'fas fa-book'
                                            } />
                                        </div>
                                        <div className="mc-course-info">
                                            <div className="mc-course-category">
                                                {course.categoria} · {course.modalidad}
                                            </div>
                                            <div className="mc-course-title">{course.titulo}</div>
                                        </div>
                                    </div>

                                    <div className="mc-mini-progress">
                                        <div className="mc-mini-progress-header">
                                            <span>{course.modulosCompletados} de {course.totalModulos} módulos</span>
                                            <span className="pct">{course.progresoPct}%</span>
                                        </div>
                                        <div className="mc-mini-progress-track">
                                            <div
                                                className={`mc-mini-progress-fill ${topClass}`}
                                                style={{ width: `${course.progresoPct}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mc-course-card-footer">
                                    <div className="mc-course-meta-chips">
                                        <span className="mc-chip">
                                            <i className="fas fa-chalkboard-teacher" />
                                            {course.facilitador.split(' ').slice(0, 3).join(' ')}
                                        </span>
                                        <span className="mc-chip">
                                            <i className="fas fa-user-check" />
                                            {course.asistenciaPct}% asistencia
                                        </span>
                                    </div>
                                    <div className="mc-course-card-arrow">
                                        <i className="fas fa-arrow-right" />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
};

/* ── Vista detalle de un curso ── */
const CourseDetail = ({ course, onBack, onFormClick }) => {
    const totalAtt = course.modulos.reduce((sum, m) => {
        const present = m.items.filter(s => s.asistencia === 'presente').length;
        return sum + present;
    }, 0);
    const totalSess = course.modulos.reduce((sum, m) => sum + m.items.length, 0);
    const overallAtt = totalSess > 0 ? Math.round((totalAtt / totalSess) * 100) : 0;

    const formsPending = course.modulos.filter(m => m.formStatus === 'pending').length;

    const certReqs = [
        { label: `Asistencia ≥ 80% en todos los módulos`, done: overallAtt >= 80 },
        { label: `Formularios de cierre completados`, done: formsPending === 0 },
        { label: `Módulos finalizados (${course.modulosCompletados}/${course.totalModulos})`, done: course.modulosCompletados === course.totalModulos },
    ];

    return (
        <>
            {/* Botón volver */}
            <button className="mc-detail-back" onClick={onBack}>
                <i className="fas fa-arrow-left" />
                Volver a Mis Cursos
            </button>

            {/* Header del diplomado */}
            <div className="mc-detail-header">
                <div className="mc-detail-header-shape" />
                <div className="mc-detail-header-inner">
                    <div className="mc-detail-header-left">
                        <div className="mc-detail-eyebrow">
                            <i className={course.categoria === 'Diplomado' ? 'fas fa-graduation-cap' : 'fas fa-tools'} />
                            {course.categoria} · {course.modalidad}
                        </div>
                        <h2 className="mc-detail-title">{course.titulo}</h2>
                        <div className="mc-detail-meta-row">
                            <span className="mc-detail-meta-item">
                                <i className="fas fa-chalkboard-teacher" />
                                {course.facilitador}
                            </span>
                            <span className="mc-detail-meta-item">
                                <i className="fas fa-calendar-alt" />
                                {course.fechaInicio} → {course.fechaFin}
                            </span>
                            <span className="mc-detail-meta-item">
                                <i className="fas fa-map-marker-alt" />
                                {course.modalidad}
                            </span>
                        </div>

                        <div className="mc-detail-progress-wrap">
                            <div className="mc-detail-progress-header">
                                <span className="mc-detail-progress-label">Progreso general del programa</span>
                                <span className="mc-detail-progress-pct">{course.progresoPct}% completado</span>
                            </div>
                            <div className="mc-detail-progress-track">
                                <div
                                    className="mc-detail-progress-fill"
                                    style={{ width: `${course.progresoPct}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mc-detail-stats">
                        <div className="mc-detail-stat">
                            <span className="val">{course.modulosCompletados}/{course.totalModulos}</span>
                            <span className="lbl">Módulos</span>
                        </div>
                        <div className="mc-detail-stat">
                            <span className="val">{course.sesionesCompletadas}/{course.totalSesiones}</span>
                            <span className="lbl">Sesiones</span>
                        </div>
                        <div className="mc-detail-stat">
                            <span className="val">{overallAtt}%</span>
                            <span className="lbl">Asistencia</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout detalle */}
            <div className="mc-detail-layout">
                {/* Módulos */}
                <div>
                    <div className="mc-modules-section-title">
                        <i className="fas fa-cubes" style={{ color: 'var(--capex-blue)', fontSize: '0.75rem' }} />
                        Módulos del Programa
                    </div>
                    <div className="mc-modules-list">
                        {course.modulos.map((mod, idx) => (
                            <ModuleItem
                                key={mod.id}
                                modulo={mod}
                                index={idx}
                                onFormClick={onFormClick}
                            />
                        ))}
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="mc-side-panel">
                    {/* Facilitador principal */}
                    <div className="mc-facilitator-card">
                        <div className="mc-facilitator-card-title">Facilitador Principal</div>
                        <div className="mc-facilitator-main">
                            <div className="mc-facilitator-avatar-lg">
                                {getInitials(course.facilitador)}
                            </div>
                            <div className="mc-facilitator-details">
                                <span className="fname">{course.facilitador}</span>
                                <span className="role">
                                    <i className="fas fa-circle" style={{ color: 'var(--success)', fontSize: '0.5rem' }} />
                                    {course.facilitadorRole}
                                </span>
                            </div>
                        </div>
                        <button className="mc-contact-btn">
                            <i className="fas fa-envelope" />
                            Contactar facilitador
                        </button>
                    </div>

                    {/* Asistencia general */}
                    <div className="mc-attendance-card">
                        <div className="mc-attendance-card-title">Asistencia General</div>
                        <div className="mc-gauge-wrap">
                            <AttendanceGauge pct={overallAtt} />
                            <div className="mc-gauge-info">
                                <strong>{totalAtt} de {totalSess} sesiones</strong>
                                <span>con asistencia registrada</span>
                            </div>
                        </div>
                        {overallAtt >= 80 ? (
                            <div className="mc-req-note">
                                <i className="fas fa-shield-check" />
                                Cumples el requisito mínimo de asistencia (80%)
                            </div>
                        ) : (
                            <div className="mc-risk-note">
                                <i className="fas fa-exclamation-triangle" />
                                En riesgo: necesitas {80 - overallAtt}% más para certificar
                            </div>
                        )}
                    </div>

                    {/* Requisitos del certificado */}
                    <div className="mc-cert-card">
                        <div className="mc-cert-card-title">
                            <i className="fas fa-award" style={{ color: 'var(--capex-blue)', marginRight: 6 }} />
                            Requisitos del Certificado
                        </div>
                        <div className="mc-cert-req-list">
                            {certReqs.map((req, i) => (
                                <div className="mc-cert-req-item" key={i}>
                                    <i className={`${req.done ? 'fas fa-check-circle done' : 'far fa-circle pending'}`} />
                                    {req.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

/* ── Componente principal exportado ── */
export default function MisCursos() {
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleFormClick = (modulo) => {
        navigate('/encuestas', { state: { moduloId: modulo.id, moduloNombre: modulo.nombre } });
    };

    return selectedCourse ? (
        <CourseDetail
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
            onFormClick={handleFormClick}
        />
    ) : (
        <CourseList
            courses={DEMO_COURSES}
            onSelectCourse={setSelectedCourse}
        />
    );
}