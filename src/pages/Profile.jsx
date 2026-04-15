import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAirtableData } from '../services/useAirtableData';
import './Profile.css';

/* ── Helpers ── */
const getInitials = (nombre = '', apellido = '') =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || 'U';

/* ── Datos de demo — historial académico ── */
const DEMO_HISTORIAL = [
    {
        id: 1,
        programa: 'Gestión Estratégica y Liderazgo Organizacional',
        categoria: 'Diplomado',
        modalidad: 'Presencial',
        facilitador: 'Dra. Ana Castillo',
        fechaInicio: '10 Ene 2026',
        fechaFin: '30 Jun 2026',
        estado: 'activo',
        progresoPct: 50,
        modulosCompletados: 3,
        totalModulos: 6,
    },
    {
        id: 2,
        programa: 'Comunicación Efectiva en Equipos de Alto Rendimiento',
        categoria: 'Taller',
        modalidad: 'Virtual',
        facilitador: 'Lic. Roberto Méndez',
        fechaInicio: '03 Mar 2026',
        fechaFin: '30 May 2026',
        estado: 'activo',
        progresoPct: 40,
        modulosCompletados: 1,
        totalModulos: 4,
    },
    {
        id: 3,
        programa: 'Introducción al Liderazgo Ejecutivo',
        categoria: 'Diplomado',
        modalidad: 'Presencial',
        facilitador: 'Dra. Ana Castillo',
        fechaInicio: '05 Ago 2025',
        fechaFin: '15 Nov 2025',
        estado: 'completado',
        progresoPct: 100,
        modulosCompletados: 4,
        totalModulos: 4,
    },
    {
        id: 4,
        programa: 'Finanzas para No Financieros',
        categoria: 'Taller',
        modalidad: 'Virtual',
        facilitador: 'CPA. Juan Rodríguez',
        fechaInicio: '10 Abr 2025',
        fechaFin: '20 May 2025',
        estado: 'completado',
        progresoPct: 100,
        modulosCompletados: 3,
        totalModulos: 3,
    },
];

/* ── Estilos embebidos ── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

.pf-wrap {
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 22px;
    font-family: 'DM Sans', sans-serif;
    color: #0f1e2e;
}

/* ── Page header ── */
.pf-page-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.6rem;
    font-weight: 900;
    color: #0f1e2e;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
}

.pf-page-subtitle {
    font-size: 0.875rem;
    color: #8faab8;
    font-weight: 500;
}

/* ── Cards genéricas ── */
.pf-card {
    background: white;
    border-radius: 20px;
    border: 1px solid #d4e6f1;
    box-shadow: 0 1px 3px rgba(14,130,193,0.06), 0 1px 2px rgba(0,0,0,0.04);
    overflow: hidden;
}

.pf-card-header {
    padding: 20px 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.pf-card-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #8faab8;
    display: flex;
    align-items: center;
    gap: 7px;
}

.pf-card-title i { color: #0e82c1; }

.pf-card-body {
    padding: 20px 24px 24px;
}

/* ── Banner de perfil ── */
.pf-banner {
    background: linear-gradient(135deg, #064b70 0%, #0e82c1 60%, #1a9fd4 100%);
    border-radius: 20px;
    padding: 28px 30px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 36px rgba(14,130,193,0.14), 0 4px 12px rgba(0,0,0,0.06);
}

.pf-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px);
    background-size: 22px 22px;
    pointer-events: none;
}

.pf-banner-shape-1 {
    position: absolute;
    width: 220px; height: 220px;
    border-radius: 50%;
    border: 32px solid rgba(255,255,255,0.05);
    top: -80px; right: -60px;
    pointer-events: none;
}

.pf-banner-shape-2 {
    position: absolute;
    width: 140px; height: 140px;
    border-radius: 50%;
    border: 22px solid rgba(255,255,255,0.04);
    bottom: -50px; left: 200px;
    pointer-events: none;
}

