import { useState, useEffect } from "react";

const slides = [
  {
    title: "BALCAR!",
    text: "O Projeto BALCAR foi um estudo de pesquisa e desenvolvimento realizado entre 2011 e 2013 pela Eletrobras e pelo Centro de Pesquisas de Energia Elétrica (Cepel) para medir as emissões de gases de efeito estufa (GEE) em reservatórios de usinas hidrelétricas no Brasil.",
    bg: "#006666",
    imgSrc: "/mapa/itumbiara.jpg",
  },
  {
    title: "FURNAS",
    text: "O projeto busca avaliar as emissões de gases de efeito estufa (GEE) dos reservatórios hidrelétricos de Furnas, comparando-as com as de usinas termelétricas e o carbono fixado em reflorestamentos. Essa iniciativa atende à Convenção da ONU sobre o Clima.",
    bg: "#1777af",
    imgSrc: "/mapa/furnas.jpg",
  },
  {
    title: "SIMA",
    text: "Iniciado em 2019 na Universidade Federal do Pará (UFPA), o projeto visa criar o primeiro corredor verde de transporte da Amazônia, utilizando ônibus e uma embarcação elétricas, painéis fotovoltaicos, e um software de gestão. O objetivo é promover a mobilidade sustentável.",
    bg: "#36454F",
    imgSrc: "/mapa/tres-marias.jpg",
  },
];

export default function WelcomePanel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Ajustado para +1 para garantir rotação sequencial suave, 
      // mas você pode voltar para +2 se for uma escolha estilística específica.
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    // Container Principal:
    // - w-full e max-w-[1000px]: Ocupa 100% da tela até atingir 1000px.
    // - h-[500px] md:h-[320px]: Mais alto no mobile para caber o texto verticalmente.
    <div
      className="relative mx-auto overflow-hidden rounded-2xl shadow-xl w-full max-w-[1000px] h-[520px] md:h-[320px]"
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* 1. Imagem de Fundo */}
          <img
            src={slide.imgSrc}
            alt={`Fundo do slide ${slide.title}`}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 2. Sobreposição de Cor + Conteúdo */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 md:p-0"
            style={{ backgroundColor: `${slide.bg}B3` }}
          >
            <div className="px-4 md:px-8 max-w-full md:max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-2">
                {slide.title}
              </h2>
              {/* Texto responsivo:
                 - text-sm ou text-base no mobile
                 - text-lg no desktop
                 - line-clamp opcional caso o texto seja muito grande para telas pequenas
              */}
              <p className="text-base md:text-lg leading-relaxed">
                {slide.text}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full transition-all border border-white/20 ${
              currentSlide === i ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}