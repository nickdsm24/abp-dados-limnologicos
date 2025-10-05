import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  // As classes do Tailwind são combinadas em uma constante para reutilização,
  // mantendo o código limpo e fácil de ler.
  const buttonClasses = `
    font-bold text-white text-[clamp(0.9rem,2vw,1.2rem)]
    p-[clamp(1rem,4vw,2.5rem)_clamp(2rem,6vw,5rem)]
    border-none rounded-xl cursor-pointer
    flex-1 basis-[200px] max-w-[250px]
    shadow-lg hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)]
    transition-all duration-300 ease-in-out
    transform hover:-translate-y-1
    bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.1),rgba(255,255,255,0.1)_1px,transparent_1px,transparent_4px),linear-gradient(135deg,#1777af_0%,#1a8cd8_100%)]
  `;

  return (
    <section className="flex justify-center flex-wrap gap-8 mt-8 pb-8 px-4">
      <button
        className={buttonClasses}
        onClick={() => navigate('/balcar')}
      >
        BALCAR
      </button>

      <button
        className={buttonClasses}
        onClick={() => navigate('/furnas')}
      >
        FURNAS
      </button>

      <button
        className={buttonClasses}
        onClick={() => navigate('/sima')}
      >
        SIMA
      </button>
    </section>
  );
};

export default ActionButtons;