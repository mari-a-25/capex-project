const axios = require('axios');

require('dotenv').config();

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || process.env.VITE_AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID || process.env.VITE_BASE_ID;

if (!AIRTABLE_PAT || !BASE_ID) {
    throw new Error('Missing AIRTABLE_PAT/BASE_ID env vars. Add them to your .env file.');
}
const TABLE_NAME = 'PARTICIPANTES';

async function updateIdField() {
    try {
        console.log("Obteniendo esquemas de Airtable...");
        const metaRes = await axios.get(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
            headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` }
        });

        const tables = metaRes.data.tables;
        const targetTable = tables.find(t => t.name === TABLE_NAME);
        const TABLE_ID = targetTable.id;

        // Ensure "Num_Correlativo" exist.
        let numField = targetTable.fields.find(f => f.name === 'Num_Correlativo');
        if (!numField) {
            try {
                const res = await axios.post(
                    `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`,
                    { name: 'Num_Correlativo', type: 'autoNumber' },
                    { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' } }
                );
                numField = res.data;
                console.log("✓ Campo Num_Correlativo creado.");
            } catch (e) {
                console.log("No se pudo crear Num_Correlativo:", e.response ? e.response.data : e.message);
            }
        }

        // Search for primary field to change it to formula
        const idField = targetTable.fields.find(f => f.name === 'ID_participante');
        if (idField) {
            console.log("Cambiando ID_participante a Formula...");
            await axios.patch(
                `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields/${idField.id}`,
                {
                    name: "Matricula",
                    type: "formula",
                    options: {
                        // Formula: "CPX-" & YEAR(CREATED_TIME()) & "-" & REPT("0", 4 - LEN({Num_Correlativo}&"")) & {Num_Correlativo}
                        formula: "\"CPX-\" & DATETIME_FORMAT(CREATED_TIME(), 'YYYY') & \"-\" & REPT(\"0\", 4 - LEN({Num_Correlativo} & \"\")) & {Num_Correlativo}"
                    }
                },
                { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' } }
            );
            console.log("✓ ID_participante convertido a Matricula (formula).");
        }

    } catch (e) {
        console.error("Error General:", e.response ? JSON.stringify(e.response.data) : e.message);
    }
}
updateIdField();
