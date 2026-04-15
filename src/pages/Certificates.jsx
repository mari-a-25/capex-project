import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Certificates.css';

/* ── Datos de demo ── */
const DEMO_CERTS = [
    {
        id: 'CPX-2026-CERT-001',
        programa: 'Introducción al Liderazgo Ejecutivo',
        categoria: 'Diplomado',
        facilitador: 'Dra. Ana Castillo',
        modalidad: 'Presencial',
        estado: 'disponible',
        fechaEmision: '15 Mar 2026',
        fechaInicio: '10 Ene 2026',
        fechaFin: '14 Mar 2026',
        duracion: '48 horas',
        modulos: 4,
        asistenciaPct: 92,
        progresoPct: 100,
        formsCompletados: 4,
        formsTotal: 4,
    },
    {
        id: 'CPX-2026-CERT-002',
        programa: 'Gestión Estratégica y Liderazgo Organizacional',
        categoria: 'Diplomado',
        facilitador: 'Dra. Ana Castillo',
        modalidad: 'Presencial',
        estado: 'en-proceso',
        fechaEmision: null,
        fechaInicio: '10 Ene 2026',
        fechaFin: '30 Jun 2026',
        duracion: '72 horas',
        modulos: 6,
        asistenciaPct: 88,
        progresoPct: 50,
        formsCompletados: 2,
        formsTotal: 6,
        requisitos: [
            { label: 'Asistencia ≥ 80%', done: true, detalle: '88% — Aprobado' },
            { label: 'Formularios de módulos', done: false, detalle: '2 de 6 completados' },
            { label: 'Módulos finalizados', done: false, detalle: '3 de 6 completados' },
        ],
    },
    {
        id: 'CPX-2026-CERT-003',
        programa: 'Comunicación Efectiva en Equipos de Alto Rendimiento',
        categoria: 'Taller',
        facilitador: 'Lic. Roberto Méndez',
        modalidad: 'Virtual',
        estado: 'bloqueado',
        fechaEmision: null,
        fechaInicio: '03 Mar 2026',
        fechaFin: '30 May 2026',
        duracion: '36 horas',
        modulos: 4,
        asistenciaPct: 75,
        progresoPct: 40,
        formsCompletados: 1,
        formsTotal: 4,
        motivoBloqueo: 'Formulario del Módulo 2 pendiente de completar.',
        moduloBloqueado: 'Módulo 2 — Feedback Constructivo',
    },
];

/* ── Componente de preview del certificado ── */
const CertPreview = ({ cert, onClick }) => (
    <div className="cert-preview-wrap" onClick={onClick}>
        <div className="cert-preview">
            <i className="fas fa-award cert-preview-icon" />
            <div className="cert-preview-label">Certificado</div>
            <div className="cert-preview-org">CAPEX</div>
        </div>
        {cert.estado === 'disponible' && (
            <div className="cert-preview-overlay">
                <i className="fas fa-expand-alt" />
                <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Ver</span>
            </div>
        )}
    </div>
);

