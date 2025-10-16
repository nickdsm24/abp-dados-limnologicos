import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  const buttonClasses = `
    relative overflow-hidden
    font-semibold text-white text-[clamp(1rem,2.2vw,1.4rem)]
    px-[clamp(2rem,5vw,4rem)] py-[clamp(1rem,3vw,1.8rem)]
    rounded-2xl cursor-pointer
    flex-1 basis-[200px] max-w-[260px]
    shadow-[0_8px_20px_rgba(0,0,0,0.15)]
    transition-all duration-300 ease-in-out
    transform hover:-translate-y-1 active:scale-95
    focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-60
    bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-500
    hover:from-sky-500 hover:via-blue-400 hover:to-cyan-400
  `;

  const glowEffect = `
    before:content-[''] before:absolute before:inset-0
    before:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)]
    before:opacity-0 hover:before:opacity-100
    before:transition-opacity before:duration-500 before:ease-in-out
  `;

  return (
    <section className="flex justify-center flex-wrap gap-14 mt-20 pb-10 px-6">
      <button
        className={`${buttonClasses} ${glowEffect}`}
        onClick={() => navigate('/balcar')}
      >
        BALCAR
      </button>

      <button
        className={`${buttonClasses} ${glowEffect}`}
        onClick={() => navigate('/furnas')}
      >
        FURNAS
      </button>

      <button
        className={`${buttonClasses} ${glowEffect}`}
        onClick={() => navigate('/sima')}
      >
        SIMA
      </button>
    </section>
  );
};

export default ActionButtons;
