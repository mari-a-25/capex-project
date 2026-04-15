import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAirtableData } from '../services/useAirtableData';
import { useAuth } from '../context/AuthContext';
import './Surveys.css';

/* ── Datos de demo ── */
const PENDING_SURVEYS = [
    {
        id: 'sv-001',
        moduloId: 2,
        moduloNombre: 'Módulo 2 — Feedback Constructivo',
        programa: 'Comunicación Efectiva en Equipos de Alto Rendimiento',
        facilitador: 'Lic. Roberto Méndez',
        fechaLimite: '20 Abr 2026',
        estado: 'pending',
        siguienteModulo: 'Módulo 3 — Comunicación en Equipos Virtuales',
    },
];

const COMPLETED_SURVEYS = [
    {
        id: 'sv-000',
        moduloId: 1,
        moduloNombre: 'Módulo 1 — Fundamentos de la Comunicación',
        programa: 'Comunicación Efectiva en Equipos de Alto Rendimiento',
        facilitador: 'Lic. Roberto Méndez',
        fechaEnvio: '22 Mar 2026',
        estado: 'completed',
        calificacion: 9,
    },
    {
        id: 'sv-002',
        moduloId: 1,
        moduloNombre: 'Módulo 1 — Fundamentos del Liderazgo Moderno',
        programa: 'Gestión Estratégica y Liderazgo Organizacional',
        facilitador: 'Dra. Ana Castillo',
        fechaEnvio: '05 Feb 2026',
        estado: 'completed',
        calificacion: 10,
    },
];

/* ── Helper: texto según score ── */
const getScoreText = (score) => {
    if (!score) return null;
    if (score <= 4)  return { label: 'Bajo',      cls: 'low' };
    if (score <= 7)  return { label: 'Regular',   cls: 'mid' };
    return               { label: 'Excelente',  cls: 'high' };
};

/* ── Helper: clase NPS ── */
const getNpsClass = (n) => {
    if (n <= 6) return 'detractor';
    if (n <= 8) return 'passive';
    return 'promoter';
};

/* ── Componente de estrellas ── */
const StarRating = ({ value, onChange, max = 10 }) => {
    const [hover, setHover] = useState(0);
    const scoreText = getScoreText(value);

    return (
        <div>
            <div className="sv-stars-row">
                {Array.from({ length: max }, (_, i) => i + 1).map(n => (
                    <button
                        key={n}
                        type="button"
                        className={`sv-star-btn ${n <= (hover || value) ? (hover ? 'hover-fill' : 'filled') : ''}`}
                        onClick={() => onChange(n)}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`${n} de ${max}`}
                    >
                        ★
                    </button>
                ))}
                {value > 0 && (
                    <span className="sv-star-score-label">{value}/{max}</span>
                )}
                {scoreText && (
                    <span className={`sv-score-text ${scoreText.cls}`}>{scoreText.label}</span>
                )}
            </div>
        </div>
    );
};

/* ── Componente NPS ── */
const NpsSelector = ({ value, onChange }) => (
    <div className="sv-nps-wrap">
        <div className="sv-nps-numbers">
            {Array.from({ length: 11 }, (_, i) => i).map(n => (
                <button
                    key={n}
                    type="button"
                    className={`sv-nps-btn ${value === n ? `selected ${getNpsClass(n)}` : ''}`}
                    onClick={() => onChange(n)}
                    aria-label={`NPS ${n}`}
                >
                    {n}
                </button>
            ))}
        </div>
        <div className="sv-nps-labels">
            <span className="sv-nps-label-left">Nada probable</span>
            <span className="sv-nps-label-right">Muy probable</span>
        </div>
    </div>
);

