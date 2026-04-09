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
        console.log("Obteniendo esquemas de Airtable...");
        const metaRes = await axios.get(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_PAT}`
            }
        });

        const tables = metaRes.data.tables;
        const targetTable = tables.find(t => t.name === TABLE_NAME);

        if (!targetTable) {
            console.error(`La tabla ${TABLE_NAME} no fue encontrada en la base.`);
            return;
        }

        const TABLE_ID = targetTable.id;
        console.log(`ID de la tabla ${TABLE_NAME} es: ${TABLE_ID}`);

        async function createField(name, type, options = null) {
            try {
                const payload = {
                    name: name,
                    type: type
                };
                if (options) {
                    payload.options = options;
                }

                await axios.post(
                    `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`,
                    payload,
                    {
                        headers: {
                            'Authorization': `Bearer ${AIRTABLE_PAT}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log(`✓ Campo creado exitosamente: ${name}`);
            } catch (error) {
                console.error(`x Error al crear campo: ${name}`);
                console.error(error.response ? JSON.stringify(error.response.data) : error.message);
            }
        }

        console.log("Intentando crear la columna 'Contraseña'...");
        await createField('Contraseña', 'singleLineText');

        console.log("Intentando crear la columna 'Acceso_Portal'...");
        await createField('Acceso_Portal', 'singleSelect', {
            choices: [
                { name: "Permitido", color: "greenLight2" },
                { name: "Pendiente", color: "yellowLight2" },
                { name: "Denegado", color: "redLight2" }
            ]
        });

    } catch (e) {
        console.error("Error General:", e.response ? JSON.stringify(e.response.data) : e.message);
    }
}

run();
