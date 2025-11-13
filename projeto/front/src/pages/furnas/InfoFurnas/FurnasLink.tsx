import React from "react";

const FurnasLink: React.FC = () => {
  return (
    <div className="font-sans bg-[#f3f8fb] text-gray-800 scroll-smooth">
      {/* Header da página */}
      <header className="bg-[#0077b6] text-white py-12 px-6 shadow-lg rounded-b-lg">
        <h1 className="text-3xl font-bold">Links Úteis</h1>
        <p className="text-sm mt-4 opacity-90 max-w-3xl mx-auto">
          Uma lista de links importantes para o acompanhamento de pesquisas, eventos e informações relevantes sobre emissões de gases de efeito estufa em reservatórios hidrelétricos.
        </p>
      </header>

      {/* Conteúdo da página */}
      <main className="max-w-6xl mx-auto p-6 space-y-12">
        <section>
          <h4 className="text-2xl font-semibold text-[#0077b6] mb-4">Links Relacionados</h4>
          <ul className="space-y-4">
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://typo38.unesco.org/index.php?id=655"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                1st UNESCO Workshop on Greenhouse Status of Freshwater Reservoirs, Paris, Dec. 5-6 2006
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://www.hidroinformatica.org.br/workshop.php"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                2nd UNESCO Workshop on Greenhouse Status of Freshwater Reservoirs, Foz do Iguaçu, Oct. 4-7 2007
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://www.ana.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                ANA - Agência Nacional de Águas
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://cienciahoje.uol.com.br/controlPanel/materia/view/2416"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                Ciência Hoje - Rios da Amazônia liberam o triplo de CO2 estimado
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://clime.tkk.fi"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                CLIME - "Climate and Lake Impacts in Europe"
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://www.hcipub.com/hydrovision/index.asp"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                Hydrovision Conference 2008
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://www.ipcc.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                Intergovernmental Panel on Climate Change (IPCC)
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://www.hydropower.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                International Hydropower Association
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://www.nupem.biologia.ufrj.br"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                NUPEM/UFRJ - Núcleo de Pesquisas Ecológicas de Macaé
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://www.iie.com.br/biota.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                Perfil dos pesquisadores do IIEGA
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://www.dsr.inpe.br/dsr/grupos/hidrosfera/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                Programa HIDRO - Processos da Hidrosfera
              </a>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <a
                href="http://www.furnas.com.br/inovacao_ped_0102_46.asp"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-[#0077b6] hover:underline"
              >
                WebFurnas Inovação P&D (Innovation P&D) Ciclo 2001/2002
              </a>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default FurnasLink;