/* ── Pantalla de éxito ── */
const SuccessScreen = ({ survey, onBack, onGoToCourses }) => (
    <div className="sv-success-wrap">
        <div className="sv-success-animation">
            <div className="sv-success-circle">
                <i className="fas fa-check sv-success-icon" />
            </div>
            <div className="sv-success-pulse" />
        </div>

        <h2 className="sv-success-title">¡Evaluación enviada!</h2>
        <p className="sv-success-sub">
            Gracias por completar el formulario del <strong>{survey.moduloNombre}</strong>.
            Tu opinión es valiosa para mejorar la calidad de nuestros programas.
        </p>

        {survey.siguienteModulo && (
            <div className="sv-unlock-card">
                <div className="sv-unlock-icon">
                    <i className="fas fa-lock-open" />
                </div>
                <div className="sv-unlock-text">
                    <span className="label">Módulo desbloqueado</span>
                    <span className="module">{survey.siguienteModulo}</span>
                </div>
            </div>
        )}

        <div className="sv-success-actions">
            <button className="sv-success-btn primary" onClick={onGoToCourses}>
                <i className="fas fa-graduation-cap" />
                Ver mis cursos
            </button>
            <button className="sv-success-btn secondary" onClick={onBack}>
                <i className="fas fa-list" />
                Volver a encuestas
            </button>
        </div>
    </div>
);

