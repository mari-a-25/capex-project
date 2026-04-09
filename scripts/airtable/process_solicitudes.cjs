const axios = require('axios');

require('dotenv').config();

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || process.env.VITE_AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID || process.env.VITE_BASE_ID;

if (!AIRTABLE_PAT || !BASE_ID) {
    throw new Error('Missing AIRTABLE_PAT/BASE_ID env vars. Add them to your .env file.');
}

const airtable = axios.create({
    baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
    headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
    }
});

async function fetchSolicitudes() {
    const res = await airtable.get('/SOLICITUDES', { params: { filterByFormula: "{Estado} = 'Pendiente'" } });
    return res.data.records;
}

async function createParticipante(fields) {
    const res = await airtable.post('/PARTICIPANTES', {
        records: [{ fields }]
    });
    return res.data.records[0];
}

async function markApproved(id) {
    await airtable.patch(`/SOLICITUDES/${id}`, { fields: { Estado: 'Aprobado' } });
}

async function main() {
    try {
        console.log('Recuperando solicitudes pendientes...');
        const solicitudes = await fetchSolicitudes();
        console.log(`Encontradas ${solicitudes.length} solicitudes.`);
        for (const s of solicitudes) {
            const f = s.fields;
            // map to PARTICIPANTES fields (you may need to adjust names)
            const participantData = {
                Nombre: f.Nombre,
                Apellido: f.Apellido,
                Correo: f.Correo,
                'Cédula_pasaporte': f['Cédula_pasaporte'],
                Teléfono: f.Teléfono,
                Empresa_Nombre: f.Empresa_Nombre,
                Puesto_trabajo: f.Puesto_trabajo,
                Contraseña: f.Contraseña,
                CursoSolicitado: f.Curso,
                Estado: 'Activo'
            };
            const newPart = await createParticipante(participantData);
            console.log(`✔ Participante creado: ${newPart.id} (${f.Correo})`);
            await markApproved(s.id);
        }
    } catch (err) {
        console.error('Error al procesar solicitudes:', err.response?.data || err.message);
    }
}

main();
