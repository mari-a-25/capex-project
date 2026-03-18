require('dotenv').config();

const axios = require('axios');

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.BASE_ID;


const coursesData = [
    {
        Titulo: 'Diplomado en Gestión de Proyectos',
        Descripcion: 'Metodologías ágiles, planificación y control de proyectos. Aprende a dirigir equipos y entregar resultados excepcionales.',
        Imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        Duracion: '3 meses',
        Nivel: 'Intermedio',
        Costo: 25000,
        Horario: 'Lunes a Viernes 6:00 PM - 8:00 PM',
        Instructor: 'Ing. Carlos Fernández',
        Cupos: 20,
        Rating: 4.5,
        Estudiantes: 120
    },
    {
        Titulo: 'Taller de Innovación Empresarial',
        Descripcion: 'Diseña soluciones creativas para tu empresa. Estrategias de innovación y emprendimiento en la era digital.',
        Imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        Duracion: '6 semanas',
        Nivel: 'Principiante',
        Costo: 15000,
        Horario: 'Sábados 9:00 AM - 1:00 PM',
        Instructor: 'Lic. María González'
    },
    {
        Titulo: 'Programa de Liderazgo Ejecutivo',
        Descripcion: 'Desarrolla habilidades de liderazgo y toma de decisiones. Fortalece tu capacidad como líder empresarial.',
        Imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        Duracion: '4 meses',
        Nivel: 'Avanzado',
        Costo: 35000,
        Horario: 'Martes y Jueves 7:00 PM - 9:00 PM',
        Instructor: 'Dr. Roberto López'
    },
    {
        Titulo: 'Curso de Marketing Digital y Redes Sociales',
        Descripcion: 'Domina las estrategias de marketing digital, SEO, y posicionamiento en redes sociales para empresas modernas.',
        Imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        Duracion: '2 meses',
        Nivel: 'Intermedio',
        Costo: 18000,
        Horario: 'Lunes, Miércoles y Viernes 5:00 PM - 7:00 PM',
        Instructor: 'Lic. Ana Martínez'
    },
    {
        Titulo: 'Finanzas para Empresarios',
        Descripcion: 'Aprende gestión financiera, análisis de inversiones y planificación fiscal para tu negocio.',
        Imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        Duracion: '3 meses',
        Nivel: 'Intermedio',
        Costo: 28000,
        Horario: 'Martes y Jueves 6:30 PM - 8:30 PM',
        Instructor: 'CPA. Juan Rodríguez'
    },
    {
        Titulo: 'Emprendimiento Digital y E-commerce',
        Descripcion: 'Crea tu negocio online exitoso. Desde la idea hasta la implementación de tu tienda virtual.',
        Imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        Duracion: '8 semanas',
        Nivel: 'Principiante',
        Costo: 12000,
        Horario: 'Lunes a Viernes 8:00 PM - 9:00 PM',
        Instructor: 'Ing. Luis García',
        Cupos: 30,
        Rating: 4.2,
        Estudiantes: 180
    }
];

async function addCourses() {
    try {
        console.log('Agregando cursos a Airtable...');
        
        const records = coursesData.map(curso => ({
            fields: curso
        }));

        const response = await axios.post(
            `https://api.airtable.com/v0/${BASE_ID}/CURSOS`,
            { records },
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_PAT}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`✅ ${response.data.records.length} cursos agregados exitosamente!`);
        response.data.records.forEach((curso, idx) => {
            console.log(`${idx + 1}. ${curso.fields.Titulo} (ID: ${curso.id})`);
        });
    } catch (err) {
        console.error('Error agregando cursos:', err.response?.data || err.message);
    }
}

addCourses();
