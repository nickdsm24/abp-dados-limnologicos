import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  const buttonBase = `
    relative overflow-hidden
    font-semibold text-white text-[clamp(1rem,2.2vw,1.4rem)]
    px-[clamp(2rem,5vw,4rem)] py-[clamp(1rem,3vw,1.8rem)]
    rounded-2xl cursor-pointer
    flex-1 basis-[200px] max-w-[260px]
    shadow-[0_8px_20px_rgba(0,0,0,0.15)]
    transition-transform duration-300 ease-in-out
    transform hover:scale-105 active:scale-95
    focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-60
    bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-500
    hover:from-sky-500 hover:via-blue-400 hover:to-cyan-400
  `;

  const buttonGlow = `
    before:content-[''] before:absolute before:inset-0
    before:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]
    before:opacity-0 hover:before:opacity-100
    before:transition-opacity before:duration-500 before:ease-in-out
    before:z-[-1]
  `;

  const buttons = [
    { label: 'BALCAR', path: '/balcar' },
    { label: 'FURNAS', path: '/furnas' },
    { label: 'SIMA', path: '/sima' },
  ];

  return (
    <section className="flex justify-center flex-wrap gap-14 mt-20 pb-10 px-6">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          className={`${buttonBase} ${buttonGlow}`}
          onClick={() => navigate(btn.path)}
        >
          {btn.label}
        </button>
      ))}
    </section>
  );
};

export default ActionButtons;
