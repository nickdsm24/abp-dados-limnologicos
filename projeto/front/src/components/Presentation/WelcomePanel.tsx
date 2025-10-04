import React, { useState, useEffect } from 'react';

interface Slide {
  title: string;
  message: string;
  image?: string;
}

const slides: Slide[] = [
  {
    title: 'Seja Bem-vindo!',
    message: 'Explore o sistema de monitoramento de áreas suscetíveis a enchentes e inundações.',
    image: '/images/slide1.png',
  },
  {
    title: 'Dados em Tempo Real',
    message: 'Acompanhe informações atualizadas sobre o nível das águas e alertas de risco.',
    image: '/images/slide2.png',
  },
  {
    title: 'Prevenção e Segurança',
    message: 'Receba notificações e orientações para manter sua segurança e de sua comunidade.',
    image: '/images/slide3.png',
  },
];

const WelcomePanel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Avança automaticamente a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      style={{
        backgroundColor: '#f7f9fc',
        padding: '8vh 5vw',
        borderRadius: '16px',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        maxWidth: '900px',
        margin: 'auto',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          transition: 'transform 0.8s ease-in-out',
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              flex: '0 0 100%',
              padding: '0 20px',
              boxSizing: 'border-box',
            }}
          >
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.title}
                style={{ maxWidth: '200px', marginBottom: '20px' }}
              />
            )}
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                marginBottom: '20px',
                color: '#333',
              }}
            >
              {slide.title}
            </h2>
            <p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: '#555',
                lineHeight: 1.6,
              }}
            >
              {slide.message}
            </p>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          padding: '10px 15px',
          fontSize: '1rem',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          padding: '10px 15px',
          fontSize: '1rem',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ▶
      </button>

      {/* Indicadores */}
      <div style={{ marginTop: '20px' }}>
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              margin: '0 5px',
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? '#4364f7' : '#ccc',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default WelcomePanel;
