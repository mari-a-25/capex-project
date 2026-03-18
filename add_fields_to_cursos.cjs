const axios = require('axios');

require('dotenv').config();

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || process.env.VITE_AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID || process.env.VITE_BASE_ID;
const TABLE_ID = process.env.TABLE_ID || process.env.VITE_TABLE_ID || 'tblOZy6nUkBqEUkJu'; // CURSOS table

if (!AIRTABLE_PAT || !BASE_ID) {
    throw new Error('Missing AIRTABLE_PAT/BASE_ID env vars. Add them to your .env file.');
}

async function addFieldsToCursos() {
    try {
        console.log('Agregando campos a tabla CURSOS...');
        
        const fieldsToAdd = [
            { name: 'Titulo', type: 'singleLineText' },
            { name: 'Descripcion', type: 'multilineText' },
            { name: 'Imagen', type: 'url' },
            { name: 'Duracion', type: 'singleLineText' },
            { name: 'Nivel', type: 'singleSelect', options: { choices: [{ name: 'Principiante' }, { name: 'Intermedio' }, { name: 'Avanzado' }] } },
            { name: 'Instructor', type: 'singleLineText' },
            { name: 'Costo', type: 'number' },
            { name: 'Horario', type: 'singleLineText' },
            { name: 'Cupos', type: 'number' },
            { name: 'Rating', type: 'number' },
            { name: 'Estudiantes', type: 'number' }
        ];

        let createdCount = 0;
        for (const field of fieldsToAdd) {
            try {
                const response = await axios.post(
                    `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`,
                    field,
                    {
                        headers: {
                            'Authorization': `Bearer ${AIRTABLE_PAT}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log(`✅ Campo '${field.name}' agregado`);
                createdCount++;
            } catch (err) {
                if (err.response?.data?.error?.type === 'FIELD_NAME_CONFLICT') {
                    console.log(`⚠️  Campo '${field.name}' ya existe`);
                } else {
                    console.log(`❌ Error en '${field.name}': ${err.response?.data?.error?.message || err.message}`);
                }
            }
        }
        
        console.log(`\n✅ Proceso completado. ${createdCount} campos agregados.`);
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

addFieldsToCursos();
