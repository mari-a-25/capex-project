require('dotenv').config();
const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;
const TABLE_ID = process.env.TABLE_ID;

async function run() {
    try {
        // Just create a simple formula field to see if it works
        const res = await axios.post(
            `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`,
            {
                name: "Matricula_Final",
                type: "formula",
                options: {
                    formula: "CONCATENATE('CPX-', {Correo})"
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_PAT}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Campo Matricula_Final creado!");
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}
run();
