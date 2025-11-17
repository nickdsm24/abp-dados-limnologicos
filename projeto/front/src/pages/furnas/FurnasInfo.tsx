import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import atualizado

const FurnasInfo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "metodologia", label: "Metodologia", path: "/furnas-metodologia" },
    { id: "resultados", label: "Resultados", path: "/furnas-resultados" },
    { id: "participantes", label: "Participantes", path: "/furnas-participantes" },
    { id: "usinas", label: "Usinas", path: "/furnas-usinas" },
    { id: "pesquisas", label: "Pesquisas", path: "/furnas-pesquisas" },
    { id: "publicacoes", label: "Publicações", path: "/furnas-publicacoes" },
    { id: "imagens", label: "Imagens", path: "/furnas-imagens" },
    { id: "links", label: "Links", path: "/furnas-link" },
  ];

  // ✅ Função para navegação instantânea
  const handleMenuClick = (path: string, id: string) => {
    if (location.pathname === path) {
      // Se já está na página, faz scroll suave para a seção
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else {
      // Se não está na página, navega para a rota
      navigate(path);
    }
  };

  return (
    <div className="font-sans bg-[#f3f8fb] text-gray-800 scroll-smooth">
      {/* Header principal */}
      <header className="bg-[#0077b6] text-white py-8 px-6">
        <h1 className="text-2xl font-semibold">Balanço de Carbono</h1>
        <h2 className="text-lg mt-1">Reservatórios de Furnas</h2>
        <p className="text-sm mt-2 opacity-90">
          Projeto de pesquisa dedicado ao monitoramento e análise do balanço de
          carbono nos reservatórios hidrelétricos de Furnas
        </p>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Panorama / Objetivos Gerais */}
        <section id="panorama" className="bg-[#e9f2f9] rounded-md shadow p-5">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
            <span className="text-[#0077b6]">📘</span> Objetivos Gerais
          </h3>
          <p className="mb-3">
            O projeto visa quantificar e compreender as emissões e absorções de
            gases de efeito estufa nos reservatórios hidrelétricos de Furnas,
            contribuindo para o desenvolvimento de estratégias de mitigação das
            mudanças climáticas.
          </p>
          <ul className="list-disc pl-6 space-y-1 text-[#0077b6]">
            <li>
              Estabelecer metodologias precisas para medição de emissões de GEE
            </li>
            <li>Criar banco de dados robusto para monitoramento contínuo</li>
            <li>Desenvolver modelos preditivos para balanço de carbono</li>
            <li>Contribuir para políticas públicas de energia sustentável</li>
          </ul>
        </section>

        {/* 🔹 Menu de navegação (atualizado com clique instantâneo) */}
        <nav className="bg-white shadow-sm border border-gray-200 rounded-md">
          <ul className="flex justify-start md:justify-center overflow-x-auto whitespace-nowrap text-sm font-medium">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className="px-4 py-3 cursor-pointer hover:bg-[#e6f3ff] hover:text-[#0077b6] transition"
                onClick={() => handleMenuClick(item.path, item.id)} // ✅ Adicionado
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        {/* Banco de dados */}
        <section
          id="banco-de-dados"
          className="bg-[#fff7e6] border-l-4 border-yellow-500 p-4 rounded"
        >
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            ⚠️ Contexto Global
          </h4>
          <p className="text-sm leading-relaxed">
            As mudanças climáticas têm sido um dos temas de relevância mundial
            na última década. O IPCC confirma que o aquecimento global é
            consequência do aumento das concentrações de gases de efeito estufa,
            originado principalmente da queima de combustíveis fósseis.
          </p>
        </section>

        {/* Metodologia */}
        <section
          id="metodologia"
          className="bg-[#e8f8ea] border-l-4 border-green-600 p-4 rounded"
        >
          <h4 className="font-semibold text-green-800 mb-2">
            Principais Considerações Científicas:
          </h4>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Comissão Mundial de Barragens (WCD):</strong> Avaliações
              criteriosas para emissões hidrelétricas abaixo de 0,1 W/m².
            </li>
            <li>
              <strong>Variabilidade das Emissões:</strong> Depende da
              profundidade e biomassa alagada.
            </li>
            <li>
              <strong>Avaliação do Ciclo Completo:</strong> Antes e após a
              formação do reservatório.
            </li>
            <li>
              <strong>UNFCCC:</strong> Atualização de inventários nacionais de
              emissões antrópicas.
            </li>
          </ul>
        </section>

        {/* Resultados */}
        <section id="resultados" className="bg-white p-4 rounded shadow-sm">
          <h4 className="text-[#0077b6] font-semibold mb-2">
            O Ciclo do Carbono
          </h4>
          <p className="text-sm mb-2">
            Reservatórios menores podem ter maior importância que grandes, pois
            o biota possui aproximadamente 0,1% do carbono da Terra, mas é
            responsável por grande parte dos fluxos.
          </p>
          <p className="text-sm">
            A queima de combustíveis fósseis libera carbono acumulado por
            milhões de anos, alterando o equilíbrio natural do ciclo.
          </p>
        </section>

        {/* Participantes */}
        <section
          id="participantes"
          className="bg-[#ffe5e5] border-l-4 border-red-500 p-4 rounded"
        >
          <h4 className="font-semibold text-red-700 mb-2">
            Impactos Esperados das Mudanças Climáticas
          </h4>
          <ul className="list-disc pl-6 text-sm text-red-700 space-y-1">
            <li>Eventos climáticos extremos mais frequentes</li>
            <li>Alterações na circulação e volume dos oceanos</li>
            <li>Mudanças nos regimes pluviométricos</li>
            <li>Impactos na agricultura e segurança alimentar</li>
            <li>Perda significativa da biodiversidade</li>
          </ul>
        </section>

        {/* Usinas */}
        <section id="usinas" className="flex flex-wrap gap-4 justify-between">
          <div className="bg-[#cce0ff] flex-1 min-w-[200px] p-4 rounded">
            <h5 className="font-semibold">Área de Estudo</h5>
            <p className="text-sm">Reservatórios na bacia do Rio Grande</p>
          </div>
          <div className="bg-[#cce0ff] flex-1 min-w-[200px] p-4 rounded">
            <h5 className="font-semibold">Duração</h5>
            <p className="text-sm">2020 – 2025 (5 anos)</p>
          </div>
          <div className="bg-[#cce0ff] flex-1 min-w-[200px] p-4 rounded">
            <h5 className="font-semibold">Investimento</h5>
            <p className="text-sm">R$ 15 milhões</p>
          </div>
        </section>

        {/* Pesquisas */}
        <section
          id="pesquisas"
          className="bg-gradient-to-r from-[#0077b6] to-[#00a6d6] text-white p-5 rounded"
        >
          <h4 className="font-semibold mb-2">Relevância do Projeto:</h4>
          <p className="text-sm leading-relaxed">
            O projeto fornece dados científicos robustos para compreender e
            quantificar emissões de GEE, contribuindo para estratégias de
            mitigação e para o cumprimento dos compromissos internacionais do
            Brasil.
          </p>
        </section>

        {/* Publicações */}
        <section
          id="publicacoes"
          className="bg-white rounded p-4 shadow-sm mb-10"
        >
          <h4 className="font-semibold mb-4">Organizações participantes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "FURNAS centrais elétricas - S.A.",
              "Universidade Federal de Juiz de Fora",
              "UFRJ - Programa de Pós graduação em engenharia",
              "Instituto Internacional de Ecologia e Gerenciamento Ambiental",
              "Instituto Nacional de Pesquisas Espaciais",
            ].map((org, idx) => (
              <div
                key={idx}
                className="bg-[#dceeff] rounded p-4 shadow text-center border border-[#bcd3f5]"
              >
                <p className="text-sm font-medium">{org}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FurnasInfo;
