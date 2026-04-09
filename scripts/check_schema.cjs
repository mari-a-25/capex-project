const Airtable = require('airtable');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { VITE_AIRTABLE_PAT, VITE_BASE_ID } = process.env;
const base = new Airtable({ apiKey: VITE_AIRTABLE_PAT }).base(VITE_BASE_ID);

async function check() {
    try {
        const records = await base('EVENTOS').select({ maxRecords: 1 }).firstPage();
        if (records.length > 0) {
            console.log("Fields in first record:", Object.keys(records[0].fields));
        } else {
            console.log("No records in EVENTOS, cannot deduce schema easily through data API. Try adding a field or use meta API.");
            const axios = require('axios');
            const airtableMeta = axios.create({
                baseURL: `https://api.airtable.com/v0/meta/bases/${VITE_BASE_ID}/tables`,
                headers: { Authorization: `Bearer ${VITE_AIRTABLE_PAT}` }
            });
            const { data } = await airtableMeta.get();
            const table = data.tables.find(t => t.name === 'EVENTOS');
            if (table) {
                console.log("Table schema fields:", table.fields.map(f => f.name));
            }
        }
    } catch(e) {
         console.error(e.message);
    }
}
check();
