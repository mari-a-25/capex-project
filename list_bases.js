import axios from 'axios';

import 'dotenv/config';

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || process.env.VITE_AIRTABLE_PAT;

if (!AIRTABLE_PAT) {
    throw new Error('Missing AIRTABLE_PAT env var. Add it to your .env file.');
}

async function listBases() {
    try {
        console.log('Listing Bases...');
        const response = await axios.get(`https://api.airtable.com/v0/meta/bases`, {
            headers: { Authorization: `Bearer ${AIRTABLE_PAT}` }
        });
        console.log('Bases found:', JSON.stringify(response.data.bases, null, 2));
    } catch (err) {
        console.error('Failed to list bases:', err.response?.data || err.message);
    }
}

listBases();
