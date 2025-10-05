export default function PresentationText() {
  return (
    <section className="w-full my-12 md:my-16">
      <div className="relative container mx-auto p-8 md:p-12 overflow-hidden">
          {/* Texto */}
          <div className="md:col-span-2 text-center md:text-left">
            <h1 className="text-2xl font-extrabold tracking-tighter mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1777af] to-cyan-500">
                Plataforma de Dados Hidroambientais
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto md:mx-0">
              Acesso unificado aos dados de monitoramento dos projetos <strong className="font-semibold text-gray-800">SIMA</strong>, <strong className="font-semibold text-gray-800">BALCAR</strong> e <strong className="font-semibold text-gray-800">FURNAS</strong>, dedicados ao estudo de reservatórios e ecossistemas aquáticos.
            </p>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto md:mx-0">
              Este portal oferece ferramentas para consulta, visualização e download dos dados coletados em campo. Explore tabelas dinâmicas, gere gráficos para análise de tendências e utilize mapas interativos para investigar a distribuição espacial das variáveis. O objetivo é fornecer um recurso robusto para a comunidade científica e gestores de recursos hídricos, fomentando a pesquisa e a transparência na gestão ambiental.
            </p>
          </div>
        </div>
    </section>
  );
}