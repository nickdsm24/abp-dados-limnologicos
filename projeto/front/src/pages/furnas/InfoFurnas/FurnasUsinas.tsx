import React from "react";

const FurnasUsinas: React.FC = () => {
  const usinas = [
    { nome: "Corumbá", volume: 1.5, area: 65, potencia: 375, densidade: 5.77 },
    { nome: "Funil", volume: 8.9, area: 40, potencia: 216, densidade: 5.4 },
    { nome: "Furnas", volume: 22.95, area: 1440, potencia: 1216, densidade: 0.84 },
    { nome: "Itumbiara", volume: 17, area: 778, potencia: 2082, densidade: 2.68 },
    { nome: "L. C. B. Carvalho (Estreito)", volume: 1.42, area: 46.7, potencia: 1050, densidade: 22.48 },
    { nome: "Manso", volume: 7.3, area: 427, potencia: 210, densidade: 0.49 },
    { nome: "Marimbondo", volume: 6.15, area: 438, potencia: 1440, densidade: 3.29 },
    { nome: "Mascarenhas de Moraes", volume: 4.04, area: 250, potencia: 476, densidade: 1.9 },
    { nome: "Porto Colômbia", volume: 1.53, area: 143, potencia: 320, densidade: 2.24 },
    { nome: "Serra da Mesa", volume: 54, area: 1784, potencia: 1275, densidade: 0.71 },
  ];

  return (
    <div className="font-sans bg-[#f3f8fb] text-gray-800 min-h-screen">
      {/* Cabeçalho */}
      <header className="bg-[#0077b6] text-white py-8 px-6">
        <h1 className="text-2xl font-semibold">Usinas Hidrelétricas</h1>
        <p className="text-sm opacity-90 mt-1">
          Informações sobre volume, área, potência e densidade de potência das principais usinas do sistema Furnas.
        </p>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto p-6">
        <section className="bg-white rounded-md shadow-md p-6 border border-gray-200">
          <h2 className="text-[#0077b6] font-semibold text-lg mb-4 flex items-center gap-2">
            ⚡ Tabela de Usinas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#e9f2f9] text-[#0077b6]">
                  <th className="border border-gray-300 px-4 py-2 text-left">Usina</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Volume (Km³)</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Área (Km²)</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Potência (MW)</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Densidade de Potência (W/m²)</th>
                </tr>
              </thead>
              <tbody>
                {usinas.map((u, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-[#f0f8ff] transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-[#f9fcff]"
                    }`}
                  >
                    <td className="border border-gray-200 px-4 py-2">{u.nome}</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">{u.volume}</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">{u.area}</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">{u.potencia}</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">{u.densidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-600 mt-4 italic">
            Fonte: Dados do sistema Furnas (valores aproximados)
          </p>
        </section>
      </main>
    </div>
  );
};

export default FurnasUsinas;
