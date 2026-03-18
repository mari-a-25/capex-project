require('dotenv').config();
const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || process.env.VITE_AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID || process.env.VITE_BASE_ID;

if (!AIRTABLE_PAT || !BASE_ID) {
    throw new Error('Missing AIRTABLE_PAT/BASE_ID env vars. Add them to your .env file.');
}

const airtable = axios.create({
    baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
    headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
    },
});

// Helper to check if a field exists in the table schema
async function fieldExists(table, fieldName) {
    const response = await airtable.get(`/${table}/meta`);
    const fields = response.data.fields || [];
    return fields.some((f) => f.name === fieldName);
}

async function addField(table, field) {
    await airtable.patch(`/${table}`, { fields: [field] });
}

async function ensureCourseFields() {
    const table = 'CURSOS';
    const required = [
        { name: 'Imagen', type: 'attachment' },
        { name: 'Cupos', type: 'number' },
        { name: 'Precio', type: 'currency', options: { precision: 2, symbol: '$' } },
        { name: 'Descripción_larga', type: 'rich_text' },
    ];

    for (const field of required) {
        const exists = await fieldExists(table, field.name);
        if (!exists) {
            console.log(`Adding missing field ${field.name}`);
            await addField(table, field);
        }
    }
    console.log('All required fields are present in CURSOS table.');
}

ensureCourseFields().catch((e) => console.error('Error ensuring fields:', e));
