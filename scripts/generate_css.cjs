const fs = require('fs');
const path = require('path');

const pages = [
  'LiderazgoIntegral',
  'MandosMedios',
  'Consultoria',
  'Coaching',
  'CapexEspacios',
  'Carrito'
];

const basePath = path.join(__dirname, '..', 'src', 'pages');

pages.forEach(page => {
  const cssPath = path.join(basePath, `${page}.css`);
  const jsxPath = path.join(basePath, `${page}.jsx`);
  
  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, `/* Estilos para la página ${page} */\n.${page.toLowerCase()}-container {\n  /* Agrega tus estilos aquí */\n}\n`);
    console.log(`Created ${page}.css`);
  }

  if (fs.existsSync(jsxPath)) {
    let content = fs.readFileSync(jsxPath, 'utf8');
    if (!content.includes(`import './${page}.css';`)) {
      content = content.replace("import Footer from '../components/Footer';", `import Footer from '../components/Footer';\nimport './${page}.css';`);
      fs.writeFileSync(jsxPath, content);
      console.log(`Added CSS import to ${page}.jsx`);
    }
  }
});
