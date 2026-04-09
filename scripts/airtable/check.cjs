require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || process.env.VITE_AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID || process.env.VITE_BASE_ID;

if (!AIRTABLE_PAT || !BASE_ID) {
    throw new Error('Missing AIRTABLE_PAT/BASE_ID env vars. Add them to your .env file.');
}

axios
    .get(`https://api.airtable.com/v0/${BASE_ID}/PARTICIPANTES?maxRecords=1`, {
        headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
    })
    .then((res) => {
        fs.writeFileSync(
            'c:\\capex-project\\airtable_fields.json',
            JSON.stringify(res.data.records[0].fields, null, 2)
        );
    });
