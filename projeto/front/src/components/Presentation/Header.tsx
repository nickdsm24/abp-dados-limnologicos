import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white p-4 shadow-md relative z-10 h-[120px] flex items-center justify-center">
      {/* Container geral com posição relativa */}
      <div className="absolute left-10 flex items-center gap-8">
        <img
          src="/cabecalho/inpe.png"
          alt="Logo INPE"
          className="w-[90px] h-[90px] object-contain"
        />
        <img
          src="/cabecalho/labisa.png"
          alt="Logo LABISA"
          className="w-[90px] h-[120px] object-contain"
        />
      </div>

      {/* Título centralizado sem ser empurrado pelas logos */}
      <h1 className="text-center text-[clamp(1.2rem,2vw,1.9rem)] font-semibold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-[#1777af] to-cyan-500">
        Dados Limnológicos de Reservatórios do Brasil
      </h1>
    </header>
  );
};

export default Header;
