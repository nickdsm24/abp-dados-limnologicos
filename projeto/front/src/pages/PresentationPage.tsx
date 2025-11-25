import React from 'react';
import Header from '../components/Presentation/Header';
import WelcomePanel from '../components/Presentation/WelcomePanel';
import PresentationText from '../components/Presentation/PresentationText';
//import InfoText from '../components/Presentation/InfoText';
import ActionButtons from '../components/Presentation/ActionButtons';


// Componente para ondas animadas
const Wave: React.FC<{ fill?: string; speed?: string; opacity?: number }> = ({
  fill = 'rgba(173, 216, 230, 0.5)',
  speed = '12s',
  opacity = 0.5,
}) => (
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0">
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={`relative block w-[calc(200%+1.3px)] h-[150px]`}
      style={{ animation: `wave_${speed} linear infinite` }}
    >
      <path
        d="M321.39,56.44c58.56,11.54,117.11,23.09,175.67,25.63,58.56,2.54,117.11-4.89,175.67-11.82,58.56-6.93,117.11-13.36,175.67-8.53,58.56,4.83,117.11,20.1,175.67,27,58.56,6.9,117.11,4.48,175.67-2.45v43.74H0V71.59C64.28,62.71,128.56,44.9,192.83,43.24,257.11,41.58,321.39,56.44,321.39,56.44Z"
        fill={fill}
        opacity={opacity}
      />
    </svg>
  </div>
);

// Componente para bolhas flutuantes
const Bubble: React.FC<{ size: number; left: string; duration: string; delay?: string }> = ({
  size,
  left,
  duration,
  delay,
}) => (
  <div
    className="absolute rounded-full bg-white opacity-30"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      left,
      bottom: '-50px',
      animation: `float ${duration} linear infinite`,
      animationDelay: delay || '0s',
    }}
  />
);

const Presentation: React.FC = () => {
  return (
    <div className="relative min-h-screen font-sans text-center overflow-hidden bg-gradient-to-b from-[#a3d5f7] via-[#c8e9f4] to-[#e8f8ff]">
      
      {/* Gradiente animado */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#a3d5f7] via-[#c8e9f4] to-[#e8f8ff] bg-[length:400%_400%]" />

      {/* Ondas */}
      <Wave fill="rgba(173, 216, 230, 0.3)" speed="20s" opacity={0.3} />
      <Wave fill="rgba(173, 216, 230, 0.5)" speed="12s" opacity={0.5} />

      {/* Bolhas flutuantes */}
      {[
        { size: 20, left: '10%', duration: '12s' },
        { size: 35, left: '25%', duration: '18s', delay: '2s' },
        { size: 15, left: '40%', duration: '15s', delay: '1s' },
        { size: 50, left: '60%', duration: '20s', delay: '0s' },
        { size: 25, left: '75%', duration: '17s', delay: '3s' },
        { size: 30, left: '85%', duration: '14s', delay: '2s' },
      ].map((b, i) => (
        <Bubble key={i} size={b.size} left={b.left} duration={b.duration} delay={b.delay} />
      ))}

      {/* Conteúdo principal */}
      <div className="relative z-10">
        <Header />
        <main className="max-w-[1100px] mx-auto my-10 px-4 sm:px-6 md:px-8">
          <WelcomePanel />
          <ActionButtons />
          <PresentationText />
          {/* <InfoText /> */}
        </main>
      </div>

      {/* CSS para animações */}
      <style>
        {`
          /* Ondas animadas */
          @keyframes wave_12s { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes wave_20s { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

          /* Bolhas flutuantes */
          @keyframes float {
            0% { transform: translateY(0) scale(1); opacity: 0.3; }
            50% { opacity: 0.5; }
            100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
          }

          /* Gradiente animado */
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .bg-[length\\:400%_400%] {
            animation: gradientShift 20s ease infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Presentation;
