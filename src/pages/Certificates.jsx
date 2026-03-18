import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/airtable';
import {
    Award,
    Download,
    FileText,
    Search,
    AlertCircle,
    ExternalLink
} from 'lucide-react';
import './Certificates.css';

const CertificateRow = ({ cert }) => {
    const fields = cert.fields;

    return (
        <div className="cert-row card">
            <div className="cert-info">
                <div className="cert-icon-box">
                    <Award size={24} className="cert-icon" />
                </div>
                <div className="cert-text">
                    <h4>{fields['Nombre_programa'] || 'Diplomado CAPEX'}</h4>
                    <p className="cert-meta">
                        Emitido el: {fields['Fecha_emisión'] || 'TBD'} • Código: <code>{fields['ID_certificado'] || 'CPX-XXXX'}</code>
                    </p>
                </div>
            </div>

            <div className="cert-actions">
                {fields['URL_documento'] ? (
                    <a href={fields['URL_documento']} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                        <Download size={18} />
                        <span>Descargar PDF</span>
                    </a>
                ) : (
                    <button className="btn btn-secondary btn-sm" disabled>
                        <AlertCircle size={18} />
                        <span>Pendiente</span>
                    </button>
                )}
            </div>
        </div>
    );
};

const Certificates = () => {
    const { user } = useAuth();
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCerts = async () => {
            if (user?.recordId) {
                try {
                    const data = await api.getCertificates(user.recordId);
                    setCerts(data);
                } catch (error) {
                    console.error('Error fetching certificates:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchCerts();
    }, [user]);

    const filteredCerts = certs.filter(cert =>
        (cert.fields['Nombre_programa'] || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-state">BUSCANDO REGISTROS EN LA BASE DE DATOS...</div>;

    return (
        <div className="certificates-modern">
            <div className="page-header-modern">
                <div>
                    <h2>Mis Certificados</h2>
                    <p>Bóveda digital de tus logros académicos.</p>
                </div>
                <div className="search-box-modern">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar certificado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="cert-grid-modern">
                {filteredCerts.length > 0 ? (
                    filteredCerts.map(cert => (
                        <CertificateRow key={cert.id} cert={cert} />
                    ))
                ) : (
                    <div className="glass-card empty-state-modern cert-empty">
                        <FileText size={48} className="empty-icon" />
                        <h4>Sin resultados</h4>
                        <p>No se encontraron certificados con los criterios de búsqueda.</p>
                    </div>
                )}
            </div>

            <div className="info-footer-modern">
                <AlertCircle size={16} />
                <span><strong>Nota Educativa:</strong> Los certificados se generan automáticamente al cumplir con el 80% de asistencia en el programa.</span>
            </div>
        </div>
    );
};

export default Certificates;
