require('dotenv').config();
const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.BASE_ID);

const programsToInsert = [
    {
        fields: {
            "Titulo": "Escuela de Gerentes",
            "Descripcion": "Transformamos profesionales en líderes estratégicos con visión global y herramientas innovadoras de gestión.",
            "Duracion": "6 Meses",
            "Nivel": "Diplomado",
            "Imagen": [{ url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800" }]
        }
    },
    {
        fields: {
            "Titulo": "HR Mastery: Gestión Humana",
            "Descripcion": "Potenciamos a los líderes de gestión humana con metodologías avanzadas e inteligencia emocional.",
            "Duracion": "Flexible",
            "Nivel": "Especialidad",
            "Imagen": [{ url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" }]
        }
    },
    {
        fields: {
            "Titulo": "Mandos Medios",
            "Descripcion": "Preparamos a los mandos medios para convertirse en el motor de ejecución estratégica de la empresa.",
            "Duracion": "Presencial",
            "Nivel": "Taller",
            "Imagen": [{ url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800" }]
        }
    }
];

async function insertCourses() {
    try {
        const result = await base('CURSOS').create(programsToInsert);
        console.log(`Inserted ${result.length} new programs successfully!`);
    } catch (e) {
        console.error('Error inserting programs:', e.message);
    }
}

insertCourses();
