require('dotenv').config();
const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;

const airtableMeta = axios.create({
    baseURL: `https://api.airtable.com/v0/meta/bases/${BASE_ID}`,
    headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
    }
});

async function ensureFields(tableName, fieldsToAdd) {
    try {
        const listRes = await airtableMeta.get('/tables');
        const table = listRes.data.tables.find(t => t.name === tableName);
        if (!table) {
            console.log(`⚠️ Tabla '${tableName}' no existe. Debes crearla manualmente en Airtable antes de ejecutar este script.`);
            return;
        }
        const tableId = table.id;
        let created = 0;
        for (const field of fieldsToAdd) {
            try {
                await airtableMeta.post(`/tables/${tableId}/fields`, field);
                console.log(`✅ Campo '${field.name}' agregado a ${tableName}`);
                created++;
            } catch (err) {
                const msg = err.response?.data?.error?.message || err.message;
                if (err.response?.data?.error?.type === 'FIELD_NAME_CONFLICT') {
                    console.log(`⚠️  Campo '${field.name}' ya existe en ${tableName}`);
                } else {
                    console.log(`❌ Error en '${field.name}' de ${tableName}: ${msg}`);
                }
            }
        }
        console.log(`
✅ Proceso en ${tableName} completado. ${created} campos agregados.`);
    } catch (err) {
        console.error('Error al leer tablas:', err.message);
    }
}

async function run() {
    console.log('Inicializando tablas de registro y cola de correo...');

    await ensureFields('SOLICITUDES', [
        { name: 'Nombre', type: 'singleLineText' },
        { name: 'Apellido', type: 'singleLineText' },
        { name: 'Correo', type: 'email' },
        { name: 'Cédula_pasaporte', type: 'singleLineText' },
        { name: 'Teléfono', type: 'singleLineText' },
        { name: 'Empresa_Nombre', type: 'singleLineText' },
        { name: 'Puesto_trabajo', type: 'singleLineText' },
        { name: 'Motivo_acceso', type: 'multilineText' },
        { name: 'Referencia', type: 'singleLineText' },
        { name: 'Contraseña', type: 'singleLineText' },
        { name: 'Curso', type: 'singleLineText' },
        { name: 'PaymentID', type: 'singleLineText' },
        { name: 'Estado', type: 'singleSelect', options: { choices: [{ name: 'Pendiente' }, { name: 'Aprobado' }, { name: 'Rechazado' }] } },
    ]);

    await ensureFields('EMAIL_QUEUE', [
        { name: 'To', type: 'email' },
        { name: 'Subject', type: 'singleLineText' },
        { name: 'Body', type: 'multilineText' },
        { name: 'Sent', type: 'checkbox' }
    ]);

    // optional metrics/OKR table
    await ensureFields('METRICAS', [
        { name: 'Nombre', type: 'singleLineText' },
        { name: 'Valor', type: 'number' },
        { name: 'Tipo', type: 'singleSelect', options: { choices: [{ name: 'contador' }, { name: 'porcentaje' }] } }
    ]);
}

run();