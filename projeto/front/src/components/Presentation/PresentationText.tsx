import { useEffect, useState } from "react";

export default function PresentationText() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200); // atraso para animação suave
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full my-12 md:my-16">
      <div className="relative container mx-auto px-6 md:px-12 overflow-hidden">
        {/* Texto */}
        <div
          className={`md:col-span-2 text-center md:text-left space-y-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 group">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1777af] to-cyan-500 transition-all duration-500 group-hover:from-cyan-500 group-hover:to-[#1777af]">
              Plataforma de Dados Hidroambientais
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto md:mx-0">
            Acesso unificado aos dados de monitoramento dos projetos{" "}
            <strong className="font-semibold text-gray-800">SIMA</strong>,{" "}
            <strong className="font-semibold text-gray-800">BALCAR</strong> e{" "}
            <strong className="font-semibold text-gray-800">FURNAS</strong>, dedicados ao estudo de reservatórios e ecossistemas aquáticos.
          </p>

          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto md:mx-0">
            Este portal oferece ferramentas para consulta, visualização e download dos dados coletados em campo. Explore tabelas dinâmicas, gere gráficos para análise de tendências e utilize mapas interativos para investigar a distribuição espacial das variáveis.
          </p>

          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto md:mx-0">
            O objetivo é fornecer um recurso robusto para a comunidade científica e gestores de recursos hídricos, fomentando a pesquisa e a transparência na gestão ambiental.
          </p>
        </div>
      </div>
    </section>
  );
}
