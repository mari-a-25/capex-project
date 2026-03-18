import axios from 'axios';

const AIRTABLE_PAT = import.meta.env.VITE_AIRTABLE_PAT;
const BASE_ID = import.meta.env.VITE_BASE_ID;

if (!AIRTABLE_PAT || !BASE_ID) {
    throw new Error(
        'Missing Airtable env vars. Set VITE_AIRTABLE_PAT and VITE_BASE_ID in your .env file.'
    );
}

const airtable = axios.create({
    baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
    headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
    },
});

// metadata client (same PAT) for table creation
const airtableMeta = axios.create({
    baseURL: `https://api.airtable.com/v0/meta/bases/${BASE_ID}`,
    headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
    },
});

// create METRICAS table with minimal fields if possible
async function ensureMetricsTable() {
    try {
        // try read first record
        await airtable.get('/METRICAS?maxRecords=1');
        return;
    } catch (err) {
        if (err.response && [403,404].includes(err.response.status)) {
            console.warn('Attempting to create METRICAS table via metadata API');
            try {
                await airtableMeta.post('/tables', {
                    name: 'METRICAS',
                    fields: [
                        { name: 'Nombre', type: 'singleLineText' },
                        { name: 'Valor', type: 'number' },
                        { name: 'Tipo', type: 'singleSelect', options: { choices: [{ name: 'contador' }, { name: 'porcentaje' }] } }
                    ]
                });
                console.log('METRICAS table created successfully');
            } catch (metaErr) {
                console.warn('Could not create METRICAS table:', metaErr.response?.data?.error?.message || metaErr.message);
            }
        }
    }
}

export const api = {
    // Search for participant by custom ID or Email
    loginParticipant: async (identifier, password) => {
        let formula = `OR({Correo} = '${identifier}', {Cédula_pasaporte} = '${identifier}')`;
        if (password) {
            formula = `AND(OR({Correo} = '${identifier}', {Cédula_pasaporte} = '${identifier}'), {Contraseña} = '${password}')`;
        }
        const response = await airtable.get('/PARTICIPANTES', {
            params: { filterByFormula: formula, maxRecords: 1 },
        });
        return response.data.records[0];
    },

    registerParticipant: async (data) => {
        const response = await airtable.post('/PARTICIPANTES', {
            records: [{ fields: data }]
        });
        return response.data.records[0];
    },

    getParticipant: async (recordId) => {
        const response = await airtable.get(`/PARTICIPANTES/${recordId}`);
        return response.data;
    },

    updateParticipant: async (recordId, data) => {
        const response = await airtable.patch(`/PARTICIPANTES/${recordId}`, {
            fields: data
        });
        return response.data;
    },

    // Cursos methods
    getCursos: async () => {
        const response = await airtable.get('/CURSOS');
        return response.data.records;
    },
    // Obtener un curso por ID
    getCurso: async (recordId) => {
        const response = await airtable.get(`/CURSOS/${recordId}`);
        return response.data;
    },
    // Registrar matrícula (inscripción)
    registerEnrollment: async (data) => {
        const response = await airtable.post('/MATRÍCULAS', {
            records: [{ fields: data }]
        });
        return response.data.records[0];
    },

    addCurso: async (data) => {
        // data may include Titulo, Descripcion, Imagen, Duracion, Nivel,
        // Instructor, Costo, Horario, Cupos, Rating, Estudiantes, etc.
        const response = await airtable.post('/CURSOS', {
            records: [{ fields: data }]
        });
        return response.data.records[0];
    },

    updateCurso: async (recordId, data) => {
        // same field set as addCurso
        const response = await airtable.patch(`/CURSOS/${recordId}`, {
            fields: data
        });
        return response.data;
    },

    // NOTE: we keep the endpoint available for admins but the public UI
    // does not expose any delete controls. Courses should not be removable
    // from the client portal to ensure consistency for regular users.
    deleteCurso: async (recordId) => {
        const response = await airtable.delete(`/CURSOS/${recordId}`);
        return response.data;
    },

    // Enrollments
    getEnrollments: async (participantRecordId) => {
        const formula = `SEARCH('${participantRecordId}', {Participante})`;
        const response = await airtable.get('/MATRÍCULAS', {
            params: { filterByFormula: formula },
        });
        return response.data.records;
    },

    // Certificates
    getCertificates: async (participantRecordId) => {
        const formula = `SEARCH('${participantRecordId}', {Participante})`;
        const response = await airtable.get('/CERTIFICADOS', {
            params: { filterByFormula: formula },
        });
        return response.data.records;
    },

    // Surveys
    submitSurvey: async (data) => {
        const response = await airtable.post('/ENCUESTAS', {
            fields: data
        });
        return response.data;
    },

    // Metrics / OKRs
    getMetrics: async () => {
        // guarantee table exists (or at least attempt creation)
        await ensureMetricsTable();
        try {
            const response = await airtable.get('/METRICAS');
            return response.data.records;
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    console.warn('Tabla METRICAS no encontrada; devuelve arreglo vacío.');
                    return [];
                }
                if (err.response.status === 403) {
                    console.warn('Acceso denegado a METRICAS (403). Puede que tu PAT no tenga permisos o la tabla está oculta.');
                    // provide fallback sample metrics so UI no quede vacío
                    // return a single informative metric so the section renders
                return [
                    { id: 'demo1', fields: { Nombre: '⚠️ Permisos insuficientes', Valor: 1, Tipo: 'contador' } }
                ];
                }
            }
            throw err;
        }
    },

    /* ======== new tables ======== */
    // registration requests (post‑payment detail form)
    submitSolicitud: async (data) => {
        const response = await airtable.post('/SOLICITUDES', {
            records: [{ fields: data }]
        });
        return response.data.records[0];
    },
    getSolicitudes: async () => {
        const response = await airtable.get('/SOLICITUDES');
        return response.data.records;
    },
    approveSolicitud: async (recordId, participantData) => {
        // Optionally insert into PARTICIPANTES table after approval
        const resp1 = await airtable.post('/PARTICIPANTES', {
            records: [{ fields: participantData }]
        });
        // mark solicitud as aprobado
        await airtable.patch(`/SOLICITUDES/${recordId}`, { fields: { Estado: 'Aprobado' } });
        return resp1.data.records[0];
    },

    // simple email queuing so an Airtable automation can send it
    queueEmail: async (data) => {
        const response = await airtable.post('/EMAIL_QUEUE', {
            records: [{ fields: data }]
        });
        return response.data.records[0];
    }
};

export default airtable;
