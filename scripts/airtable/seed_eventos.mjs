import dotenv from 'dotenv';
import Airtable from 'airtable';
import axios from 'axios';

dotenv.config();

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || process.env.VITE_AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID || process.env.VITE_BASE_ID;

if (!AIRTABLE_PAT || !BASE_ID) {
    throw new Error('Faltan AIRTABLE_PAT/BASE_ID en .env');
}

const base = new Airtable({ apiKey: AIRTABLE_PAT }).base(BASE_ID);

const airtableMeta = axios.create({
    baseURL: `https://api.airtable.com/v0/meta/bases/${BASE_ID}`,
    headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
    }
});

async function ensureEventosTable() {
    try {
        await base('EVENTOS').select({ maxRecords: 1 }).firstPage();
    } catch (err) {
        if (err.statusCode !== 404 && err.statusCode !== 403) throw err;
        await airtableMeta.post('/tables', {
            name: 'EVENTOS',
            fields: [
                { name: 'Titulo', type: 'singleLineText' },
                { name: 'Descripcion', type: 'multilineText' },
                { name: 'DescripcionLarga', type: 'multilineText' },
                { name: 'FechaInicio', type: 'dateTime', options: { timeZone: 'America/Santo_Domingo', dateFormat: { name: 'local' }, timeFormat: { name: '24hour' } } },
                { name: 'FechaFin', type: 'dateTime', options: { timeZone: 'America/Santo_Domingo', dateFormat: { name: 'local' }, timeFormat: { name: '24hour' } } },
                { name: 'Ubicacion', type: 'singleLineText' },
                { name: 'Estado', type: 'singleSelect', options: { choices: [{ name: 'Abierto' }, { name: 'Cerrado' }, { name: 'Agotado' }, { name: 'Cancelado' }] } },
                { name: 'Destacado', type: 'checkbox' },
                { name: 'LinkRegistro', type: 'url' },
                { name: 'Imagen', type: 'multipleAttachments' },
                { name: 'CupoTotal', type: 'number' },
                { name: 'CupoDisponible', type: 'number' },
                { name: 'Categoria', type: 'singleLineText' }
            ]
        });
    }
}

const sampleEvents = [
    {
        Title: 'Congreso Internacional de Innovacion Industrial',
        Description: 'Evento insignia para lideres del sector productivo y transformacion digital.',
        Date: '2026-05-25',
        Location: 'Salon Principal CAPEX',
        Status: 'Activo',
        Featured: true,
        Link: 'https://www.eventbrite.com/',
        Image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80'
    },
    {
        Title: 'Taller de Estrategia Digital 2026',
        Description: 'Como construir hojas de ruta digitales de alto impacto.',
        Date: '2026-06-10',
        Location: 'Salon A, CAPEX',
        Status: 'Activo',
        Featured: false,
        Link: 'https://www.eventbrite.com/',
        Image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80'
    },
    {
        Title: 'Foro de Liderazgo y Cultura Organizacional',
        Description: 'Buenas practicas para fortalecer liderazgo y equipos.',
        Date: '2026-04-18',
        Location: 'Auditorio Empresarial, Santiago',
        Status: 'Cerrado',
        Featured: false,
        Link: 'https://www.eventbrite.com/',
        Image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80'
    },
    {
        Title: 'Seminario de Gestion Humana y Retencion',
        Description: 'Estrategias para atraer y retener talento clave.',
        Date: '2026-07-08',
        Location: 'Centro de Convenciones, Puerto Plata',
        Status: 'Activo',
        Featured: false,
        Link: 'https://www.eventbrite.com/',
        Image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80'
    },
    {
        Title: 'Masterclass de Analitica para Negocios',
        Description: 'Datos y dashboards para decisiones estrategicas.',
        Date: '2026-03-15',
        Location: 'Aula Magna CAPEX',
        Status: 'Cerrado',
        Featured: false,
        Link: 'https://www.eventbrite.com/',
        Image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80'
    },
    {
        Title: 'Bootcamp de Productividad para Mandos Medios',
        Description: 'Herramientas para foco, ejecucion y seguimiento.',
        Date: '2026-08-21',
        Location: 'Salon B, CAPEX',
        Status: 'Activo',
        Featured: false,
        Link: 'https://www.eventbrite.com/',
        Image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80'
    },
    {
        Title: 'Encuentro de Innovacion Educativa',
        Description: 'Nuevas practicas para formacion corporativa.',
        Date: '2026-02-11',
        Location: 'Hotel Hodelpa, Santiago',
        Status: 'Cerrado',
        Featured: false,
        Link: 'https://www.eventbrite.com/',
        Image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80'
    },
    {
        Title: 'Conferencia de Transformacion Comercial',
        Description: 'Ventas consultivas y experiencia del cliente B2B.',
        Date: '2026-09-05',
        Location: 'Salon Ejecutivo CAPEX',
        Status: 'Cerrado',
        Featured: false,
        Link: 'https://www.eventbrite.com/',
        Image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80'
    },
    {
        Title: 'Workshop de Finanzas para No Financieros',
        Description: 'Interpretacion practica de estados y decisiones.',
        Date: '2026-10-14',
        Location: 'Salon C, CAPEX',
        Status: 'Activo',
        Featured: false,
        Link: 'https://www.eventbrite.com/',
        Image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80'
    },
    {
        Title: 'Jornada de Networking Empresarial CAPEX',
        Description: 'Conecta con lideres y potenciales aliados estrategicos.',
        Date: '2026-01-20',
        Location: 'Terraza CAPEX',
        Status: 'Cerrado',
        Featured: false,
        Link: 'https://www.eventbrite.com/',
        Image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80'
    }
];

async function seed() {
    await ensureEventosTable();

    for (let i = 0; i < sampleEvents.length; i += 10) {
        const chunk = sampleEvents.slice(i, i + 10).map((item) => ({
            fields: item
        }));
        await base('EVENTOS').create(chunk);
    }

    console.log(`Eventos insertados: ${sampleEvents.length}`);
}

seed().catch((err) => {
    console.error('Error sembrando eventos:', err.message || err);
    process.exit(1);
});
