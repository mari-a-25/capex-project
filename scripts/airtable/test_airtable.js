require('dotenv').config();
const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;

async function testConnection() {
    try {
        console.log('Testing Airtable connection to CAPEX base...');
        const response = await axios.get(`https://api.airtable.com/v0/${BASE_ID}/PARTICIPANTES?maxRecords=1`, {
            headers: { Authorization: `Bearer ${AIRTABLE_PAT}` }
        });
        console.log('Connection Successful!');
        console.log('First Record Data:', JSON.stringify(response.data.records[0]?.fields, null, 2));
    } catch (err) {
        console.error('Connection Failed:', err.response?.data || err.message);
    }
}

testConnection();
