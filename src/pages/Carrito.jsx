import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Carrito.css';

const Carrito = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fcfcfc' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '120px 20px 60px', maxWidth: '1200px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>Mi carrito</h1>
                <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                    Esta es la página borrador de <strong>Mi carrito</strong>. Puedes comenzar a diseñar la interfaz aquí.
                </p>
                <div style={{ height: '300px', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    [Área de diseño para Mi carrito]
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Carrito;
