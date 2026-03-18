import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Building, Briefcase, Save } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        Teléfono: user?.Teléfono || '',
        Correo_secundario: user?.Correo_secundario || '',
        Dirección: user?.Dirección || '',
        Empresa_actual: user?.Empresa_actual || '',
        Posición: user?.Posición || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.updateParticipant(user.recordId, formData);
            alert('SISTEMA: Los datos se han actualizado correctamente en Airtable.');
        } catch (err) {
            alert('ERROR DE SISTEMA: No se pudo actualizar el registro.');
        }
    };

    return (
        <div className="profile-modern">
            <div className="page-header-modern">
                <div>
                    <h2>Mi Perfil</h2>
                    <p>Gestiona tu información personal y profesional.</p>
                </div>
            </div>

            <div className="profile-content-modern">
                <div className="glass-card profile-info-card">
                    <div className="profile-header-summary">
                        <div className="profile-avatar-large">
                            {user?.Nombre?.[0]}{user?.Apellido?.[0]}
                        </div>
                        <div className="profile-name-block">
                            <h3>{user?.Nombre} {user?.Apellido}</h3>
                            <p className="profile-meta"><MapPin size={14} /> {user?.Nacionalidad || 'República Dominicana'}</p>
                            <span className="id-badge">ID: {user?.Cédula_pasaporte}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="modern-form profile-form">
                        <div className="form-grid-modern">
                            <div className="form-group-modern">
                                <label><Mail size={16} /> Correo Principal (Solo Lectura)</label>
                                <input type="text" value={user?.Correo} disabled className="input-locked" />
                            </div>

                            <div className="form-group-modern">
                                <label><Phone size={16} /> Teléfono Móvil</label>
                                <input
                                    type="text"
                                    name="Teléfono"
                                    value={formData.Teléfono}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group-modern">
                                <label><Building size={16} /> Empresa Actual</label>
                                <input
                                    type="text"
                                    name="Empresa_actual"
                                    value={formData.Empresa_actual}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group-modern">
                                <label><Briefcase size={16} /> Cargo / Posición</label>
                                <input
                                    type="text"
                                    name="Posición"
                                    value={formData.Posición}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group-modern full-width">
                                <label><MapPin size={16} /> Dirección Completa</label>
                                <input
                                    type="text"
                                    name="Dirección"
                                    value={formData.Dirección}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-actions-modern">
                            <button type="submit" className="btn btn-primary">
                                <Save size={18} />
                                <span>Actualizar Información</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .profile-modern {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    max-width: 900px;
                    margin: 0 auto;
                }
                .profile-header-summary {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    margin-bottom: 2.5rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid var(--border);
                }
                .profile-avatar-large {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: 800;
                    box-shadow: 0 8px 16px rgba(0,51,153,0.2);
                }
                .profile-name-block h3 {
                    font-size: 1.75rem;
                    color: var(--text-main);
                    margin-bottom: 0.25rem;
                }
                .profile-meta {
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }
                .id-badge {
                    display: inline-block;
                    background: var(--accent);
                    color: var(--primary);
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                .form-grid-modern {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .full-width { grid-column: span 2; }
                .input-locked { 
                    background-color: var(--bg-main) !important; 
                    color: var(--text-muted) !important; 
                    cursor: not-allowed; 
                    border-style: dashed !important;
                }
                .form-actions-modern { 
                    margin-top: 2rem; 
                    display: flex; 
                    justify-content: flex-end; 
                }
                @media (max-width: 600px) {
                    .form-grid-modern { grid-template-columns: 1fr; }
                    .full-width { grid-column: span 1; }
                    .profile-header-summary { flex-direction: column; text-align: center; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
