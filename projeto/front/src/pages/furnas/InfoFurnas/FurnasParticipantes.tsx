import React from "react";

const FurnasParticipantes: React.FC = () => {
  const participantes = [
    {
      nome: "FURNAS Centrais Elétricas S.A.",
      funcao: "Coordenação do projeto.",
    },
    {
      nome: "Universidade Federal do Rio de Janeiro - COPPE",
      funcao:
        "Estimativa de fluxos de GHG (gases de efeito estufa, CO2, CH4 e N2) na interface água-atmosfera e determinação do aporte e das taxas de sedimentação de carbono.",
    },
    {
      nome: "Universidade Federal de Juiz de Fora",
      funcao:
        "Determinações da produção primária, metabolismo bacteriano e concentrações de nutrientes na coluna d’água.",
    },
    {
      nome: "Instituto Internacional de Ecologia e Gerenciamento Ambiental",
      funcao:
        "Estimativas de fluxos de GHG e das concentrações de carbono e nutrientes na interface água-sedimento.",
    },
    {
      nome: "Instituto Nacional de Pesquisas Espaciais",
      funcao:
        "Organização do banco de dados do projeto, instalação de plataformas telemétricas de dados ambientais, estimativa de fluxos de GHG na interface água-atmosfera, análise isotópica (CENA-USP) e modelagem dos fluxos de emissão de GHG.",
    },
  ];

  return (
    <div className="font-sans bg-[#f3f8fb] text-gray-800 min-h-screen p-6">
      {/* Header */}
      <header className="bg-[#4169E1] text-white py-8 px-6 rounded-md mb-6">
        <h1 className="text-2xl font-semibold">Participantes do Projeto</h1>
        <p className="text-sm mt-2 opacity-90">
          Organizações e instituições envolvidas no monitoramento do balanço de
          carbono nos reservatórios de Furnas.
        </p>
      </header>

      {/* Lista de participantes */}
      <main className="max-w-4xl mx-auto space-y-4">
        {participantes.map((p, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded shadow border-l-4 border-blue-500"
          >
            <h3 className="font-semibold text-cyan-700 mb-1">{p.nome}</h3>
            <p className="text-sm text-gray-700">{p.funcao}</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default FurnasParticipantes;
