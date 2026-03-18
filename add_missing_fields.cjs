require('dotenv').config();

const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;
const TABLE_NAME = 'PARTICIPANTES';

async function addMissingFields() {
    try {
        console.log("Obteniendo ID de la tabla...");
        const metaRes = await axios.get(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
            headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` }
        });
        const table = metaRes.data.tables.find(t => t.name === TABLE_NAME);
        const TABLE_ID = table.id;
        const existingFieldNames = table.fields.map(f => f.name);

        const fieldsToCreate = [
            { name: 'Teléfono', type: 'phoneNumber' },
            { name: 'Empresa_actual', type: 'singleLineText' },
            { name: 'Puesto_trabajo', type: 'singleLineText' },
            { name: 'Motivo_acceso', type: 'multilineText' },
            { name: 'Referencia', type: 'singleLineText' }
        ];

        for (const field of fieldsToCreate) {
            if (!existingFieldNames.includes(field.name)) {
                console.log(`Creando campo: ${field.name}...`);
                await axios.post(
                    `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`,
                    field,
                    { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' } }
                );
                console.log(`✓ ${field.name} creado.`);
            } else {
                console.log(`El campo ${field.name} ya existe.`);
            }
        }

        console.log("¡Todos los campos necesarios están listos!");

    } catch (e) {
        console.error("Error al crear campos:", e.response ? e.response.data : e.message);
    }
}

addMissingFields();