/* ── Modal de detalle del certificado ── */
const CertModal = ({ cert, userName, onClose }) => {
    if (!cert) return null;

    return (
        <div className="cert-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="cert-modal-box" style={{ position: 'relative' }}>
                <button className="cert-modal-close" onClick={onClose}>
                    <i className="fas fa-times" />
                </button>

                {/* Certificado decorativo */}
                <div className="cert-modal-cert">
                    <div className="cert-modal-org">CAPEX · Centro de Innovación y Educación</div>
                    <i className="fas fa-award cert-modal-cert-icon" />
                    <div className="cert-modal-certifies">Certifica que</div>
                    <div className="cert-modal-name">{userName}</div>
                    <div className="cert-modal-program">
                        completó satisfactoriamente el programa<br />
                        <strong>{cert.programa}</strong>
                    </div>
                    <div className="cert-modal-divider" />
                    <div className="cert-modal-meta">
                        <span>
                            <span>Fecha de emisión</span>
                            <strong>{cert.fechaEmision}</strong>
                        </span>
                        <span>
                            <span>Asistencia</span>
                            <strong>{cert.asistenciaPct}%</strong>
                        </span>
                        <span>
                            <span>Duración</span>
                            <strong>{cert.duracion}</strong>
                        </span>
                    </div>
                </div>

                {/* Detalles */}
                <div className="cert-modal-body">
                    <div className="cert-modal-body-title">Detalles del certificado</div>
                    {[
                        { icon: 'fas fa-id-badge',          label: 'Código único',    val: cert.id },
                        { icon: 'fas fa-chalkboard-teacher', label: 'Facilitador',     val: cert.facilitador },
                        { icon: 'fas fa-calendar-check',    label: 'Fecha de inicio', val: cert.fechaInicio },
                        { icon: 'fas fa-calendar-times',    label: 'Fecha de cierre', val: cert.fechaFin },
                        { icon: 'fas fa-laptop',            label: 'Modalidad',       val: cert.modalidad },
                        { icon: 'fas fa-cubes',             label: 'Módulos',         val: `${cert.modulos} módulos completados` },
                    ].map((row, i) => (
                        <div className="cert-modal-detail-row" key={i}>
                            <i className={row.icon} />
                            <span className="dlabel">{row.label}</span>
                            <span className="dval">{row.val}</span>
                        </div>
                    ))}

                    <div className="cert-modal-actions">
                        <button className="cert-download-btn primary">
                            <i className="fas fa-download" />
                            Descargar PDF
                        </button>
                        <button className="cert-download-btn secondary">
                            <i className="fas fa-share-alt" />
                            Compartir
                        </button>
                        <button className="cert-download-btn ghost" onClick={onClose}>
                            <i className="fas fa-times" />
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Tarjeta de certificado ── */
const CertCard = ({ cert, userName, onPreview, onFormClick }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(cert.id).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const eyebrowMap = {
        disponible: { icon: 'fas fa-check-circle', label: 'Disponible para descarga' },
        'en-proceso': { icon: 'fas fa-spinner fa-spin', label: 'En proceso' },
        bloqueado:  { icon: 'fas fa-exclamation-triangle', label: 'Acción requerida' },
    };

    const overallPct = Math.round(
        ((cert.formsCompletados / cert.formsTotal) * 50) +
        ((cert.asistenciaPct >= 80 ? 1 : cert.asistenciaPct / 80) * 50)
    );

    return (
        <div className={`cert-card ${cert.estado}`}>
            <div className="cert-card-body">
                {/* Preview del certificado */}
                {cert.estado === 'disponible' && (
                    <CertPreview cert={cert} onClick={() => onPreview(cert)} />
                )}

                {/* Ícono de estado (para no disponibles) */}
                {cert.estado !== 'disponible' && (
                    <div className={`cert-state-icon ${cert.estado}`}>
                        <i className={cert.estado === 'en-proceso' ? 'fas fa-hourglass-half' : 'fas fa-lock'} />
                    </div>
                )}

                {/* Info principal */}
                <div className="cert-info">
                    <div className={`cert-eyebrow ${cert.estado}`}>
                        <i className={eyebrowMap[cert.estado].icon} />
                        {eyebrowMap[cert.estado].label}
                    </div>

                    <div className="cert-program-name">{cert.programa}</div>

                    <div className="cert-meta-row">
                        <span className="cert-meta-chip">
                            <i className="fas fa-tag" />
                            {cert.categoria}
                        </span>
                        <span className="cert-meta-chip">
                            <i className="fas fa-chalkboard-teacher" />
                            {cert.facilitador.split(' ').slice(0, 3).join(' ')}
                        </span>
                        <span className="cert-meta-chip">
                            <i className="fas fa-clock" />
                            {cert.duracion}
                        </span>
                        <span className="cert-meta-chip">
                            <i className="fas fa-laptop" />
                            {cert.modalidad}
                        </span>
                    </div>

                    {/* Código (solo disponibles) */}
                    {cert.estado === 'disponible' && (
                        <div className="cert-code-wrap">
                            <span className="cert-code-label">Código</span>
                            <span className="cert-code-value">{cert.id}</span>
                            <button className="cert-code-copy" onClick={handleCopy} title="Copiar código">
                                <i className={copied ? 'fas fa-check' : 'fas fa-copy'} style={{ color: copied ? 'var(--success)' : undefined }} />
                            </button>
                        </div>
                    )}

                    {/* Barra de progreso (en-proceso) */}
                    {cert.estado === 'en-proceso' && (
                        <div className="cert-progress-section">
                            <div className="cert-progress-label">
                                <span>Progreso hacia el certificado</span>
                                <span className="pct">{overallPct}%</span>
                            </div>
                            <div className="cert-progress-track">
                                <div
                                    className="cert-progress-fill"
                                    style={{ width: `${overallPct}%` }}
                                />
                            </div>
                            <div className="cert-mini-reqs">
                                {cert.requisitos.map((req, i) => (
                                    <span key={i} className={`cert-mini-req ${req.done ? 'done' : 'pending'}`}>
                                        <i className={req.done ? 'fas fa-check-circle' : 'far fa-circle'} />
                                        {req.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mensaje de bloqueo */}
                    {cert.estado === 'bloqueado' && (
                        <div className="cert-block-msg">
                            <i className="fas fa-exclamation-triangle" />
                            <span>
                                Acceso bloqueado — <strong>{cert.motivoBloqueo}</strong>
                            </span>
                            <button
                                className="cert-block-action"
                                onClick={() => onFormClick(cert)}
                            >
                                Completar →
                            </button>
                        </div>
                    )}
                </div>

                {/* Acciones */}
                <div className="cert-card-actions">
                    {cert.estado === 'disponible' && (
                        <>
                            <button
                                className="cert-download-btn primary"
                                onClick={() => onPreview(cert)}
                            >
                                <i className="fas fa-download" />
                                Descargar PDF
                            </button>
                            <button className="cert-download-btn secondary">
                                <i className="fas fa-share-alt" />
                                Compartir
                            </button>
                            {cert.fechaEmision && (
                                <div className="cert-issued-badge">
                                    <i className="fas fa-calendar-check" />
                                    Emitido el {cert.fechaEmision}
                                </div>
                            )}
                        </>
                    )}
                    {cert.estado === 'en-proceso' && (
                        <button className="cert-download-btn ghost">
                            <i className="fas fa-eye" />
                            Ver detalle
                        </button>
                    )}
                    {cert.estado === 'bloqueado' && (
                        <button
                            className="cert-download-btn secondary"
                            onClick={() => onFormClick(cert)}
                        >
                            <i className="fas fa-clipboard-check" />
                            Ir al formulario
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Componente principal ── */
export default function Certificates() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('todos');
    const [search, setSearch] = useState('');
    const [previewCert, setPreviewCert] = useState(null);

    const userName = `${user?.Nombre || 'Participante'} ${user?.Apellido || ''}`.trim();

    const tabs = [
        { key: 'todos',      label: 'Todos' },
        { key: 'disponible', label: 'Disponibles' },
        { key: 'en-proceso', label: 'En proceso' },
        { key: 'bloqueado',  label: 'Bloqueados' },
    ];

    const filtered = useMemo(() => {
        return DEMO_CERTS.filter(c => {
            const matchTab = activeTab === 'todos' || c.estado === activeTab;
            const matchSearch = !search || c.programa.toLowerCase().includes(search.toLowerCase());
            return matchTab && matchSearch;
        });
    }, [activeTab, search]);

    const counts = useMemo(() => ({
        todos:      DEMO_CERTS.length,
        disponible: DEMO_CERTS.filter(c => c.estado === 'disponible').length,
        'en-proceso': DEMO_CERTS.filter(c => c.estado === 'en-proceso').length,
        bloqueado:  DEMO_CERTS.filter(c => c.estado === 'bloqueado').length,
    }), []);

    const handleFormClick = () => navigate('/encuestas');

    return (
        <>
            {/* Header */}
            <div className="cert-page-header">
                <div>
                    <h1 className="cert-page-title">Mis Certificados</h1>
                    <p className="cert-page-subtitle">Bóveda digital de tus logros académicos en CAPEX.</p>
                </div>
                <div className="cert-search-wrap">
                    <i className="fas fa-search" />
                    <input
                        type="text"
                        placeholder="Buscar certificado..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="cert-tabs">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        className={`cert-tab-btn ${activeTab === t.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.key)}
                    >
                        {t.label}
                        <span className="cert-tab-count">{counts[t.key]}</span>
                    </button>
                ))}
            </div>

            {/* Layout */}
            <div className="cert-layout">

                {/* Columna principal */}
                <div>
                    {filtered.length === 0 ? (
                        <div className="cert-empty-section">
                            <i className="fas fa-award" />
                            <h4>Sin certificados en esta categoría</h4>
                            <p>Completa los requisitos de tus programas activos para obtener tu certificado.</p>
                        </div>
                    ) : (
                        <div className="cert-grid">
                            {filtered.map(cert => (
                                <CertCard
                                    key={cert.id}
                                    cert={cert}
                                    userName={userName}
                                    onPreview={setPreviewCert}
                                    onFormClick={handleFormClick}
                                />
                            ))}
                        </div>
                    )}

                    {/* Nota educativa al pie */}
                    <div className="cert-footer-note" style={{ marginTop: 20 }}>
                        <div className="cert-footer-note-icon">
                            <i className="fas fa-info" />
                        </div>
                        <div className="cert-footer-note-text">
                            <strong>Nota educativa:</strong> Los certificados se generan automáticamente al cumplir con <strong>el 80% de asistencia</strong> en todos los módulos del programa y haber <strong>completado todos los formularios de cierre de módulo</strong>. Si crees que hay un error en tu estado, contacta a soporte académico.
                        </div>
                    </div>
                </div>

                {/* Panel lateral */}
                <div className="cert-side-panel">

                    {/* Estadísticas */}
                    <div className="cert-stats-card">
                        <div className="cert-stats-card-title">
                            <i className="fas fa-chart-bar" style={{ color: 'var(--capex-blue)', marginRight: 6 }} />
                            Resumen
                        </div>
                        <div className="cert-stats-grid">
                            <div className="cert-stat-box green">
                                <span className="val">{counts.disponible}</span>
                                <span className="lbl">Obtenidos</span>
                            </div>
                            <div className="cert-stat-box blue">
                                <span className="val">{counts['en-proceso']}</span>
                                <span className="lbl">En proceso</span>
                            </div>
                            <div className="cert-stat-box orange">
                                <span className="val">{counts.bloqueado}</span>
                                <span className="lbl">Bloqueados</span>
                            </div>
                            <div className="cert-stat-box gray">
                                <span className="val">{counts.todos}</span>
                                <span className="lbl">Total</span>
                            </div>
                        </div>
                    </div>

                    {/* Requisitos generales */}
                    <div className="cert-reqs-card">
                        <div className="cert-reqs-card-title">
                            <i className="fas fa-clipboard-list" />
                            Requisitos para Certificar
                        </div>
                        {[
                            {
                                icon: 'fas fa-user-check',
                                done: true,
                                partial: false,
                                title: 'Asistencia mínima del 80%',
                                detail: 'Requerida en cada módulo del programa.',
                            },
                            {
                                icon: 'fas fa-clipboard-check',
                                done: false,
                                partial: true,
                                title: 'Formularios de cierre',
                                detail: 'Uno por módulo finalizado, obligatorio.',
                            },
                            {
                                icon: 'fas fa-cubes',
                                done: false,
                                partial: false,
                                title: 'Módulos completados',
                                detail: 'Todos los módulos del diplomado.',
                            },
                        ].map((req, i) => (
                            <div className="cert-req-item" key={i}>
                                <div className={`cert-req-icon ${req.done ? 'done' : req.partial ? 'partial' : 'pending'}`}>
                                    <i className={req.icon} />
                                </div>
                                <div className="cert-req-body">
                                    <strong>{req.title}</strong>
                                    <span>{req.detail}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nota educativa lateral */}
                    <div className="cert-edu-card">
                        <div className="cert-edu-card-inner">
                            <div className="cert-edu-icon">
                                <i className="fas fa-shield-alt" />
                            </div>
                            <div className="cert-edu-title">Certificados verificables</div>
                            <div className="cert-edu-text">
                                Cada certificado tiene un <strong>código único</strong> que puede ser verificado por empleadores o instituciones en el portal de CAPEX.
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal de preview */}
            {previewCert && (
                <CertModal
                    cert={previewCert}
                    userName={userName}
                    onClose={() => setPreviewCert(null)}
                />
            )}
        </>
    );
}