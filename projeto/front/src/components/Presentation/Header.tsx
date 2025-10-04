import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white p-4 shadow-md relative z-10">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center flex-wrap gap-4">
        
        {/* Logo */}
        <img
          src="/cabecalho/inpe.png" // Substitua pelo caminho correto da imagem
          alt="Logo"
          className="w-[100px] h-[100px] object-contain"
        />

        {/* Título */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 m-0">
          Labisa - INPE
        </h1>

        {/* Menu Button */}
        <div className="bg-gray-200 p-2 rounded-lg shadow-md">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm sm:text-base font-medium transition-colors duration-200 hover:bg-blue-700"
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
