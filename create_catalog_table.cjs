require('dotenv').config();
const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;

async function createCatalogTable() {
    try {
        console.log('Creando tabla CATALOGO_CURSOS...');
        
        const response = await axios.post(
            `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
            {
                name: 'CATALOGO_CURSOS',
                fields: [
                    { name: 'Titulo', type: 'singleLineText' },
                    { name: 'Descripcion', type: 'multilineText' },
                    { name: 'Imagen', type: 'url' },
                    { name: 'Duracion', type: 'singleLineText' },
                    {
                        name: 'Modalidad',
                        type: 'singleSelect',
                        options: {
                            choices: [
                                { name: 'Presencial' },
                                { name: 'Virtual' },
                                { name: 'Híbrido' }
                            ]
                        }
                    },
                    {
                        name: 'Nivel',
                        type: 'singleSelect',
                        options: {
                            choices: [
                                { name: 'Principiante' },
                                { name: 'Intermedio' },
                                { name: 'Avanzado' }
                            ]
                        }
                    },
                    {
                        name: 'Precio',
                        type: 'currency',
                        options: {
                            precision: 0,
                            symbol: 'RD$'
                        }
                    },
                    { name: 'Capacidad', type: 'number' },
                    { name: 'Instructor', type: 'singleLineText' },
                    { name: 'Horario', type: 'singleLineText' },
                    {
                        name: 'Certificacion',
                        type: 'singleSelect',
                        options: {
                            choices: [
                                { name: 'Sí' },
                                { name: 'No' }
                            ]
                        }
                    },
                    { name: 'Rating', type: 'number' },
                    { name: 'Estudiantes', type: 'number' }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_PAT}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Tabla CATALOGO_CURSOS creada exitosamente!');
        
    } catch (err) {
        if (err.response?.data?.error?.type === 'TABLE_NAME_CONFLICT') {
            console.log('⚠️  La tabla CATALOGO_CURSOS ya existe.');
        } else {
            console.error('Error:', err.response?.data?.error?.message || err.message);
        }
    }
}

createCatalogTable();
