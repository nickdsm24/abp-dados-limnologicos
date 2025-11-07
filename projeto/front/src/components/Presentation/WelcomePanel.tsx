import { useState, useEffect } from "react";

const slides = [
  {
    title: "BALCAR!",
    text: "O Projeto BALCAR foi um estudo de pesquisa e desenvolvimento realizado entre 2011 e 2013 pela Eletrobras e pelo Centro de Pesquisas de Energia Elétrica (Cepel) para medir as emissões de gases de efeito estufa (GEE) em reservatórios de usinas hidrelétricas no Brasi.",
    bg: "#006666",
  },
  {
    title: "FURNAS",
    text: "O projeto busca avaliar as emissões de gases de efeito estufa (GEE) dos reservatórios hidrelétricos de Furnas, comparando-as com as de usinas termelétricas e o carbono fixado em reflorestamentos. Essa iniciativa atende à Convenção da ONU sobre o Clima e à Lei 9.991/2000, que exige investimentos em pesquisa e desenvolvimento. O objetivo é compreender o balanço de carbono e identificar formas de reduzir emissões no setor elétrico brasileiro.",
    bg: "#1777af",
  },
  {
    title: "SIMA",
    text: " Iniciado em 2019 na Universidade Federal do Pará (UFPA), o projeto visa criar o primeiro corredor verde de transporte da Amazônia, utilizando ônibus e uma embarcação elétricas, painéis fotovoltaicos, e um software de gestão. O objetivo é promover a mobilidade sustentável e a descarbonização.",
    bg: "#36454F",
  },
];

export default function WelcomePanel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 2) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
        className="relative mx-auto overflow-hidden rounded-2xl shadow-xl"
  style={{ width: "1000px", height: "320px" }}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex flex-col items-center justify-center text-center text-white transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ backgroundColor: slide.bg }}
        >
          <div className="px-8">
            <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
            <p className="text-lg max-w-xl mx-auto">{slide.text}</p>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
