const Airtable = require('airtable');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { VITE_AIRTABLE_PAT, VITE_BASE_ID } = process.env;

if (!VITE_AIRTABLE_PAT || !VITE_BASE_ID) {
    console.error('Faltan las variables de entorno VITE_AIRTABLE_PAT o VITE_BASE_ID.');
    process.exit(1);
}

const base = new Airtable({ apiKey: VITE_AIRTABLE_PAT }).base(VITE_BASE_ID);

const airtableMeta = axios.create({
    baseURL: `https://api.airtable.com/v0/meta/bases/${VITE_BASE_ID}`,
    headers: {
        Authorization: `Bearer ${VITE_AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
    },
});

const ensureEventosTable = async () => {
    try {
        console.log('Comprobando si la tabla EVENTOS existe...');
        await base('EVENTOS').select({ maxRecords: 1 }).firstPage();
        console.log('La tabla EVENTOS ya existe.');
    } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 403) {
            console.log('La tabla EVENTOS no existe. Intentando crearla...');
            try {
                await airtableMeta.post('/tables', {
                    name: 'EVENTOS',
                    fields: [
                        { name: 'Titulo', type: 'singleLineText' },
                        { name: 'Descripcion', type: 'multilineText' },
                        { name: 'DescripcionLarga', type: 'multilineText' },
                        { name: 'FechaInicio', type: 'singleLineText' }, // Se usa singleLine para evitar problemas de formato al crearlo
                        { name: 'FechaFin', type: 'singleLineText' },    // Se puede convertir a Fecha manual en Airtable después
                        { name: 'Ubicacion', type: 'singleLineText' },
                        { name: 'Estado', type: 'singleSelect', options: { choices: [{ name: 'Abierto' }, { name: 'Cerrado' }, { name: 'Agotado' }, { name: 'Cancelado' }] } },
                        { name: 'Destacado', type: 'checkbox' },
                        { name: 'LinkRegistro', type: 'url' },
                        { name: 'Imagen', type: 'multipleAttachments' },
                        { name: 'CupoTotal', type: 'number', options: { precision: 0 } },
                        { name: 'CupoDisponible', type: 'number', options: { precision: 0 } },
                        { name: 'Categoria', type: 'singleLineText' }
                    ]
                });
                console.log('Tabla EVENTOS creada exitosamente!');
                // Wait for the table to be fully initialized by Airtable
                await new Promise(resolve => setTimeout(resolve, 3000));
            } catch (metaErr) {
                console.error('No se pudo crear la tabla EVENTOS de manera automática.', metaErr.response?.data || metaErr.message);
                if (metaErr.response?.status === 403) {
                   console.error('El token no tiene permisos para crear tablas (schema.bases:write). Créala manualmente con los campos mencionados.');
                }
                process.exit(1);
            }
        } else {
            console.error('Error desconocido al comprobar la tabla:', err);
            process.exit(1);
        }
    }
};

const events = [
    {
         fields: {
             Title: "Workshop: Liderazgo e Innovación Ágil",
             Description: "Taller inmersivo de 4 horas dedicado a potenciar tus habilidades de liderazgo e innovación en equipos de trabajo modernos.",
             Date: "2024-11-10",
             Location: "Salón de Capacitaciones CAPEX, Nivel 2",
             Status: "Activo", 
             Link: "https://www.tickettailor.com/events/capex"
         }
    },
    {
         fields: {
             Title: "Feria de Emprendimiento Tecnológico Norte 2024",
             Description: "Conecta con startups emergentes, fondos de inversión y talento tecnológico de toda la región.",
             Date: "2024-12-05",
             Location: "Centro de Convenciones UAPA, Santiago",
             Status: "Activo",
             Link: "https://www.tickettailor.com/events/capex"
         }
    },
    {
         fields: {
             Title: "Diplomado: Gestión Aduanera y Logística Internacional",
             Description: "Programa intensivo para dominar los procesos de aduanas y exportación bajo regímenes especiales.",
             Date: "2025-01-20",
             Location: "Virtual vía Microsoft Teams",
             Status: "Activo",
             Link: "https://www.tickettailor.com/events/capex"
         }
    },
    {
         fields: {
             Title: "Networking y Cóctel de Fin de Año CAPEX",
             Description: "Celebra junto a la comunidad CAPEX los logros del año y brinda por un futuro lleno de innovación.",
             Date: "2024-12-19",
             Location: "Jardines de Capex",
             Status: "Activo",
             Link: "https://www.tickettailor.com/events/capex"
         }
    }
];

async function seed() {
    try {
        console.log('Insertando eventos en Airtable...');
        for(const event of events) {
            await base('EVENTOS').create([event]);
            console.log(`Evento insertado: ${event.fields.Title}`);
        }
        console.log('¡Todos los eventos han sido agregados con éxito!');
    } catch(e) {
        console.error('Error insertando eventos:', (e.response && e.response.data) || e.message);
    }
}

seed();