/* ── Formulario principal ── */
const SurveyForm = ({ survey, onBack, onSuccess }) => {
    const { user } = useAuth();
    const { submitSurvey } = useAirtableData();

    const [form, setForm] = useState({
        calificacionModulo:    0,
        calificacionFacilitador: 0,
        claridadContenido:     0,
        cumplioExpectativas:   null,
        comentarios:           '',
        nps:                   null,
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const maxChars = 400;

    const set = (key, val) => {
        setForm(prev => ({ ...prev, [key]: val }));
        setErrors(prev => ({ ...prev, [key]: false }));
    };

    /* Validación */
    const validate = () => {
        const e = {};
        if (!form.calificacionModulo)      e.calificacionModulo     = true;
        if (!form.calificacionFacilitador) e.calificacionFacilitador = true;
        if (!form.claridadContenido)       e.claridadContenido      = true;
        if (!form.cumplioExpectativas)     e.cumplioExpectativas    = true;
        if (form.nps === null)             e.nps                    = true;
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            const firstErr = document.querySelector('.sv-form-section.has-error');
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setLoading(true);
        try {
            await submitSurvey({
                Participante:            [user?.recordId],
                ModuloId:                survey.moduloId,
                Modulo:                  survey.moduloNombre,
                Programa:                survey.programa,
                Facilitador:             survey.facilitador,
                NPS:                     form.nps,
                Calificacion_Modulo:     form.calificacionModulo,
                Calificacion_Facilitador:form.calificacionFacilitador,
                Claridad_Contenido:      form.claridadContenido,
                Cumplio_Expectativas:    form.cumplioExpectativas,
                Comentarios:             form.comentarios,
                Satisfaccion:            form.cumplioExpectativas,
            });
            onSuccess();
        } catch (err) {
            console.error('Error al enviar formulario:', err);
            setLoading(false);
        }
    };

    /* Calcula completitud para la barra de pasos */
    const completedSteps = [
        form.calificacionModulo > 0,
        form.calificacionFacilitador > 0,
        form.claridadContenido > 0,
        form.cumplioExpectativas !== null,
        form.nps !== null,
    ].filter(Boolean).length;

    const totalSteps = 5;

    const stepLabels = [
        'Módulo',
        'Facilitador',
        'Contenido',
        'Expectativas',
        'Recomendación',
    ];

    const isComplete = completedSteps === totalSteps;

    return (
        <div className="sv-form-wrap">
            {/* Botón volver */}
            <button className="sv-back-btn" onClick={onBack}>
                <i className="fas fa-arrow-left" />
                Volver a encuestas
            </button>

            {/* Header */}
            <div className="sv-form-header">
                <div className="sv-form-header-shape" />
                <div className="sv-form-header-inner">
                    <div className="sv-form-header-icon">
                        <i className="fas fa-clipboard-list" />
                    </div>
                    <div className="sv-form-header-text">
                        <span className="eyebrow">Formulario de cierre · {survey.programa}</span>
                        <h2>{survey.moduloNombre}</h2>
                        <span className="program">
                            Facilitador: {survey.facilitador} &nbsp;·&nbsp; Fecha límite: {survey.fechaLimite}
                        </span>
                    </div>
                </div>
            </div>

            {/* Aviso de certificado */}
            <div className="sv-cert-warning">
                <div className="sv-cert-warning-icon">
                    <i className="fas fa-shield-alt" />
                </div>
                <div className="sv-cert-warning-text">
                    <strong>Este formulario es obligatorio.</strong> Debes completarlo para desbloquear el siguiente módulo y poder acceder a tu certificado de finalización.
                </div>
            </div>

            {/* Barra de progreso de pasos */}
            <div className="sv-steps-bar">
                {stepLabels.map((label, i) => {
                    const state = i < completedSteps ? 'done' : i === completedSteps ? 'active' : 'pending';
                    return (
                        <div key={i} className={`sv-step ${state}`}>
                            <div className="sv-step-num">
                                {state === 'done' ? <i className="fas fa-check" style={{ fontSize: '0.6rem' }} /> : i + 1}
                            </div>
                            <span className="sv-step-label">{label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Card del formulario */}
            <div className="sv-form-card">

                {/* 1. Calificación general del módulo */}
                <div className={`sv-form-section ${errors.calificacionModulo ? 'has-error' : ''}`}
                     style={ errors.calificacionModulo ? { background: 'rgba(239,68,68,0.02)', borderLeft: '3px solid var(--danger)' } : {} }>
                    <div className="sv-form-section-num">1</div>
                    <div className="sv-form-label">
                        Calificación general del módulo
                        <span className="sv-form-required">*</span>
                    </div>
                    <div className="sv-form-sublabel">
                        ¿Cómo calificarías el módulo en general? (1 = muy malo, 10 = excelente)
                    </div>
                    <StarRating
                        value={form.calificacionModulo}
                        onChange={val => set('calificacionModulo', val)}
                    />
                    {errors.calificacionModulo && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 8, fontWeight: 600 }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: 5 }} />
                            Este campo es obligatorio.
                        </div>
                    )}
                </div>

                {/* 2. Calificación del facilitador */}
                <div className={`sv-form-section ${errors.calificacionFacilitador ? 'has-error' : ''}`}
                     style={ errors.calificacionFacilitador ? { background: 'rgba(239,68,68,0.02)', borderLeft: '3px solid var(--danger)' } : {} }>
                    <div className="sv-form-section-num">2</div>
                    <div className="sv-form-label">
                        Calificación del facilitador
                        <span className="sv-form-required">*</span>
                    </div>
                    <div className="sv-form-sublabel">
                        Evalúa el desempeño de <strong>{survey.facilitador}</strong> durante este módulo.
                    </div>
                    <StarRating
                        value={form.calificacionFacilitador}
                        onChange={val => set('calificacionFacilitador', val)}
                    />
                    {errors.calificacionFacilitador && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 8, fontWeight: 600 }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: 5 }} />
                            Este campo es obligatorio.
                        </div>
                    )}
                </div>

                {/* 3. Claridad del contenido */}
                <div className={`sv-form-section ${errors.claridadContenido ? 'has-error' : ''}`}
                     style={ errors.claridadContenido ? { background: 'rgba(239,68,68,0.02)', borderLeft: '3px solid var(--danger)' } : {} }>
                    <div className="sv-form-section-num">3</div>
                    <div className="sv-form-label">
                        Claridad del contenido
                        <span className="sv-form-required">*</span>
                    </div>
                    <div className="sv-form-sublabel">
                        ¿Qué tan claro y comprensible fue el material presentado?
                    </div>
                    <StarRating
                        value={form.claridadContenido}
                        onChange={val => set('claridadContenido', val)}
                    />
                    {errors.claridadContenido && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 8, fontWeight: 600 }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: 5 }} />
                            Este campo es obligatorio.
                        </div>
                    )}
                </div>

                {/* 4. Expectativas */}
                <div className={`sv-form-section ${errors.cumplioExpectativas ? 'has-error' : ''}`}
                     style={ errors.cumplioExpectativas ? { background: 'rgba(239,68,68,0.02)', borderLeft: '3px solid var(--danger)' } : {} }>
                    <div className="sv-form-section-num">4</div>
                    <div className="sv-form-label">
                        ¿El módulo cumplió tus expectativas?
                        <span className="sv-form-required">*</span>
                    </div>
                    <div className="sv-form-sublabel">
                        Selecciona la opción que mejor describe tu experiencia.
                    </div>
                    <div className="sv-option-row">
                        {[
                            { val: 'Si',        label: 'Sí, totalmente', sublabel: 'Superó lo esperado', icon: '😊', cls: 'yes' },
                            { val: 'Parcial',   label: 'Parcialmente',  sublabel: 'Hubo cosas por mejorar', icon: '😐', cls: 'partial' },
                            { val: 'No',        label: 'No realmente',  sublabel: 'No cumplió lo esperado', icon: '😕', cls: 'no' },
                        ].map(opt => (
                            <button
                                key={opt.val}
                                type="button"
                                className={`sv-option-btn ${form.cumplioExpectativas === opt.val ? `selected ${opt.cls}` : ''}`}
                                onClick={() => set('cumplioExpectativas', opt.val)}
                            >
                                <span className="sv-option-icon">{opt.icon}</span>
                                <span className="sv-option-label">{opt.label}</span>
                                <span className="sv-option-sublabel">{opt.sublabel}</span>
                            </button>
                        ))}
                    </div>
                    {errors.cumplioExpectativas && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 10, fontWeight: 600 }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: 5 }} />
                            Por favor selecciona una opción.
                        </div>
                    )}
                </div>

                {/* 5. Comentarios */}
                <div className="sv-form-section">
                    <div className="sv-form-section-num">5</div>
                    <div className="sv-form-label">
                        Comentarios adicionales
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>&nbsp;(Opcional)</span>
                    </div>
                    <div className="sv-form-sublabel">
                        Comparte sugerencias, observaciones o cualquier otro comentario que nos ayude a mejorar.
                    </div>
                    <textarea
                        className="sv-textarea"
                        placeholder="Escribe aquí tus comentarios... (ej: me gustaría que se profundizara más en los casos prácticos)"
                        value={form.comentarios}
                        onChange={e => {
                            if (e.target.value.length <= maxChars) set('comentarios', e.target.value);
                        }}
                        rows={4}
                    />
                    <div className="sv-textarea-footer">
                        <span style={{ color: form.comentarios.length >= maxChars ? 'var(--danger)' : undefined }}>
                            {form.comentarios.length}/{maxChars}
                        </span>
                    </div>
                </div>

                {/* 6. NPS */}
                <div className={`sv-form-section ${errors.nps ? 'has-error' : ''}`}
                     style={ errors.nps ? { background: 'rgba(239,68,68,0.02)', borderLeft: '3px solid var(--danger)' } : {} }>
                    <div className="sv-form-section-num">6</div>
                    <div className="sv-form-label">
                        ¿Recomendarías este programa?
                        <span className="sv-form-required">*</span>
                    </div>
                    <div className="sv-form-sublabel">
                        En una escala del 0 al 10, ¿qué tan probable es que recomiendes este programa a un colega o amigo?
                    </div>
                    <NpsSelector
                        value={form.nps}
                        onChange={val => set('nps', val)}
                    />
                    {form.nps !== null && (
                        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                                background: form.nps >= 9 ? 'var(--success-light)' : form.nps >= 7 ? 'var(--warning-light)' : 'var(--danger-light)',
                                color: form.nps >= 9 ? '#065f46' : form.nps >= 7 ? '#92400e' : '#991b1b',
                                padding: '4px 12px',
                                borderRadius: '50px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                            }}>
                                {form.nps >= 9 ? '🏆 Promotor — ¡Gracias por tu confianza!' : form.nps >= 7 ? '😊 Pasivo — Valoramos tu opinión' : '😔 Detractor — Trabajaremos para mejorar'}
                            </span>
                        </div>
                    )}
                    {errors.nps && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 8, fontWeight: 600 }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: 5 }} />
                            Por favor selecciona un valor.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sv-form-footer">
                    <div className="sv-form-footer-note">
                        <i className="fas fa-shield-alt" />
                        Tus respuestas son anónimas y confidenciales.
                        {isComplete && (
                            <span style={{ color: 'var(--success)', fontWeight: 700, marginLeft: 8 }}>
                                <i className="fas fa-check-circle" style={{ marginRight: 4 }} />
                                Formulario completo
                            </span>
                        )}
                    </div>
                    <button
                        className={`sv-submit-btn ${loading ? 'loading' : ''}`}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane" />
                                Enviar evaluación
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Componente principal ── */
export default function Surveys() {
    const navigate = useNavigate();
    const location = useLocation();

    /* Si venimos desde MisCursos con un módulo preseleccionado */
    const preSelected = location.state?.moduloId
        ? PENDING_SURVEYS.find(s => s.moduloId === location.state.moduloId) || null
        : null;

    const [activeSurvey, setActiveSurvey] = useState(preSelected);
    const [submitted, setSubmitted] = useState(false);

    /* Vista: lista de pendientes */
    if (!activeSurvey) {
        return (
            <>
                <div className="sv-page-header">
                    <h1 className="sv-page-title">Encuestas</h1>
                    <p className="sv-page-subtitle">Formularios de cierre de módulo pendientes y completados.</p>
                </div>

                {/* Pendientes */}
                <div className="sv-section-label">
                    <i className="fas fa-clock" style={{ color: 'var(--warning)', fontSize: '0.75rem' }} />
                    Pendientes
                </div>

                <div className="sv-surveys-grid">
                    {PENDING_SURVEYS.length === 0 ? (
                        <div className="sv-empty">
                            <i className="fas fa-clipboard-check" />
                            <h4>¡Todo al día!</h4>
                            <p>No tienes formularios pendientes en este momento.</p>
                        </div>
                    ) : (
                        PENDING_SURVEYS.map(sv => (
                            <div
                                key={sv.id}
                                className="sv-survey-card pending"
                                onClick={() => { setActiveSurvey(sv); setSubmitted(false); }}
                            >
                                <div className="sv-survey-icon pending">
                                    <i className="fas fa-clipboard-list" />
                                </div>
                                <div className="sv-survey-info">
                                    <div className="sv-survey-module">{sv.moduloNombre}</div>
                                    <div className="sv-survey-program">{sv.programa}</div>
                                    <div className="sv-survey-date">
                                        <i className="fas fa-calendar-times" />
                                        Fecha límite: {sv.fechaLimite}
                                    </div>
                                </div>
                                <button
                                    className="sv-survey-action primary"
                                    onClick={e => { e.stopPropagation(); setActiveSurvey(sv); setSubmitted(false); }}
                                >
                                    <i className="fas fa-pen" />
                                    Completar
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Completados */}
                <div className="sv-section-label" style={{ marginTop: 8 }}>
                    <i className="fas fa-check-circle" style={{ color: 'var(--success)', fontSize: '0.75rem' }} />
                    Completados
                </div>

                <div className="sv-surveys-grid">
                    {COMPLETED_SURVEYS.length === 0 ? (
                        <div className="sv-empty">
                            <i className="fas fa-inbox" />
                            <h4>Sin historial</h4>
                            <p>Aún no has completado ningún formulario.</p>
                        </div>
                    ) : (
                        COMPLETED_SURVEYS.map(sv => (
                            <div key={sv.id} className="sv-survey-card completed">
                                <div className="sv-survey-icon completed">
                                    <i className="fas fa-check-circle" />
                                </div>
                                <div className="sv-survey-info">
                                    <div className="sv-survey-module">{sv.moduloNombre}</div>
                                    <div className="sv-survey-program">{sv.programa}</div>
                                    <div className="sv-survey-date">
                                        <i className="fas fa-calendar-check" />
                                        Enviado el {sv.fechaEnvio}
                                        &nbsp;·&nbsp;
                                        <i className="fas fa-star" style={{ color: '#f59e0b' }} />
                                        &nbsp;{sv.calificacion}/10
                                    </div>
                                </div>
                                <div className="sv-survey-action done">
                                    <i className="fas fa-check" />
                                    Completado
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </>
        );
    }

    /* Vista: pantalla de éxito */
    if (submitted) {
        return (
            <SuccessScreen
                survey={activeSurvey}
                onBack={() => { setActiveSurvey(null); setSubmitted(false); }}
                onGoToCourses={() => navigate('/mis-cursos')}
            />
        );
    }

    /* Vista: formulario activo */
    return (
        <SurveyForm
            survey={activeSurvey}
            onBack={() => setActiveSurvey(null)}
            onSuccess={() => setSubmitted(true)}
        />
    );
}