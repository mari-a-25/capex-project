import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './DetalleCurso.css';

export default function DetalleCurso() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="detalle-curso-page">
            <button className="btn btn-secondary mb-4" onClick={() => navigate('/mis-cursos')}>
                &larr; Volver a Mis Cursos
            </button>
            
            <div className="detalle-header">
                <h2>Detalle del Diplomado {id}</h2>
                <div className="progress-bar-general">
                    <div className="fill" style={{ width: '40%' }}></div>
                </div>
                <span>Progreso: 40%</span>
            </div>

            <div className="modulos-lista">
                {/* Estructura placeholder de módulos */}
                <div className="modulo-card">
                    <h4>Módulo 1: Introducción</h4>
                    <span className="badge badge-success">Completado ✅</span>
                    <button 
                        className="btn btn-outline" 
                        style={{ marginTop: 16 }}
                        onClick={() => navigate(`/mis-cursos/detalle/${id}/formulario/1`)}
                    >
                        Completar Formulario de Cierre
                    </button>
                </div>
            </div>
        </div>
    );
}
