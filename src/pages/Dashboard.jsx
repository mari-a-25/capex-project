import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAirtableData } from '../services/useAirtableData';
import {
    BookOpen,
    Calendar,
    Video,
    MessageCircle,
    ExternalLink,
    ChevronRight,
    Clock
} from 'lucide-react';
import './Dashboard.css';

const CourseCard = ({ enrollment }) => {
    const fields = enrollment.fields;
    const assistance = fields['%_asistencia'] || 0;

    return (
        <div className="card course-card">
            <div className="course-card-header">
                <span className="badge-modality">{fields['Modalidad'] || 'Presencial'}</span>
                <h3>{fields['Nombre_programa'] || 'Diplomado CAPEX'}</h3>
            </div>

            <div className="course-card-body">
                <div className="info-row">
                    <Calendar size={16} />
                    <span>Inicio: {fields['Fecha_inicio'] || 'TBD'}</span>
                </div>
                <div className="info-row">
                    <Clock size={16} />
                    <span>{fields['Horario'] || 'Horario Flexible'}</span>
                </div>

                <div className="progress-section">
                    <div className="progress-header">
                        <span>Asistencia</span>
                        <span>{Math.round(assistance * 100)}%</span>
                    </div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${assistance * 100}%` }}
                        ></div>
                    </div>
                    {assistance >= 0.8 && <span className="eligible-label">✓ Elegible para certificado</span>}
                </div>
            </div>

            <div className="course-card-actions">
                {fields['Zoom_Link'] && (
                    <a href={fields['Zoom_Link']} target="_blank" rel="noreferrer" className="action-link zoom">
                        <Video size={18} />
                        <span>Clase Virtual</span>
                    </a>
                )}
                {fields['WhatsApp_Group'] && (
                    <a href={fields['WhatsApp_Group']} target="_blank" rel="noreferrer" className="action-link wa">
                        <MessageCircle size={18} />
                        <span>WhatsApp</span>
                    </a>
                )}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const { getEnrollments } = useAirtableData();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (user?.recordId) {
                try {
                    const data = await getEnrollments(user.recordId);
                    setEnrollments(data);
                } catch (error) {
                    console.error('Error fetching enrollments:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchDashboardData();
    }, [user]);

    if (loading) return <div className="loading-state">PROCESANDO DATOS DEL SERVIDOR...</div>;

    return (
        <div className="dashboard-modern">
            <div className="welcome-banner">
                <div className="welcome-text">
                    <h2>Hola, {user?.Nombre || 'Participante'}</h2>
                    <p>Bienvenido de vuelta a tu portal de aprendizaje ejecutivo.</p>
                </div>
                <div className="welcome-stats">
                    <div className="stat-pill">
                        <span className="stat-value">{enrollments.length}</span>
                        <span className="stat-label">Cursos<br />Activos</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="main-feed">
                    <div className="section-header-modern">
                        <h3>Mis Programas en Curso</h3>
                    </div>

                    {enrollments.length > 0 ? (
                        <div className="course-grid-modern">
                            {enrollments.map(enr => (
                                <CourseCard key={enr.id} enrollment={enr} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-modern">
                            <BookOpen size={48} className="empty-icon" />
                            <h4>Sin programas registrados</h4>
                            <p>No se visualizan inscripciones activas en este perfil. Si consideras que esto es un error, contacta a soporte académico.</p>
                        </div>
                    )}
                </div>

                <div className="side-feed">
                    <div className="feed-card">
                        <h3>Centro de Notificaciones</h3>
                        <ul className="modern-list">
                            <li>
                                <div className="list-icon info"></div>
                                <div className="list-content">Inicio de Diplomado: Gestión Humana 4.0 - Lunes 15 de Abril</div>
                            </li>
                            <li>
                                <div className="list-icon pending"></div>
                                <div className="list-content">Encuesta de satisfacción pendiente del curso anterior.</div>
                            </li>
                            <li>
                                <div className="list-icon success"></div>
                                <div className="list-content">Tu certificado de "Liderazgo Efectivo" ya está disponible para descarga.</div>
                            </li>
                        </ul>
                    </div>

                    <div className="feed-card">
                        <h3>Soporte Académico</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            ¿Necesitas ayuda con tu plataforma o tienes dudas sobre tus cursos?
                        </p>
                        <a href="mailto:info@capex.edu.do" className="btn btn-primary" style={{ width: '100%' }}>
                            Contactar Soporte
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