.pf-banner-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 22px;
    flex-wrap: wrap;
}

.pf-avatar {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: rgba(255,255,255,0.18);
    border: 3px solid rgba(255,255,255,0.35);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 900;
    font-size: 1.8rem;
    color: white;
    flex-shrink: 0;
    backdrop-filter: blur(6px);
    letter-spacing: -0.02em;
}

.pf-banner-info { flex: 1; min-width: 0; }

.pf-banner-greeting {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.6);
    display: block;
    margin-bottom: 5px;
}

.pf-banner-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.65rem;
    font-weight: 900;
    color: white;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 8px;
}

.pf-banner-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 10px;
}

.pf-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 13px;
    border-radius: 50px;
    font-size: 0.72rem;
    font-weight: 700;
    background: rgba(255,255,255,0.14);
    border: 1px solid rgba(255,255,255,0.22);
    color: rgba(255,255,255,0.9);
    backdrop-filter: blur(4px);
}

.pf-chip i { font-size: 0.65rem; }

/* Stats del banner */
.pf-banner-stats {
    display: flex;
    gap: 0;
    background: rgba(255,255,255,0.11);
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 14px;
    overflow: hidden;
    backdrop-filter: blur(6px);
    flex-shrink: 0;
    align-self: flex-start;
}

.pf-banner-stat {
    padding: 12px 18px;
    text-align: center;
    border-right: 1px solid rgba(255,255,255,0.12);
}

.pf-banner-stat:last-child { border-right: none; }

.pf-banner-stat .val {
    display: block;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.35rem;
    font-weight: 900;
    color: white;
    line-height: 1;
    margin-bottom: 3px;
}

.pf-banner-stat .lbl {
    display: block;
    font-size: 0.6rem;
    font-weight: 600;
    color: rgba(255,255,255,0.58);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

/* ── Sección de datos ── */
.pf-section-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #8faab8;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.pf-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #d4e6f1;
}

.pf-section-title i { color: #0e82c1; font-size: 0.75rem; }

/* Grid de campos */
.pf-fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.pf-field-full { grid-column: span 2; }

/* Campo individual */
.pf-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.pf-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #4a6278;
    display: flex;
    align-items: center;
    gap: 6px;
}

.pf-label i { font-size: 0.7rem; color: #0e82c1; }

.pf-input {
    padding: 10px 14px;
    border: 1.5px solid #d4e6f1;
    border-radius: 10px;
    font-size: 0.88rem;
    font-family: 'DM Sans', sans-serif;
    color: #0f1e2e;
    background: #fafcfe;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    outline: none;
}

.pf-input:focus {
    border-color: #0e82c1;
    background: white;
    box-shadow: 0 0 0 3px rgba(14,130,193,0.1);
}

.pf-input::placeholder { color: #8faab8; }

.pf-input.locked {
    background: #f0f6fb;
    color: #8faab8;
    cursor: not-allowed;
    border-style: dashed;
    border-color: #d4e6f1;
}

/* Toast de guardado */
.pf-toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: 12px;
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 14px;
    animation: pfToastIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
}

@keyframes pfToastIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
}

.pf-toast.success {
    background: #d1fae5;
    border: 1px solid rgba(16,185,129,0.25);
    color: #065f46;
}

.pf-toast.error {
    background: #fee2e2;
    border: 1px solid rgba(239,68,68,0.2);
    color: #991b1b;
}

.pf-toast i { font-size: 0.9rem; }

/* Botón guardar */
.pf-form-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid #edf2f7;
    flex-wrap: wrap;
    gap: 12px;
}

.pf-form-note {
    font-size: 0.75rem;
    color: #8faab8;
    display: flex;
    align-items: center;
    gap: 6px;
}

.pf-form-note i { color: #0e82c1; }

.pf-save-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 24px;
    background: #0e82c1;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 14px rgba(14,130,193,0.28);
}

