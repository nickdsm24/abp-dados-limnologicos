import React, { useState, useEffect } from 'react';

interface Slide {
  title: string;
  message: string;
  image?: string;
  // Opcional: para ter um controle de fundo diferente para cada slide
  // backgroundColor?: string;
}

const slides: Slide[] = [
  {
    title: 'Seja Bem-vindo!',
    message: 'Explore o sistema de monitoramento de áreas suscetíveis a enchentes e inundações.',
    image: '/carrossel1.png', // Certifique-se de que estes paths estão corretos
  },
  {
    title: 'Dados em Tempo Real',
    message: 'Acompanhe informações atualizadas sobre o nível das águas e alertas de risco.',
    image: '/carrossel2.png',
  },
  {
    title: 'Prevenção e Segurança',
    message: 'Receba notificações e orientações para manter sua segurança e de sua comunidade.',
    image: '/carrossel3.png',
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
        // Removi backgroundColor para que o slide individual defina o fundo
        // Aumentei um pouco o padding vertical para dar mais espaço
        padding: '6vh 0', 
        borderRadius: '16px',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        maxWidth: '900px',
        margin: 'auto',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        minHeight: '450px', // Altura mínima para o carrossel
        display: 'flex', // Para garantir que o conteúdo do carrossel se alinhe
        alignItems: 'center', // Centraliza verticalmente o slide ativo
      }}
    >
      <div
        style={{
          display: 'flex',
          transition: 'transform 0.8s ease-in-out',
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `${slides.length * 100}%`,
          height: '100%', // Para que os slides ocupem a altura do container pai
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              flex: '0 0 100%',
              // Removi padding aqui para que a imagem possa ir até as bordas
              boxSizing: 'border-box',
              position: 'relative', // Essencial para posicionar a imagem e o texto
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px', // Altura mínima para cada slide
              // Um fundo padrão caso a imagem não exista ou para uma camada sobre a imagem
              backgroundColor: slide.image ? 'rgba(0,0,0,0.4)' : '#333', // Camada escura sobre a imagem ou fundo sólido
              color: 'white', // Texto branco para contraste
              textAlign: 'center',
            }}
          >
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  position: 'absolute', // Posiciona a imagem como fundo
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Faz a imagem cobrir todo o espaço sem distorcer
                  zIndex: 0, // Garante que a imagem fique atrás do texto
                }}
              />
            )}
            <div 
              style={{
                position: 'relative', // Conteúdo sobreposto à imagem
                zIndex: 1, // Garante que o texto fique acima da imagem
                padding: '0 20px', // Padding para o conteúdo de texto
                maxWidth: '80%', // Limita a largura do texto para melhor leitura
                margin: '0 auto',
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)', // Aumentei um pouco o tamanho
                  marginBottom: '15px',
                  color: 'white', // Texto branco para contraste com a imagem
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)', // Sombra para o texto melhorar a legibilidade
                }}
              >
                {slide.title}
              </h2>
              <p
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', // Aumentei um pouco o tamanho
                  color: 'white', // Texto branco
                  lineHeight: 1.6,
                  textShadow: '1px 1px 3px rgba(0,0,0,0.6)', // Sombra para o texto
                }}
              >
                {slide.message}
              </p>
            </div>
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
          fontSize: '1.2rem', // Aumentei um pouco o tamanho dos botões
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
          color: 'white',
          zIndex: 2, // Garante que os botões fiquem acima de tudo
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
          fontSize: '1.2rem', // Aumentei um pouco o tamanho dos botões
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
          color: 'white',
          zIndex: 2, // Garante que os botões fiquem acima de tudo
        }}
      >
        ▶
      </button>

      {/* Indicadores */}
      <div style={{ marginTop: '20px', position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
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
              backgroundColor: currentSlide === index ? '#1777af' : 'rgba(255,255,255,0.5)', // Cor azul do tema ou branco transparente
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