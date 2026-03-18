const axios = require('axios');

require('dotenv').config();

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || process.env.VITE_AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID || process.env.VITE_BASE_ID;

if (!AIRTABLE_PAT || !BASE_ID) {
    throw new Error('Missing AIRTABLE_PAT/BASE_ID env vars. Add them to your .env file.');
}
const TABLE_NAME = 'PARTICIPANTES';

async function run() {
    try {
        const metaRes = await axios.get(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
            headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` }
        });
        const table = metaRes.data.tables.find(t => t.name === TABLE_NAME);
        const TABLE_ID = table.id;
        const primaryFieldId = table.primaryFieldId;

        // 1. Create Internal Field
        let internalFieldId;
        try {
            const res = await axios.post(
                `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`,
                { name: 'Internal_Seq', type: 'autoNumber' },
                { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' } }
            );
            internalFieldId = res.data.id;
            console.log("Internal_Seq creado.");
        } catch (e) {
            console.log("Internal_Seq ya existe o falló.");
            const existing = table.fields.find(f => f.name === 'Internal_Seq');
            if (existing) internalFieldId = existing.id;
        }

        if (!internalFieldId) return;

        // 2. Update Primary Field to Formula
        console.log("Actualizando campo primario...");
        try {
            await axios.patch(
                `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields/${primaryFieldId}`,
                {
                    name: "ID_Participante",
                    type: "formula",
                    options: {
                        formula: "CONCATENATE('CPX-', {Internal_Seq})"
                    }
                },
                { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' } }
            );
            console.log("Éxito!");
        } catch (e) {
            console.error("Fallo:", JSON.stringify(e.response?.data));
        }

    } catch (e) {
        console.error(e);
    }
}
run();
