require('dotenv').config();
const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;
const TABLE_NAME = 'METRICAS';

const axiosInstance = axios.create({
    baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
    headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
    }
});

async function ensureTable() {
    try {
        await axiosInstance.get(`/${TABLE_NAME}?maxRecords=1`);
        return true;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            console.log(`La tabla '${TABLE_NAME}' no existe. Créala manualmente en Airtable antes de correr este script.`);
            return false;
        }
        console.error('Error al comprobar tabla METRICAS:', err.message || err);
        return false;
    }
}

async function addMetrics() {
    if (!(await ensureTable())) return;

    const metrics = [
        { Nombre: 'Provincias con capacitaciones', Valor: 12, Tipo: 'contador' },
        { Nombre: 'Personas capacitadas', Valor: 8540, Tipo: 'contador' },
        { Nombre: 'Estudiantes activos', Valor: 2300, Tipo: 'contador' },
        { Nombre: 'Satisfacción (%)', Valor: 95, Tipo: 'porcentaje' }
    ];

    try {
        const response = await axiosInstance.post(`/${TABLE_NAME}`, {
            records: metrics.map(m => ({ fields: m }))
        });
        console.log(`✅ ${response.data.records.length} métricas agregadas.`);
    } catch (err) {
        console.error('Error agregando métricas:', err.response?.data || err.message);
    }
}

addMetrics();
