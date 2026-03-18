import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/airtable';
import './Surveys.css';

const Surveys = () => {
    const { user } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        NPS: 10,
        Amabilidad: 10,
        Contenido: 10,
        Satisfaccion: 'Si',
        Comentarios: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.submitSurvey({
                Participante: [user.recordId],
                ...formData
            });
            setSubmitted(true);
        } catch (err) {
            alert('ERROR: No se pudo enviar la encuesta. Verifique que la tabla ENCUESTAS exista.');
        }
    };

    if (submitted) {
        return (
            <div className="glass-card modern-confirm">
                <div className="confirm-icon-wrapper">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>
                <h3>¡Gracias por tus comentarios!</h3>
                <p>Tu opinión es vital para mantener la excelencia académica en CAPEX.</p>
                <button className="btn btn-outline" onClick={() => setSubmitted(false)}>Enviar otra evaluación</button>
            </div>
        );
    }

    return (
        <div className="surveys-modern">
            <div className="page-header-modern">
                <div>
                    <h2>Evaluación de Programas</h2>
                    <p>Ayúdanos a mejorar continuamente nuestra oferta educativa.</p>
                </div>
            </div>

            <div className="glass-card survey-card-modern">
                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-group-modern">
                        <label>¿Qué tan probable es que regreses a realizar otro curso con nosotros? (1-10)</label>
                        <input type="range" min="1" max="10" name="NPS" value={formData.NPS} onChange={handleChange} className="modern-range" />
                        <span className="range-display">{formData.NPS} / 10</span>
                    </div>

                    <div className="form-row-modern">
                        <div className="form-group-modern half">
                            <label>Calidad del facilitador (1-10)</label>
                            <input type="number" min="1" max="10" name="Amabilidad" value={formData.Amabilidad} onChange={handleChange} />
                        </div>

                        <div className="form-group-modern half">
                            <label>Relevancia del contenido (1-10)</label>
                            <input type="number" min="1" max="10" name="Contenido" value={formData.Contenido} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group-modern">
                        <label>¿Cumplió el programa con tus expectativas?</label>
                        <select name="Satisfaccion" value={formData.Satisfaccion} onChange={handleChange}>
                            <option value="Si">Sí, totalmente</option>
                            <option value="No">No realmente</option>
                            <option value="Parcial">Parcialmente</option>
                        </select>
                    </div>

                    <div className="form-group-modern">
                        <label>Comentarios adicionales (Opcional):</label>
                        <textarea name="Comentarios" value={formData.Comentarios} onChange={handleChange} rows="4" placeholder="Compártenos tu experiencia..."></textarea>
                    </div>

                    <div className="form-actions-modern">
                        <button type="submit" className="btn btn-primary">Enviar Evaluación</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Surveys;
