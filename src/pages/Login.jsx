import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Estilos embebidos ── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

.lp-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'DM Sans', sans-serif;
}

/* ── Panel izquierdo decorativo ── */
.lp-left {
    background: linear-gradient(160deg, #064b70 0%, #0e82c1 55%, #1a9fd4 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 50px;
    position: relative;
    overflow: hidden;
}

/* Patrón de puntos */
.lp-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px);
    background-size: 26px 26px;
    pointer-events: none;
}

/* Formas decorativas */
.lp-shape-1 {
    position: absolute;
    width: 380px; height: 380px;
    border-radius: 50%;
    border: 50px solid rgba(255,255,255,0.05);
    top: -140px; right: -100px;
    pointer-events: none;
}

.lp-shape-2 {
    position: absolute;
    width: 240px; height: 240px;
    border-radius: 50%;
    border: 35px solid rgba(255,255,255,0.04);
    bottom: -80px; left: -60px;
    pointer-events: none;
}

.lp-shape-3 {
    position: absolute;
    width: 160px; height: 160px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.06);
    top: 35%; left: 8%;
    pointer-events: none;
}

.lp-left-inner {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 420px;
}

/* Logo en el panel izquierdo */
.lp-logo-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 44px;
}

.lp-logo-img {
    width: 130px;
    height: 130px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    drop-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.lp-left-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2.2rem;
    font-weight: 900;
    color: white;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
}

.lp-left-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.78);
    line-height: 1.7;
    margin-bottom: 40px;
}

/* Features list */
.lp-features {
    display: flex;
    flex-direction: column;
    gap: 14px;
    text-align: left;
}

.lp-feature {
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 14px;
    padding: 13px 18px;
    backdrop-filter: blur(6px);
    transition: background 0.2s;
}

.lp-feature:hover {
    background: rgba(255,255,255,0.14);
}

.lp-feature-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: rgba(255,255,255,0.16);
    display: flex; align-items: center; justify-content: center;
    color: white;
    font-size: 0.9rem;
    flex-shrink: 0;
}

.lp-feature-text strong {
    display: block;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1px;
}

.lp-feature-text span {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.64);
}

/* Footer izquierdo */
.lp-left-footer {
    position: absolute;
    bottom: 24px;
    left: 0; right: 0;
    text-align: center;
    font-size: 0.72rem;
    color: rgba(255,255,255,0.38);
    font-weight: 500;
    z-index: 1;
}

/* ── Panel derecho — Formulario ── */
.lp-right {
    background: #f0f6fb;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    position: relative;
    overflow-y: auto;
}

/* Logo pequeño arriba derecha (visible en móvil) */
.lp-mobile-logo {
    display: none;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
}

.lp-mobile-logo img {
    width: 70px;
    height: 70px;
    object-fit: contain;
}

.lp-form-wrap {
    width: 100%;
    max-width: 420px;
}

/* Encabezado del formulario */
.lp-form-header {
    margin-bottom: 32px;
}

.lp-back-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #4a6278;
    text-decoration: none;
    margin-bottom: 28px;
    padding: 6px 14px;
    background: white;
    border: 1.5px solid #d4e6f1;
    border-radius: 50px;
    transition: all 0.2s;
}

.lp-back-link:hover {
    border-color: #0e82c1;
    color: #0e82c1;
    background: #e8f4fd;
}

.lp-form-eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #0e82c1;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 7px;
}

.lp-form-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.85rem;
    font-weight: 900;
    color: #0f1e2e;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
    line-height: 1.15;
}

.lp-form-subtitle {
    font-size: 0.88rem;
    color: #8faab8;
    font-weight: 500;
    line-height: 1.5;
}

/* ── Card del formulario ── */
.lp-form-card {
    background: white;
    border-radius: 22px;
    border: 1px solid #d4e6f1;
    box-shadow: 0 4px 16px rgba(14,130,193,0.08), 0 2px 6px rgba(0,0,0,0.04);
    padding: 30px 28px 28px;
    margin-bottom: 20px;
}

/* Campo */
.lp-field {
    margin-bottom: 18px;
}

