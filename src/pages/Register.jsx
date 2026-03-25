import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAirtableData } from '../services/useAirtableData';
import { ShieldCheck } from 'lucide-react';
import Footer from '../components/Footer';

const Register = () => {
    const { registerParticipant } = useAirtableData();
    const [formData, setFormData] = useState({
        Nombre: '',
        Apellido: '',
        Cédula_pasaporte: '',
        Correo: '',
        Teléfono: '',
        Empresa_Nombre: '',
        Puesto_trabajo: '',
        Motivo_acceso: '',
        Referencia: '',
        Contraseña: '',
        Acceso_Portal: 'Pendiente'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await registerParticipant(formData);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Error al registrar. Verifica que los campos sean correctos y que la tabla PARTICIPANTES en Airtable esté configurada.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-with-site-footer">
        <div className="login-window-container">
            <div className="login-box registration-robust">
                <div className="login-header-modern">
                    <div className="branding-section">
                        <h2 className="brand-navy">CAPEX</h2>
                        <p className="sub-brand">Gestión de Acceso Institucional</p>
                    </div>
                    <h3>Petición de Acceso</h3>
                    <p className="login-subtitle">Completa el formulario para solicitar tus credenciales corporativas.</p>
                </div>

                <div className="login-body-modern">
                    {success ? (
                        <div className="success-state-modern" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className="icon-circle" style={{ margin: '0 auto 1.5rem', background: '#ecfdf5', color: '#10b981', width: '80px', height: '80px' }}>
                                <ShieldCheck size={40} />
                            </div>
                            <h3 style={{ color: '#065f46', marginBottom: '1rem', fontSize: '1.5rem' }}>Solicitud Enviada</h3>
                            <p style={{ color: '#047857', fontSize: '1rem', lineHeight: '1.6' }}>
                                Tu petición ha sido registrada correctamente. Nuestro equipo académico revisará tu perfil y recibirás una notificación por correo una vez aprobado tu acceso.
                            </p>
                            <Link to="/login" className="btn btn-primary" style={{ marginTop: '2.5rem', width: '100%' }}>
                                Volver al Inicio
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="scrollable-form">
                                <div className="form-row">
                                    <div className="form-group-modern half">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            name="Nombre"
                                            placeholder="Tu nombre"
                                            value={formData.Nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group-modern half">
                                        <label>Apellido</label>
                                        <input
                                            type="text"
                                            name="Apellido"
                                            placeholder="Tu apellido"
                                            value={formData.Apellido}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group-modern half">
                                        <label>Cédula / Pasaporte</label>
                                        <input
                                            type="text"
                                            name="Cédula_pasaporte"
                                            placeholder="000-0000000-0"
                                            value={formData.Cédula_pasaporte}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group-modern half">
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            name="Teléfono"
                                            placeholder="809-000-0000"
                                            value={formData.Teléfono}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group-modern">
                                    <label>Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="Correo"
                                        placeholder="usuario@ejemplo.com"
                                        value={formData.Correo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group-modern half">
                                        <label>Empresa Actual</label>
                                        <input
                                            type="text"
                                            name="Empresa_Nombre"
                                            placeholder="Nombre de la empresa"
                                            value={formData.Empresa_Nombre}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group-modern half">
                                        <label>Puesto / Cargo</label>
                                        <input
                                            type="text"
                                            name="Puesto_trabajo"
                                            placeholder="Ej: Gerente"
                                            value={formData.Puesto_trabajo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group-modern">
                                    <label>Motivo de la Solicitud</label>
                                    <textarea
                                        name="Motivo_acceso"
                                        placeholder="Indica el curso o diplomado de tu interés..."
                                        rows="3"
                                        value={formData.Motivo_acceso}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group-modern">
                                    <label>Referencia (Opcional)</label>
                                    <input
                                        type="text"
                                        name="Referencia"
                                        placeholder="¿Quién te refirió a CAPEX?"
                                        value={formData.Referencia}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-modern">
                                    <label>Contraseña de Acceso</label>
                                    <input
                                        type="password"
                                        name="Contraseña"
                                        placeholder="Crea una clave segura"
                                        value={formData.Contraseña}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <p className="error-text-modern">{error}</p>}

                            <div className="login-btns-footer">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Procesando...' : 'Enviar Solicitud de Acceso'}
                                </button>
                            </div>
                            <div className="login-back-link" style={{ marginTop: '2rem' }}>
                                <Link to="/login" style={{ fontWeight: '700', color: 'var(--primary)' }}>¿Ya tienes cuenta? Inicia sesión aquí</Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
        <Footer />
        </div>
    );
};

export default Register;