.pf-save-btn:hover:not(:disabled) {
    background: #064b70;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14,130,193,0.36);
}

.pf-save-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* ── Historial académico ── */
.pf-historial-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.pf-hist-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 18px;
    border-radius: 14px;
    border: 1px solid #edf2f7;
    background: #fafcfe;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    overflow: hidden;
}

.pf-hist-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    border-radius: 4px 0 0 4px;
}

.pf-hist-item.activo::before    { background: linear-gradient(to bottom, #0e82c1, #1a9fd4); }
.pf-hist-item.completado::before { background: linear-gradient(to bottom, #10b981, #34d399); }
.pf-hist-item.retirado::before  { background: linear-gradient(to bottom, #8faab8, #a0aec0); }

.pf-hist-item:hover {
    border-color: rgba(14,130,193,0.2);
    box-shadow: 0 4px 16px rgba(14,130,193,0.08);
    background: white;
}

.pf-hist-icon {
    width: 40px; height: 40px;
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem;
    flex-shrink: 0;
}

.pf-hist-icon.activo     { background: #e8f4fd; color: #0e82c1; }
.pf-hist-icon.completado { background: #d1fae5; color: #10b981; }
.pf-hist-icon.retirado   { background: #f1f5f9; color: #8faab8; }

.pf-hist-info { flex: 1; min-width: 0; }

.pf-hist-category {
    font-size: 0.64rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8faab8;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.pf-hist-category i { font-size: 0.62rem; color: #0e82c1; }

.pf-hist-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 800;
    color: #0f1e2e;
    margin-bottom: 5px;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pf-hist-meta {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
}

.pf-hist-meta-chip {
    font-size: 0.72rem;
    color: #8faab8;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
}

.pf-hist-meta-chip i { font-size: 0.64rem; color: #0e82c1; }

.pf-hist-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    flex-shrink: 0;
}

/* Badge de estado */
.pf-estado-badge {
    padding: 4px 11px;
    border-radius: 50px;
    font-size: 0.67rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}

.pf-estado-badge::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    display: inline-block;
}

.pf-estado-badge.activo {
    background: #e8f4fd;
    color: #064b70;
}
.pf-estado-badge.activo::before { background: #0e82c1; }

.pf-estado-badge.completado {
    background: #d1fae5;
    color: #065f46;
}
.pf-estado-badge.completado::before { background: #10b981; }

.pf-estado-badge.retirado {
    background: #f1f5f9;
    color: #4a6278;
}
.pf-estado-badge.retirado::before { background: #8faab8; }

/* Barra de progreso mini */
.pf-hist-progress {
    display: flex;
    align-items: center;
    gap: 6px;
}

.pf-hist-prog-track {
    width: 70px;
    height: 4px;
    background: #e8edf2;
    border-radius: 10px;
    overflow: hidden;
}

.pf-hist-prog-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
}

.pf-hist-prog-fill.activo     { background: linear-gradient(90deg, #0e82c1, #1a9fd4); }
.pf-hist-prog-fill.completado { background: linear-gradient(90deg, #10b981, #34d399); }
.pf-hist-prog-fill.retirado   { background: #d4e6f1; }

.pf-hist-prog-pct {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 800;
    color: #4a6278;
    min-width: 28px;
    text-align: right;
}

/* Empty del historial */
.pf-hist-empty {
    background: white;
    border-radius: 14px;
    border: 2px dashed #d4e6f1;
    padding: 40px 20px;
    text-align: center;
}

.pf-hist-empty i {
    font-size: 2rem;
    color: #d4e6f1;
    margin-bottom: 12px;
    display: block;
}

.pf-hist-empty p {
    font-size: 0.85rem;
    color: #8faab8;
}

/* ── Responsive ── */
@media (max-width: 700px) {
    .pf-fields-grid { grid-template-columns: 1fr; }
    .pf-field-full  { grid-column: span 1; }
    .pf-banner-inner { flex-direction: column; }
    .pf-banner-stats { align-self: stretch; }
    .pf-banner-stat  { flex: 1; }
    .pf-form-footer  { flex-direction: column; align-items: stretch; }
    .pf-save-btn     { width: 100%; justify-content: center; }
    .pf-hist-item    { flex-wrap: wrap; }
    .pf-hist-right   { flex-direction: row; align-items: center; width: 100%; }
    .pf-banner-name  { font-size: 1.3rem; }
}
`;

/* ── Componente principal ── */
export default function Profile() {
    const { user } = useAuth();
    const { updateParticipant } = useAirtableData();

    const [formData, setFormData] = useState({
        Teléfono:      user?.Teléfono      || '',
        Empresa_actual: user?.Empresa_actual || '',
        Posición:      user?.Posición      || '',
        Dirección:     user?.Dirección     || '',
    });

    const [saving,  setSaving]  = useState(false);
    const [toast,   setToast]   = useState(null);
    const [changed, setChanged] = useState(false);

    const initials  = getInitials(user?.Nombre, user?.Apellido);
    const fullName  = `${user?.Nombre || 'Usuario'} ${user?.Apellido || ''}`.trim();
    const matricula = user?.Matricula || user?.ID_participante || 'CPX-2026-001';

    const totalCursos    = DEMO_HISTORIAL.length;
    const completados    = DEMO_HISTORIAL.filter(h => h.estado === 'completado').length;
    const activos        = DEMO_HISTORIAL.filter(h => h.estado === 'activo').length;

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setChanged(true);
        setToast(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setToast(null);
        try {
            await updateParticipant(user.recordId, formData);
            setToast({ type: 'success', msg: 'Información actualizada correctamente.' });
            setChanged(false);
        } catch {
            setToast({ type: 'error', msg: 'No se pudo guardar. Intenta nuevamente.' });
        } finally {
            setSaving(false);
        }
    };

    const stateIcon = {
        activo:     'fas fa-book-open',
        completado: 'fas fa-check',
        retirado:   'fas fa-times',
    };

    const catIcon = {
        Diplomado: 'fas fa-graduation-cap',
        Taller:    'fas fa-tools',
        Seminario: 'fas fa-microphone-alt',
    };

    return (
        <>
            {/* Estilos embebidos */}
            <style>{styles}</style>

            <div className="pf-wrap">
                {/* ── PAGE HEADER ── */}
                <div>
                    <h1 className="pf-page-title">Mi Perfil</h1>
                    <p className="pf-page-subtitle">Gestiona tu información personal y académica.</p>
                </div>

                {/* ── BANNER DE PERFIL ── */}
                <div className="pf-banner">
                    <div className="pf-banner-shape-1" />
                    <div className="pf-banner-shape-2" />
                    <div className="pf-banner-inner">
                        <div className="pf-avatar">{initials}</div>
                        <div className="pf-banner-info">
                            <span className="pf-banner-greeting">Participante activo</span>
                            <div className="pf-banner-name">{fullName}</div>
                            <div className="pf-banner-chips">
                                <span className="pf-chip">
                                    <i className="fas fa-id-card" />
                                    {matricula}
                                </span>
                                {user?.Correo && (
                                    <span className="pf-chip">
                                        <i className="fas fa-envelope" />
                                        {user.Correo}
                                    </span>
                                )}
                                <span className="pf-chip">
                                    <i className="fas fa-map-marker-alt" />
                                    {user?.Nacionalidad || 'República Dominicana'}
                                </span>
                            </div>
                        </div>

                        <div className="pf-banner-stats">
                            <div className="pf-banner-stat">
                                <span className="val">{totalCursos}</span>
                                <span className="lbl">Programas</span>
                            </div>
                            <div className="pf-banner-stat">
                                <span className="val">{completados}</span>
                                <span className="lbl">Completados</span>
                            </div>
                            <div className="pf-banner-stat">
                                <span className="val">{activos}</span>
                                <span className="lbl">Activos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── INFORMACIÓN PERSONAL ── */}
                <div className="pf-card">
                    <div className="pf-card-header">
                        <div className="pf-card-title">
                            <i className="fas fa-user-circle" />
                            Información Personal
                        </div>
                    </div>
                    <div className="pf-card-body">

                        {/* Toast */}
                        {toast && (
                            <div className={`pf-toast ${toast.type}`}>
                                <i className={toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'} />
                                {toast.msg}
                            </div>
                        )}

                        {/* Solo lectura */}
                        <div className="pf-section-title">
                            <i className="fas fa-lock" />
                            Datos de solo lectura
                        </div>
                        <div className="pf-fields-grid" style={{ marginBottom: 22 }}>
                            <div className="pf-field">
                                <div className="pf-label">
                                    <i className="fas fa-envelope" /> Correo principal
                                </div>
                                <input
                                    className="pf-input locked"
                                    type="text"
                                    value={user?.Correo || '—'}
                                    disabled
                                    readOnly
                                />
                            </div>
                            <div className="pf-field">
                                <div className="pf-label">
                                    <i className="fas fa-id-badge" /> Cédula / Pasaporte
                                </div>
                                <input
                                    className="pf-input locked"
                                    type="text"
                                    value={user?.Cédula_pasaporte || '—'}
                                    disabled
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Editables */}
                        <div className="pf-section-title">
                            <i className="fas fa-pen" />
                            Datos editables
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="pf-fields-grid">
                                <div className="pf-field">
                                    <label className="pf-label" htmlFor="pf-telefono">
                                        <i className="fas fa-phone" /> Teléfono móvil
                                    </label>
                                    <input
                                        id="pf-telefono"
                                        className="pf-input"
                                        type="tel"
                                        name="Teléfono"
                                        placeholder="809-000-0000"
                                        value={formData.Teléfono}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="pf-field">
                                    <label className="pf-label" htmlFor="pf-empresa">
                                        <i className="fas fa-building" /> Empresa actual
                                    </label>
                                    <input
                                        id="pf-empresa"
                                        className="pf-input"
                                        type="text"
                                        name="Empresa_actual"
                                        placeholder="Nombre de tu empresa"
                                        value={formData.Empresa_actual}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="pf-field">
                                    <label className="pf-label" htmlFor="pf-cargo">
                                        <i className="fas fa-briefcase" /> Cargo / Posición
                                    </label>
                                    <input
                                        id="pf-cargo"
                                        className="pf-input"
                                        type="text"
                                        name="Posición"
                                        placeholder="Ej: Gerente de Recursos Humanos"
                                        value={formData.Posición}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="pf-field pf-field-full">
                                    <label className="pf-label" htmlFor="pf-direccion">
                                        <i className="fas fa-map-marker-alt" /> Dirección completa
                                    </label>
                                    <input
                                        id="pf-direccion"
                                        className="pf-input"
                                        type="text"
                                        name="Dirección"
                                        placeholder="Calle, número, sector, ciudad"
                                        value={formData.Dirección}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="pf-form-footer">
                                <div className="pf-form-note">
                                    <i className="fas fa-shield-alt" />
                                    Tu información está protegida y no se comparte con terceros.
                                </div>
                                <button
                                    type="submit"
                                    className="pf-save-btn"
                                    disabled={saving || !changed}
                                >
                                    {saving ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save" />
                                            Guardar cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* ── HISTORIAL ACADÉMICO ── */}
                <div className="pf-card">
                    <div className="pf-card-header">
                        <div className="pf-card-title">
                            <i className="fas fa-graduation-cap" />
                            Mi Historial Académico
                        </div>
                        <div style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#0e82c1',
                            background: '#e8f4fd',
                            padding: '4px 12px',
                            borderRadius: '50px',
                        }}>
                            {totalCursos} programas
                        </div>
                    </div>
                    <div className="pf-card-body">

                        {DEMO_HISTORIAL.length === 0 ? (
                            <div className="pf-hist-empty">
                                <i className="fas fa-folder-open" />
                                <p>No tienes programas registrados aún.</p>
                            </div>
                        ) : (
                            <div className="pf-historial-list">
                                {DEMO_HISTORIAL.map(h => (
                                    <div key={h.id} className={`pf-hist-item ${h.estado}`}>
                                        <div className={`pf-hist-icon ${h.estado}`}>
                                            <i className={stateIcon[h.estado]} />
                                        </div>

                                        <div className="pf-hist-info">
                                            <div className="pf-hist-category">
                                                <i className={catIcon[h.categoria] || 'fas fa-book'} />
                                                {h.categoria} · {h.modalidad}
                                            </div>
                                            <div className="pf-hist-name">{h.programa}</div>
                                            <div className="pf-hist-meta">
                                                <span className="pf-hist-meta-chip">
                                                    <i className="fas fa-chalkboard-teacher" />
                                                    {h.facilitador.split(' ').slice(0, 3).join(' ')}
                                                </span>
                                                <span className="pf-hist-meta-chip">
                                                    <i className="fas fa-calendar-alt" />
                                                    {h.fechaInicio} → {h.fechaFin}
                                                </span>
                                                <span className="pf-hist-meta-chip">
                                                    <i className="fas fa-cubes" />
                                                    {h.modulosCompletados}/{h.totalModulos} módulos
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pf-hist-right">
                                            <span className={`pf-estado-badge ${h.estado}`}>
                                                {h.estado === 'activo'     ? 'En curso'   : ''}
                                                {h.estado === 'completado' ? 'Completado' : ''}
                                                {h.estado === 'retirado'   ? 'Retirado'   : ''}
                                            </span>
                                            <div className="pf-hist-progress">
                                                <div className="pf-hist-prog-track">
                                                    <div
                                                        className={`pf-hist-prog-fill ${h.estado}`}
                                                        style={{ width: `${h.progresoPct}%` }}
                                                    />
                                                </div>
                                                <span className="pf-hist-prog-pct">{h.progresoPct}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── SEGURIDAD ── */}
                <div className="pf-card">
                    <div className="pf-card-header">
                        <div className="pf-card-title">
                            <i className="fas fa-shield-alt" />
                            Seguridad de la cuenta
                        </div>
                    </div>
                    <div className="pf-card-body">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f1e2e', marginBottom: 3 }}>
                                    Contraseña
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#8faab8' }}>
                                    Para cambiar tu contraseña contacta a soporte académico.
                                </div>
                            </div>
                            <button
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 7,
                                    padding: '9px 20px',
                                    border: '1.5px solid #d4e6f1',
                                    borderRadius: '50px',
                                    background: 'white',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    color: '#4a6278',
                                    cursor: 'pointer',
                                    fontFamily: "'DM Sans', sans-serif",
                                    transition: 'all 0.22s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#0e82c1';
                                    e.currentTarget.style.color = '#0e82c1';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#d4e6f1';
                                    e.currentTarget.style.color = '#4a6278';
                                }}
                                onClick={() => window.location.href = 'mailto:info@capex.edu.do?subject=Cambio de contraseña'}
                            >
                                <i className="fas fa-envelope" />
                                Contactar soporte
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            marginTop: 16,
                            paddingTop: 16,
                            borderTop: '1px solid #edf2f7',
                        }}>
                            <div style={{
                                width: 34, height: 34,
                                background: '#d1fae5',
                                borderRadius: 9,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#10b981',
                                fontSize: '0.85rem',
                                flexShrink: 0,
                            }}>
                                <i className="fas fa-check-circle" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#065f46' }}>
                                    Cuenta verificada
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#8faab8' }}>
                                    Tu correo ha sido verificado y tu cuenta está activa.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}