require('dotenv').config();
const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;

async function testRegister() {
    const data = {
        Nombre: 'Test',
        Apellido: 'User',
        Cédula_pasaporte: '12345',
        Correo: 'test_robusto@example.com',
        Teléfono: '8090000000',
        Empresa_Nombre: 'Test Corp',
        Puesto_trabajo: 'Tester',
        Motivo_acceso: 'Prueba',
        Referencia: 'Anit',
        Contraseña: 'password123',
        Acceso_Portal: 'Pendiente'
    };

    try {
        console.log("Intentando registro de prueba...");
        const response = await axios.post(`https://api.airtable.com/v0/${BASE_ID}/PARTICIPANTES`, {
            records: [{ fields: data }]
        }, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_PAT}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("¡Éxito!", response.data.records[0].id);
    } catch (err) {
        console.error("Error detectado:");
        if (err.response) {
            console.error(JSON.stringify(err.response.data, null, 2));
        } else {
            console.error(err.message);
        }
    }
}

testRegister();