.lp-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #4a6278;
    margin-bottom: 7px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.lp-label i { font-size: 0.7rem; color: #0e82c1; }

.lp-input-wrap {
    position: relative;
}

.lp-input {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border: 1.5px solid #d4e6f1;
    border-radius: 12px;
    font-size: 0.9rem;
    font-family: 'DM Sans', sans-serif;
    color: #0f1e2e;
    background: #fafcfe;
    outline: none;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    box-sizing: border-box;
}

.lp-input::placeholder { color: #8faab8; }

.lp-input:focus {
    border-color: #0e82c1;
    background: white;
    box-shadow: 0 0 0 3px rgba(14,130,193,0.1);
}

.lp-input-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #8faab8;
    font-size: 0.85rem;
    pointer-events: none;
    transition: color 0.2s;
}

.lp-input:focus ~ .lp-input-icon { color: #0e82c1; }

/* Toggle de contraseña */
.lp-pwd-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #8faab8;
    font-size: 0.85rem;
    padding: 4px;
    border-radius: 6px;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lp-pwd-toggle:hover { color: #0e82c1; }

/* Error */
.lp-error {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fee2e2;
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #991b1b;
    margin-bottom: 16px;
    animation: lpErrorIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
}

@keyframes lpErrorIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}

.lp-error i { font-size: 0.9rem; flex-shrink: 0; }

/* Botón de submit */
.lp-submit-btn {
    width: 100%;
    padding: 13px;
    background: #0e82c1;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 14px rgba(14,130,193,0.3);
    letter-spacing: 0.02em;
    margin-top: 4px;
}

.lp-submit-btn:hover:not(:disabled) {
    background: #064b70;
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(14,130,193,0.38);
}

.lp-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* Divider */
.lp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0 16px;
    font-size: 0.72rem;
    font-weight: 600;
    color: #8faab8;
}

.lp-divider::before,
.lp-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #d4e6f1;
}

/* Link de registro */
.lp-register-link {
    display: block;
    text-align: center;
    font-size: 0.84rem;
    color: #4a6278;
}

.lp-register-link a {
    color: #0e82c1;
    font-weight: 700;
    text-decoration: none;
    transition: color 0.2s;
}

