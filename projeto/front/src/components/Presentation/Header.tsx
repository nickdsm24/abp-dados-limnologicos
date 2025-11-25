import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white p-4 shadow-md relative z-10 min-h-[120px] flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
      {/* Container das logos: 
        - Mobile: Relative, centralizado, gap menor.
        - Desktop (md): Absolute à esquerda, gap maior.
      */}
      <div className="relative md:absolute md:left-10 flex items-center gap-4 md:gap-8">
        <img
          src="/cabecalho/inpe.png"
          alt="Logo INPE"
          className="w-[60px] h-[60px] md:w-[90px] md:h-[90px] object-contain"
        />
        <img
          src="/cabecalho/labisa.png"
          alt="Logo LABISA"
          className="w-[60px] h-[80px] md:w-[90px] md:h-[120px] object-contain"
        />
      </div>

      {/* Título:
        - O tamanho da fonte já usava clamp, o que é bom.
        - Adicionado max-w para garantir que não estoure em telas muito pequenas.
      */}
      <h1 className="text-center text-[clamp(1.1rem,2vw,1.9rem)] leading-tight font-semibold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-[#1777af] to-cyan-500 max-w-md md:max-w-none">
        Dados Limnológicos de Reservatórios do Brasil
      </h1>
    </header>
  );
};

export default Header;
