import React, { useState, useEffect, useRef } from 'react';

interface Slide {
  title: string;
  message: string;
  image?: string;
}

const slides: Slide[] = [
  { title: 'Seja Bem-vindo!', message: 'Explore o sistema...', image: '/carrossel1.png' },
  { title: 'Dados em Tempo Real', message: 'Acompanhe informações...', image: '/carrossel2.png' },
  { title: 'Prevenção e Segurança', message: 'Receba notificações...', image: '/carrossel3.png' },
];

const WelcomePanel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [height, setHeight] = useState<number>(0);

  // Cria refs individualmente para cada slide
  const slideRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Atualiza altura
  useEffect(() => {
    const currentSlideEl = slideRefs.current[currentSlide];
    if (currentSlideEl) setHeight(currentSlideEl.offsetHeight);
  }, [currentSlide]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Swipe mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.changedTouches[0].screenX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  };

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        maxWidth: '900px',
        margin: '40px auto',
        borderRadius: '16px',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        position: 'relative',
        height,
        transition: 'height 0.5s ease',
      }}
    >
      {/* Slides */}
      <div
        style={{
          display: 'flex',
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: 'transform 0.8s ease-in-out',
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) slideRefs.current[index] = el; // Atribui o elemento ao array
            }}
            style={{
              flex: '0 0 100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px 20px',
              boxSizing: 'border-box',
              textAlign: 'center',
              color: 'white',
            }}
          >
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.title}
                loading="lazy"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0,
                  filter: 'brightness(0.5)',
                }}
              />
            )}
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '80%' }}>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  marginBottom: '15px',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                }}
              >
                {slide.title}
              </h2>
              <p
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  lineHeight: 1.6,
                  textShadow: '1px 1px 6px rgba(0,0,0,0.6)',
                }}
              >
                {slide.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Botões */}
      <button onClick={prevSlide} style={buttonStyle(true)}>◀</button>
      <button onClick={nextSlide} style={buttonStyle(false)}>▶</button>

      {/* Indicadores */}
      <div style={indicatorContainerStyle}>
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              display: 'inline-block',
              width: currentSlide === index ? 16 : 12,
              height: currentSlide === index ? 16 : 12,
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? '#1777af' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </section>
  );
};

// Estilos dos botões
const buttonStyle = (isLeft: boolean): React.CSSProperties => ({
  position: 'absolute',
  top: '50%',
  [isLeft ? 'left' : 'right']: '15px',
  transform: 'translateY(-50%)',
  padding: '10px 15px',
  fontSize: '1.4rem',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: 'rgba(0,0,0,0.4)',
  color: 'white',
  zIndex: 2,
});

// Estilo do container de indicadores
const indicatorContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '15px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '10px',
  zIndex: 2,
};

export default WelcomePanel;