.lp-register-link a:hover { color: #064b70; text-decoration: underline; }

/* Info de seguridad */
.lp-security-note {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    font-size: 0.72rem;
    color: #8faab8;
    margin-top: 20px;
}

.lp-security-note i { color: #0e82c1; font-size: 0.75rem; }

/* ── RESPONSIVE ── */
@media (max-width: 860px) {
    .lp-shell { grid-template-columns: 1fr; }
    .lp-left  { display: none; }
    .lp-right { padding: 36px 24px; justify-content: flex-start; min-height: 100vh; }
    .lp-mobile-logo { display: flex; }
    .lp-form-wrap { max-width: 100%; }
    .lp-form-card { padding: 24px 20px; }
}

@media (max-width: 420px) {
    .lp-right { padding: 28px 16px; }
    .lp-form-title { font-size: 1.55rem; }
}
`;

/* ── Componente principal ── */
const Login = () => {
    const [id,       setId]       = useState('');
    const [password, setPassword] = useState('');
    const [showPwd,  setShowPwd]  = useState(false);
    const [loading,  setLoading]  = useState(false);
    const { user, login, error }  = useAuth();

    if (user) return <Navigate to="/dashboard" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await login(id, password);
        setLoading(false);
    };

    const features = [
        {
            icon: 'fas fa-graduation-cap',
            title: 'Seguimiento académico',
            sub:   'Progreso por módulo en tiempo real',
        },
        {
            icon: 'fas fa-award',
            title: 'Certificados digitales',
            sub:   'Descarga y comparte tus logros',
        },
        {
            icon: 'fas fa-clipboard-list',
            title: 'Evaluaciones de módulo',
            sub:   'Formularios de cierre obligatorios',
        },
        {
            icon: 'fas fa-calendar-alt',
            title: 'Agenda de sesiones',
            sub:   'Calendario de clases actualizado',
        },
    ];

    return (
        <>
            <style>{styles}</style>

            <div className="lp-shell">

                {/* ── PANEL IZQUIERDO ── */}
                <div className="lp-left">
                    <div className="lp-shape-1" />
                    <div className="lp-shape-2" />
                    <div className="lp-shape-3" />

                    <div className="lp-left-inner">
                        {/* Logo */}
                        <div className="lp-logo-wrap">
                            <img
                                src="/Capex.jpg"
                                alt="CAPEX"
                                className="lp-logo-img"
                                onError={e => { e.target.style.display = 'none'; }}
                            />
                        </div>

                        <h2 className="lp-left-title">
                            Tu plataforma de<br />aprendizaje ejecutivo
                        </h2>
                        <p className="lp-left-sub">
                            Accede a tus programas, certificados y seguimiento académico en un solo lugar.
                        </p>

                        <div className="lp-features">
                            {features.map((f, i) => (
                                <div className="lp-feature" key={i}>
                                    <div className="lp-feature-icon">
                                        <i className={f.icon} />
                                    </div>
                                    <div className="lp-feature-text">
                                        <strong>{f.title}</strong>
                                        <span>{f.sub}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lp-left-footer">
                        © {new Date().getFullYear()} CAPEX · Centro de Innovación y Educación
                    </div>
                </div>

                {/* ── PANEL DERECHO ── */}
                <div className="lp-right">

                    {/* Logo móvil */}
                    <div className="lp-mobile-logo">
                        <img src="/Capex.jpg" alt="CAPEX" />
                    </div>

                    <div className="lp-form-wrap">

                        {/* Cabecera */}
                        <div className="lp-form-header">
                            <Link to="/" className="lp-back-link">
                                <i className="fas fa-arrow-left" />
                                Volver al inicio
                            </Link>
                            <div className="lp-form-eyebrow">
                                <i className="fas fa-lock" />
                                Portal del Participante
                            </div>
                            <h1 className="lp-form-title">Bienvenido de vuelta</h1>
                            <p className="lp-form-subtitle">
                                Inicia sesión con tu cédula o correo institucional para acceder a tus programas.
                            </p>
                        </div>

                        {/* Card del formulario */}
                        <div className="lp-form-card">

                            {/* Error */}
                            {error && (
                                <div className="lp-error">
                                    <i className="fas fa-exclamation-circle" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Campo ID/Correo */}
                                <div className="lp-field">
                                    <label className="lp-label" htmlFor="lp-id">
                                        <i className="fas fa-user" />
                                        Identificación o correo
                                    </label>
                                    <div className="lp-input-wrap">
                                        <input
                                            id="lp-id"
                                            className="lp-input"
                                            type="text"
                                            placeholder="001-0000000-0 o correo@ejemplo.com"
                                            value={id}
                                            onChange={e => setId(e.target.value)}
                                            autoFocus
                                            required
                                            autoComplete="username"
                                        />
                                        <i className="fas fa-id-card lp-input-icon" />
                                    </div>
                                </div>

                                {/* Campo Contraseña */}
                                <div className="lp-field">
                                    <label className="lp-label" htmlFor="lp-pwd">
                                        <i className="fas fa-lock" />
                                        Contraseña
                                    </label>
                                    <div className="lp-input-wrap">
                                        <input
                                            id="lp-pwd"
                                            className="lp-input"
                                            type={showPwd ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            autoComplete="current-password"
                                            style={{ paddingRight: 42 }}
                                        />
                                        <button
                                            type="button"
                                            className="lp-pwd-toggle"
                                            onClick={() => setShowPwd(v => !v)}
                                            aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        >
                                            <i className={showPwd ? 'fas fa-eye-slash' : 'fas fa-eye'} />
                                        </button>
                                    </div>
                                </div>

                                {/* Botón */}
                                <button
                                    type="submit"
                                    className="lp-submit-btn"
                                    disabled={loading || !id || !password}
                                >
                                    {loading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin" />
                                            Verificando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-sign-in-alt" />
                                            Iniciar sesión
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Divider + registro */}
                        <div className="lp-divider">¿No tienes cuenta?</div>
                        <div className="lp-register-link">
                            <Link to="/register">
                                Solicita acceso al portal aquí →
                            </Link>
                        </div>

                        {/* Nota de seguridad */}
                        <div className="lp-security-note">
                            <i className="fas fa-shield-alt" />
                            Conexión segura · Tus datos están protegidos
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Login;