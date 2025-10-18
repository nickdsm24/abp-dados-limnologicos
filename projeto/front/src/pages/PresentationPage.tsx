import React from 'react';
import Header from '../components/Presentation/Header';
import WelcomePanel from '../components/Presentation/WelcomePanel';
import PresentationText from '../components/Presentation/PresentationText';
import ActionButtons from '../components/Presentation/ActionButtons';

const Presentation: React.FC = () => {
  return (
    <div className="relative min-h-screen font-sans text-center overflow-hidden bg-gradient-to-b from-[#a3d5f7] via-[#c8e9f4] to-[#e8f8ff]">
      {/* Ondas animadas de fundo */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[150px] animate-[wave_12s_linear_infinite]"
        >
          <path
            d="M321.39,56.44c58.56,11.54,117.11,23.09,175.67,25.63,58.56,2.54,117.11-4.89,175.67-11.82,58.56-6.93,117.11-13.36,175.67-8.53,58.56,4.83,117.11,20.1,175.67,27,58.56,6.9,117.11,4.48,175.67-2.45v43.74H0V71.59C64.28,62.71,128.56,44.9,192.83,43.24,257.11,41.58,321.39,56.44,321.39,56.44Z"
            fill="rgba(173, 216, 230, 0.5)"
          ></path>
        </svg>
      </div>

      {/* Conteúdo principal acima das ondas */}
      <div className="relative z-10">
        <Header />
        <main className="max-w-[1100px] mx-auto my-10 px-6">
          <WelcomePanel />
          <ActionButtons />
          <PresentationText />
        </main>
      </div>

      {/* Animação suave da onda */}
      <style>
        {`
          @keyframes wave {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Presentation;
