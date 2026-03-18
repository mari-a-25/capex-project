require('dotenv').config();
const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;
const TABLE_NAME = 'PARTICIPANTES';

async function run() {
    try {
        console.log("Iniciando corrección de matrícula...");
        const metaRes = await axios.get(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
            headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` }
        });
        const table = metaRes.data.tables.find(t => t.name === TABLE_NAME);
        const TABLE_ID = table.id;
        const primaryField = table.fields.find(f => f.id === table.primaryFieldId);

        console.log(`Tabla: ${TABLE_NAME} (${TABLE_ID})`);
        console.log(`Campo Primario: ${primaryField.name} (${primaryField.type})`);

        // 1. Crear campo autonumérico oculto si no existe
        let correlativoField = table.fields.find(f => f.name === 'Seq_Internal');
        if (!correlativoField) {
            console.log("Creando campo Seq_Internal...");
            try {
                const res = await axios.post(
                    `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`,
                    { name: 'Seq_Internal', type: 'autoNumber' },
                    { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' } }
                );
                correlativoField = res.data;
                console.log("✓ Seq_Internal creado.");
            } catch (e) {
                console.log("Aviso: No se pudo crear Seq_Internal (quizás ya existe o la tabla tiene límites).", e.response?.data);
                // Si falló, intentamos seguir si ya existiera con otro nombre o si podemos usar el ID_participante actual como base si lo cambiamos de nombre
            }
        }

        // Esperar un poco para que Airtable procese el nuevo campo
        await new Promise(r => setTimeout(r, 2000));

        // 2. Convertir el campo primario a formula
        // OJO: Si el campo primario es ID_participante, y queremos que sea la matrícula:
        console.log("Actualizando campo primario a fórmula de matrícula...");
        try {
            const formula = `"CPX-" & DATETIME_FORMAT(CREATED_TIME(), "YYYY") & "-" & REPT("0", 4 - LEN({Seq_Internal} & "")) & {Seq_Internal}`;

            await axios.patch(
                `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields/${primaryField.id}`,
                {
                    name: "Matricula",
                    type: "formula",
                    options: { formula: formula }
                },
                { headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' } }
            );
            console.log("✓ Campo primario actualizado a 'Matricula' con formato CPX-YYYY-NNNN");
        } catch (e) {
            console.error("Error al actualizar campo primario:", JSON.stringify(e.response?.data));
        }

    } catch (e) {
        console.error("Error general:", e.response?.data || e.message);
    }
}
run();
