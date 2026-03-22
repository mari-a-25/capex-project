import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAirtableData } from '../services/useAirtableData';

const SolicitudForm = () => {
    const { getCurso, submitSolicitud } = useAirtableData();
    const [params] = useSearchParams();
    const cursoId = params.get('cursoId');
    const preEmail = params.get('email') || '';
    const [course, setCourse] = useState(null);

    const [formData, setFormData] = useState({
        Nombre: '',
        Apellido: '',
        Correo: preEmail,
        Cédula_pasaporte: '',
        Teléfono: '',
        Empresa_Nombre: '',
        Puesto_trabajo: '',
        Motivo_acceso: '',
        Referencia: '',
        Contraseña: '',
        Curso: cursoId || '',
        PaymentID: '',
        Estado: 'Pendiente'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cursoId) {
            getCurso(cursoId).then(res => {
                setCourse(res.fields);
            }).catch(console.error);
        }
    }, [cursoId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await submitSolicitud(formData);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Error al enviar la solicitud. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-window-container">
            <div className="login-box registration-robust">
                <div className="login-header-modern">
                    <div className="branding-section">
                        <h2 className="brand-navy">CAPEX</h2>
                        <p className="sub-brand">Registro de Participante</p>
                    </div>
                    <h3>Complete su información</h3>
                    {course && <p className="login-subtitle">Curso: {course.Titulo || course.Name || ''}</p>}
                    <p className="login-subtitle">Le hemos enviado un enlace a su correo para completar este formulario.</p>
                </div>

                <div className="login-body-modern">
                    {success ? (
                        <div className="success-state-modern" style={{ textAlign: 'center', padding: '2rem' }}>
                            <h3>Solicitud recibida</h3>
                            <p>Gracias por rellenar el formulario. En cuanto aprobemos sus datos recibirá sus credenciales por correo.</p>
                            <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
                                Volver al inicio
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
                                    <label>Contraseña deseada</label>
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
                                    {loading ? 'Enviando…' : 'Enviar formulario'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SolicitudForm;
