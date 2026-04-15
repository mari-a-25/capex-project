import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './FormularioCierre.css';

export default function FormularioCierre() {
    const { cursoId, moduloId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="form-cierre-page">
            <button className="btn btn-secondary mb-4" onClick={() => navigate(`/mis-cursos/detalle/${cursoId}`)}>
                &larr; Volver al Módulo
            </button>

            <div className="form-cierre-container">
                <h2>Formulario de Cierre de Módulo</h2>
                <p className="form-alert">🎓 Este formulario es requerido para acceder a tu certificado.</p>
                
                <form className="examen-form">
                    <div className="form-group">
                        <label>Calificación general del módulo (1-10)</label>
                        <input type="number" min="1" max="10" placeholder="10" />
                    </div>
                    <div className="form-group">
                        <label>Comentarios adicionales</label>
                        <textarea rows="4" placeholder="Escribe tus comentarios..."></textarea>
                    </div>
                    
                    <button type="button" className="btn btn-primary" onClick={() => alert('¡Enviado exitosamente!')}>
                        Enviar Evaluación
                    </button>
                </form>
            </div>
        </div>
    );
}
