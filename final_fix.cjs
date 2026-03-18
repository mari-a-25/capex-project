require('dotenv').config();
const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;
const TABLE_NAME = 'PARTICIPANTES';

async function run() {
    try {
        console.log("Obteniendo Tabla...");
        const metaRes = await axios.get(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
            headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` }
        });
        const table = metaRes.data.tables.find(t => t.name === TABLE_NAME);
        const TABLE_ID = table.id;

        console.log("Creando 'Corr_ID' (Autonumber)...");
        try {
            const res = await axios.post(
                `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`,
                { name: 'Corr_ID', type: 'autoNumber' },
                { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' } }
            );
            console.log("¡Corr_ID creado!", res.data.id);
        } catch (e) {
            console.log("Error creando Corr_ID:", e.response?.data);
            return;
        }

        await new Promise(r => setTimeout(r, 2000));

        console.log("Actualizando ID_participante (Primary) a Fórmula...");
        // Re-get meta to ensure we have the primary field and new field
        const metaRes2 = await axios.get(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
            headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` }
        });
        const table2 = metaRes2.data.tables.find(t => t.name === TABLE_NAME);
        const primaryFieldId = table2.primaryFieldId;

        try {
            const res = await axios.patch(
                `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields/${primaryFieldId}`,
                {
                    name: "ID_Matricula",
                    type: "formula",
                    options: {
                        formula: "\"CPX-\" & DATETIME_FORMAT({Fecha_registro}, 'YYYY') & \"-\" & REPT(\"0\", 4 - LEN({Corr_ID} & \"\")) & {Corr_ID}"
                    }
                },
                { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' } }
            );
            console.log("¡Campo primario actualizado a fórmula!");
        } catch (e) {
            console.log("Error actualizando a fórmula:", e.response?.data);
        }

    } catch (e) {
        console.error(e);
    }
}
run();
