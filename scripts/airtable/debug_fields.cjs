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

        table.fields.forEach(f => {
            console.log(`- ${f.name} (${f.type}) [ID: ${f.id}]`);
        });

    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}
run();
