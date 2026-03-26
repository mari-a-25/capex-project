import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

import './QuienesSomos.css';

const useReveal = () => {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  return { ref, inView };
};

const Metric = ({ iconClassName, value, label, suffix }) => {
  const { ref, inView } = useReveal();
  return (
    <div className="qs-metric-item" ref={ref}>
      <i className={iconClassName} aria-hidden="true" />
      <h3>
        {inView ? (
          <CountUp end={value} duration={2.2} separator="," suffix={suffix || ''} />
        ) : (
          '0'
        )}
      </h3>
      <p>{label}</p>
    </div>
  );
};

const QuienesSomos = () => {
  const parallaxRefs = React.useRef([]);
  const pageRef = React.useRef(null);

  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.pageYOffset || 0;
        parallaxRefs.current.forEach(({ el, speed }) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.style.transform = `translateY(${-(y * speed)}px)`;
          }
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  React.useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // Stagger específico para el consejo (igual que tu HTML)
          if (entry.target.classList.contains('qs-council-extended-flex')) {
            const cards = entry.target.querySelectorAll('.qs-ext-member-card');
            cards.forEach((card, index) => {
              window.setTimeout(() => {
                card.classList.add('active');
              }, 150 * (index + 1));
            });
            return;
          }

          entry.target.classList.add('active');
        });
      },
      { threshold: 0.15 }
    );

    root.querySelectorAll('.qs-reveal').forEach((el) => observer.observe(el));
    const councilContainer = root.querySelector('.qs-council-extended-flex');
    if (councilContainer) observer.observe(councilContainer);

    return () => observer.disconnect();
  }, []);

  const council = [
    {
      name: 'Oscar Frías',
      role: 'Vicepresidente',
      img: 'https://www.capex.edu.do/web/image/24105-400d0493/1.webp',
    },
    {
      name: 'Gilda Pereyra',
      role: 'Tesorera',
      img: 'https://www.capex.edu.do/web/image/24107-e92c5780/4.webp',
    },
    {
      name: 'Adriana Fondeur',
      role: 'Secretaria',
      img: 'https://www.capex.edu.do/web/image/24106-90f9ec92/3.webp',
    },
    {
      name: 'Edwin Pereyra',
      role: 'Vocal',
      img: 'https://www.capex.edu.do/web/image/24103-67742170/2.png',
    },
    {
      name: 'Miguel Andrés Lama',
      role: 'Vocal',
      img: 'https://www.capex.edu.do/web/image/24108-920771f1/5.webp',
    },
  ];

  return (
    <div className="quienes-somos-page" ref={pageRef}>
      <Navbar />

      <header className="qs-hero-wrap">
        <motion.div
          className="qs-hero-content qs-reveal active"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1>Conoce sobre Nosotros</h1>
          <p>Transformamos el Conocimiento en Riqueza para Santiago y toda la Región Norte.</p>
        </motion.div>
      </header>

      <section className="qs-metrics-shell" aria-label="Métricas CAPEX">
        <div className="qs-metrics-container qs-reveal">
          <Metric iconClassName="fas fa-user-graduate" value={8500} label="Egresados" />
          <Metric iconClassName="fas fa-handshake" value={150} label="Empresas Aliadas" />
          <Metric iconClassName="fas fa-calendar-alt" value={500} label="Eventos Anuales" />
          <Metric iconClassName="fas fa-award" value={98} label="Calidad Educativa" suffix="%" />
        </div>
      </section>

      <section className="qs-about-section">
        <div className="qs-about-content qs-reveal">
          <span className="qs-tagline">Nuestra Identidad</span>
          <h2>Catalizador de Innovación Real</h2>
          <p>Capex es un motor que integra la innovación mediante proyectos estratégicos y formación pragmática.</p>
          <p>Nuestra metodología ha fortalecido el empoderamiento social y la productividad tecnológica de vanguardia.</p>
        </div>
        <div className="qs-about-img-frame qs-reveal">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
            alt="Innovación CAPEX"
          />
          <div className="qs-floating-metric" aria-label="Más de 50,000 estudiantes">
            <div>
              <span className="number">+50,000</span>
              <span className="label">Estudiantes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="qs-mvv-container">
        <div className="qs-mvv-grid">
          <div className="qs-mvv-card qs-reveal">
            <div className="qs-icon-box">
              <i className="fas fa-bullseye fa-2x" aria-hidden="true" />
            </div>
            <h4>Misión</h4>
            <p>Fortalecemos el talento humano de las organizaciones para el logro de su desarrollo sostenible.</p>
          </div>

          <div className="qs-mvv-card qs-reveal">
            <div className="qs-icon-box">
              <i className="fas fa-eye fa-2x" aria-hidden="true" />
            </div>
            <h4>Visión</h4>
            <p>Transformamos el conocimiento en riqueza.</p>
          </div>

          <div className="qs-mvv-card qs-reveal">
            <div className="qs-icon-box">
              <i className="fas fa-star fa-2x" aria-hidden="true" />
            </div>
            <h4>Valores</h4>
            <div className="qs-valores-pills">
              <span className="qs-pill">Excelencia</span>
              <span className="qs-pill">Compromiso</span>
              <span className="qs-pill">Sostenibilidad</span>
              <span className="qs-pill">Innovación</span>
            </div>
          </div>
        </div>
      </section>

      <header className="qs-header-banner qs-reveal">
        <span className="qs-tagline qs-tagline-white">Liderazgo Institucional</span>
        <h2>Consejo Directivo</h2>
      </header>

      <section className="qs-perfil-section qs-presidente-section">
        <div
          className="qs-img-frame qs-reveal js-parallax"
          ref={(el) => {
            parallaxRefs.current[0] = { el, speed: 0.05 };
          }}
        >
          <img src="https://www.capex.edu.do/web/image/24014-472abab8/GPR_2562.webp" alt="Miguel Lama" />
        </div>
        <div className="qs-content-box qs-reveal">
          <p className="qs-p-interactivo">
            Nuestro rumbo está claro. En 2025, intensificaremos esfuerzos para que cada experiencia no solo inspire, sino que también genere un impacto significativo.
          </p>
          <div className="qs-firma-box qs-reveal">
            <img src="https://www.capex.edu.do/web/image/8945/Firma-1-Lama.png" alt="Firma Miguel Lama" />
          </div>
        </div>
      </section>

      <section className="qs-perfil-section qs-directora-section">
        <div className="qs-content-box qs-reveal">
          <p className="qs-p-interactivo">
            “Transformamos el conocimiento en Riqueza”. En Capex, nos concentramos ante la poderosa conexión que cultivamos con la comunidad.
          </p>
          <div className="qs-firma-box qs-reveal">
            <img src="https://www.capex.edu.do/web/image/5521/Firma-2.png" alt="Firma Directora Ejecutiva" />
          </div>
        </div>
        <div
          className="qs-img-frame qs-reveal js-parallax"
          ref={(el) => {
            parallaxRefs.current[1] = { el, speed: -0.03 };
          }}
        >
          <img src="https://www.capex.edu.do/web/image/24015-4885ed81/GPR_0525.webp" alt="Directora Ejecutiva CAPEX" />
        </div>
      </section>

      <section className="qs-council-extended-section">
        <div className="qs-council-extended-flex">
          {council.map((m) => (
            <div className="qs-ext-member-card" key={m.name}>
              <div className="qs-ext-photo-frame">
                <img src={m.img} alt={m.name} />
              </div>
              <div className="qs-ext-member-info">
                <span className="qs-ext-member-name">{m.name}</span>
                <span className="qs-ext-member-role">{m.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default QuienesSomos;
