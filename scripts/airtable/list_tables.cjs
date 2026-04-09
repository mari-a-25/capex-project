require('dotenv').config();
const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;

async function listTables() {
    try {
        console.log('Listing Tables...');
        const response = await axios.get(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
            headers: { Authorization: `Bearer ${AIRTABLE_PAT}` }
        });
        
        console.log('\n=== TABLAS DISPONIBLES ===\n');
        response.data.tables.forEach((table, idx) => {
            console.log(`${idx + 1}. ${table.name} (ID: ${table.id})`);
            console.log(`   Campos:`);
            table.fields.forEach(field => {
                console.log(`   - ${field.name} (${field.type})`);
            });
            console.log('');
        });
    } catch (err) {
        console.error('Failed to list tables:', err.response?.data || err.message);
    }
}

listTables();
