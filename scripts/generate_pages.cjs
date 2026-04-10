const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'LiderazgoIntegral', path: '/liderazgo-integral', title: 'Liderazgo Integral' },
  { name: 'MandosMedios', path: '/mandos-medios', title: 'Mandos Medios' },
  { name: 'Consultoria', path: '/consultoria', title: 'Consultoría' },
  { name: 'Coaching', path: '/coaching', title: 'Coaching Corporativo' },
  { name: 'CapexEspacios', path: '/capex-espacios', title: 'Capex Espacios' },
  { name: 'Carrito', path: '/carrito', title: 'Mi carrito' }
];

const basePath = path.join(__dirname, '..', 'src', 'pages');

pages.forEach(page => {
  const code = `import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ${page.name} = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fcfcfc' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '120px 20px 60px', maxWidth: '1200px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>${page.title}</h1>
                <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                    Esta es la página borrador de <strong>${page.title}</strong>. Puedes comenzar a diseñar la interfaz aquí.
                </p>
                <div style={{ height: '300px', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    [Área de diseño para ${page.title}]
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ${page.name};
`;

  const filePath = path.join(basePath, `${page.name}.jsx`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, code);
    console.log(`Created ${page.name}.jsx`);
  }
});
