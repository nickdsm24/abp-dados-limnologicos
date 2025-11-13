import React from "react";

const Publicacoes: React.FC = () => {
  return (
    <div className="font-sans bg-[#f3f8fb] text-gray-800 scroll-smooth">
      {/* Header da página */}
      <header className="bg-[#0077b6] text-white py-12 px-6 shadow-lg rounded-b-lg">
        <h1 className="text-3xl font-bold">Publicações e Materiais Relevantes</h1>
        <p className="text-sm mt-4 opacity-90 max-w-3xl mx-auto">
          Uma lista de publicações, matérias e resumos relacionados aos impactos dos
          reservatórios hidrelétricos sobre as emissões de gases de efeito estufa.
        </p>
      </header>

      {/* Conteúdo da página */}
      <main className="max-w-6xl mx-auto p-6 space-y-12">
        
        {/* Seção de Matérias 📰 */}
        <section>
          <h4 className="text-2xl font-semibold text-[#0077b6] mb-4">📰 Matérias</h4>
          <ul className="space-y-4">
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                As Muitas Faces de uma Lagoa - Ciência Hoje setembro de 1999
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Capacitação do Setor Elétrico Brasileiro em Relação à Mudança Global do Clima
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Energia Renovável e Limpa: Pesquisa revela que hidrelétricas de FURNAS emitem cem vezes menos gases de efeito estufa que termelétricas. Revista Furnas de junho de 2007
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                FURNAS inicia pesquisa de balanço de carbono em reservatórios - Linha Direta No 297 de 14 de junho de 2003
              </div>
            </li>
          </ul>
        </section>
        
        <hr className="border-gray-300"/>

        {/* Seção de Publicações em Revistas e Livros 📚 */}
        <section>
          <h4 className="text-2xl font-semibold text-[#0077b6] mb-4">📚 Publicações em Revistas e Livros</h4>
          <ul className="space-y-4">
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Carbon gas emission from the sediments of reservoirs of different ages in central Brazil
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - ABE, D. S. ; SIDAGIS-GALLI, C. ; ADAMS, D. D. ; CIMBLERIS, A. C. P. ; BRUM, P. R. ; TUNDISI, J. G. ; TUNDISI, T. M. ; MATSUMURA-TUNDISI, J. E. <br />
                In: Marco Aurélio dos Santos; Luiz Pinguelli Rosa. (Org.). Global Warming and Hydroelectric Reservoirs. 1 ed. Rio de Janeiro: COPPE/UFRJ e Eletrobrás, 2005, v. 1, p. 101-107
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Carbon gas cycling in the sediments of Serra da Mesa and Manso reservoirs, central Brazil
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - ABE, D. S. ; ADAMS, D. D. ; SIDAGIS-GALLI, C. ; CIMBLERIS, A. C. P. ; TUNDISI, J. G. <br />
                Verhandlungen - Internationale Vereinigung für Theoretische und Angewandte Limnologie, Stuttgart, v. 29, p. 567-572, 2005
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Princípios físicos e químicos a serviço da limnologia - um exercício
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - ASSIREU, A. T. ; STECH, J. L. ; MARINHO, M. M. ; CESAR, D. E. ; LORENZZETTI, J. A. ; FERREIRA, R. M. ; PACHECO, F. S. ; ROLAND, F. <br />
                In: Fábio Roland; Dionéia E. Cesar; Marcelo Marinho. (Org.). Lições de Limnologia. 1 ed. São Carlos: , 2005, p. 229-242
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Caminhos do fósforo em ecossistemas aquáticos continentais
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - FERREIRA, R. M. ; ROLAND, F. <br />
                In: Fábio Roland; Dionéia E. Cesar; Marcelo Marinho. (Org.). Lições de Limnologia. 1 ed. São Carlos: , 2005, p. 229-242
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Carbon dioxide and methane fluxes in the littoral zone of a tropical savanna reservoir (Corumbá, Brazil)
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - LIMA, I. B. T. ; MAZZI, E. A. ; NOVO, E. M. L. M. ; OMETTO, J. P. H. B. ; MELACK, J. M. ; RAMOS, F. M. ; RASERA, M. F. F. L. ; ABE, D. S. ; LORENZZETTI, J. A. ; ASSIREU, A. T. ; ROSA, R. R. ; ROLAND, F. ; CIMBLERIS, A. C. P. ; BRUM, P. R. ; SOARES, C. B. P. ; SOUMIS, N. ; STECH, J. L. <br />
                Submitted to Journal of Geophysical Research - Biogeosciences
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Photoacoustic/dynamic chamber method for measuring greenhouse gas fluxes in hydroreservoirs
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - LIMA, I. B. T. ; MAZZI, E. A. ; CARVALHO, J. C. ; OMETTO, J. P. H. B. ; RAMOS, F. M. ; STECH, J. L. ; NOVO, E. M. L. M. <br />
                Verhandlungen - Internationale Vereinigung für Theoretische und Angewandte Limnologie, Stuttgart, v. 29, p. 603-606, 2005
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Satellite ecohydrology and multifractals: perspectives for understanding and dealing with greenhouse gas emissions from hydroreservoirs
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - LIMA, I. B. T. ; STECH, J. L. ; RAMOS, F. M. <br />
                Relatório técnico - INPE
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                The use of remote sensing and automated water quality systems for estimating greenhouse gas emissions from hydroelectric reservoirs
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - LIMA, I. B. T. ; NOVO, E. M. L. M. ; STECH, J. L. ; LORENZZETTI, J. A. <br />
                In: Luiz Pinguelli Rosa; Marco Aurélio dos Santos; José Galizia Tundisi. (Org.). Greenhouse gas emissions from hydropower reservoirs and water quality. Rio de Janeiro: COPPE-UFRJ, 2004, p. 47-65
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Extreme event dynamics in methane ebullition fluxes from tropical reservoirs
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - RAMOS, F. M. ; LIMA, I. B. T. ; ROSA, R. R. ; MAZZI, E. A. ; CARVALHO, J. C. ; RASERA, M. F. F. L. ; OMETTO, J. P. H. B. ; ASSIREU, A. T. ; STECH, J. L. <br />
                Geophysical Research Letters, v. 33, L21404, doi:10.1029/2006GL027943, 2006
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Long term monitoring of greenhouse gas emissions at two brazilian hydro reservoirs
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - ROSA, L. P. ; SANTOS, M. A. ; MATVIENKO, B. ; SANTOS, E. O. ; SILVA, M. B. ; SIKAR, E. <br />
                In: Luiz Pinguelli Rosa; Marco Aurélio dos Santos; José Galízia Tundisi. (Org.). Greenhouse Gas Emissions from Hydropower Reservoirs and Water Quality. 1 ed. Rio de Janeiro: COPPE/UFRJ, 2004, v. 1, p. 121-136
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Carbon dioxide and methane emissions from hydroelectric reservoirs in Brazil
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - SANTOS, M. A. ; MATVIENKO, B. ; ROSA, L. P. ; SIKAR, E. <br />
                In: Marco Aurélio dos Santos; Luiz Pinguelli Rosa. (Org.). Global Warming and Hydroelectric Reservoirs. 1 ed. Rio de Janeiro: COPPE/UFRJ, 2005, v. 1, p. 81-94
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Global warming and hydroelectric reservoirs (Editores)
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - Editores: SANTOS, M. A. ; ROSA, L. P. <br />
                1. ed. Rio de Janeiro: COPPE/UFRJ, 2005. v. 1. 196 p. (Como um produto do encontro no SIL, foi lançado este livro com diversas contribuições dos integrantes do projeto)
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Gross greenhouse gas fluxes from hydro-power reservoir compared to thermo-power plants
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - SANTOS, M. A. ; ROSA, L. P. ; MATVIENKO, B. ; SIKAR, E. ; SANTOS, E. O. <br />
                Energy Policy, The Netherlands, v. 34, n. 1, p. 481-488, 2005
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Greenhouse gases and initial findings on the carbon circulation in two reservoirs and theis watersheds
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - SIKAR, E. ; SANTOS, M. A. ; MATVIENKO, B. ; SILVA, M. B. ; ALMEIDA, C. H. E. ; SANTOS, E. O. ; BENTES JUNIOR, A. P. ; ROSA, L. P. <br />
                Verhandlungen - Internationale Vereinigung für Theoretische und Angewandte Limnologie, Stuttgart, v. 29, n. 2, p. 573-576, 2005
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Caminhos do carbono em ecossistemas aquáticos continentais
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - VIDAL, L. O. ; MENDONÇA, R. F. ; MARINHO, M. M. ; ROLAND, F. <br />
                In: Fábio Roland; Dionéia E. Cesar; Marcelo Marinho. (Org.). Lições de Limnologia. 1 ed. São Carlos: Rima, 2005, p. 193-208
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Variability of carbon dioxide flux from tropical (Cerrado) hydroelectric reservoirs
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - ROLAND F. ; VIDAL L. O. ; PACHECO, F. S. ; BARROS, N. O. ; ASSIREU, A. T. ; OMETTO, J. P. H. B. ; CIMBLERIS, A. C. P. ; COLE, J. J. <br />
                Aquatic Sciences, v. 72, n. 3, p. 283-293, 2010
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Silicon as a permanent-carbon sedimentation tracer
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - Sikar E. ; Matvienko B. ; Santos M. A. ; Patchineelam S. R. ; Santos E. O. ; Silva M. B. ; Rocha C. H. E. D. ; Cimbleris A. C. P. ; Rosa L. P. <br />
                Inland Waters, v. 2, n. 3, p. 119-128, 2012
              </div>
            </li>
          </ul>
        </section>

        <hr className="border-gray-300"/>

        {/* Seção de Participações em Congressos 🗣️ */}
        <section>
          <h4 className="text-2xl font-semibold text-[#0077b6] mb-4">🗣️ Participações em Congressos</h4>
          <ul className="space-y-4">
            {/* ASLO - 2006. Victoria, Canada */}
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-bold text-lg text-gray-800 mb-2">ASLO - 2006. Victoria, Canada</div>
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-semibold text-[#0077b6]">Greenhouse gas concentrations and diffusive flux at the sediment-water interface from 5 tropical reservoirs in Brazil: trophic status consideration</span><br />
                  - ABE, D. S. ; SIDAGIS-GALLI, C. ; ADAMS, D. D. ; TUNDISI, J. G. ; MATSUMURA-TUNDISI, T. ; TUNDISI, J. E. ; CIMBLERIS, A. C. P. ; BRUM, P. R.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Carbon budget in two neotropical reservoirs</span><br />
                  - CIMBLERIS, A. C. P. ; BRUM, P. R. ; SOARES, C. B. ; ROLAND, F. ; CESAR, D. E. ; ROSA, L. P. ; SANTOS, M. A. ; SIKAR, B. M. ; TUNDISI, J. G. ; ABE, D. S.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Management strategies to minimize bacterial methane emission from tropical hydroreservoirs</span><br />
                  - LIMA, I. B. ; RAMOS, F. M. ; MAZZI, E. A. ; OMETTO, J. P. ; RASERA, M. F. ; ASSIREU, A. T. ; ROSA, R. R. ; NOVO, E. M. L. M. ; STECH, J. L.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Extreme event dynamics in methane bubbling from tropical reservoirs</span><br />
                  - RAMOS, F. M. ; LIMA, I. B. ; MAZZI, E. A. ; OMETTO, J. P. ; RASERA, M. F. ; ASSIREU, A. T. ; ROSA, R. R. ; STECH, J. L.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Heterotrophic pathways on carbon balance in tropical reservoirs</span><br />
                  - ROLAND, F. ; VIDAL, L. ; COLE, J. J. ; CIMBLERIS, A. C. P.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Land use-stream carbon fluxes relationship in a small watershed of a tropical hydro reservoir, Brazil</span><br />
                  - SANTOS, M. A. ; MATVIENKO, B. ; ROSA, L. P. ; SILVA, C. ; COSTA, R. S. ; SIKAR, E. ; ROCHA, C. H. ; SILVA, M. B. ; BENTES JUNIOR, A. P.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">The effect of cold fronts over the emission patterns of CO2 and CH4 in Brazilian Tropical Reservoirs</span><br />
                  - LORENZETTI, J. A. ; LIMA, I. B. ; ASIREU, A. T. ; STECH, J. L.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">The fitting of weibull pdf for surface winds observed in low latitude Brazilian lakes and hydroeletric reservoirs</span><br />
                  - STECH, J. L. ; ASSIREU, A. T. ; LORENZETTI, J. L. ; NOVO, E. M. L. M. ; LIMA, I. B. ; RAMOS, F.
                </p>
              </div>
            </li>
            
            {/* SIL - 2004. Lahti, Finland */}
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-bold text-lg text-gray-800 mb-2">SIL - 2004. Lahti, Finland (XXIX Congress of the International Association of Theoretical and Applied Limnology)</div>
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-semibold text-[#0077b6]">Carbon gas cycling in the sediments of Serra da Mesa and Manso reservoirs, central Brazil</span><br />
                  - ABE, D. S. ; ADAMS, D.D. ; SIDAGIS-GALLI, C. ; CIMBLERIS, A. C. P. ; TUNDISI, J. G.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Theoretical diffusive flux of greenhouse gases (CH4 & CO2) at the sediment-water interface from 24 lakes and reservoirs of different trophic status worldwide</span><br />
                  - ADAMS, D. D.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Carbon budget in hydroelectric reservoirs of Furnas Centrais Elétricas S.A., Brazil</span><br />
                  - CIMBLERIS, A. C. P. ; SANTOS, M. A. ; MATVIENKO, B. ; MOZETO, A. ; STECH, J. L. ; LIMA, I. B. T. ; TUNDISI, J. G. ; ABE, D. S. ; SIDAGIS-GALLI, C. V. ; ROLAND, F. ; CESAR, D. E. ; BRUM, P. R.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Carbon content in the zooplankton populations of Serra da Mesa Reservoir, Tocantins River, Brazil</span><br />
                  - MATSUMURA-TUNDISI, T.; TUNDISI, J. G.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Methane emission downstream of reservoirs</span><br />
                  - MATVIENKO, B. ; SANTOS, M. A. ; SIKAR, E. ; SILVA, M. B. ; ALMEIDA, C. H.E. ; SANTOS, E. O.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Preliminary results of photoacoustic/dynamic chamber technique for measuring greenhouse gas fluxes to the atmosphere from hydroelectric reservoirs in the brazilian savannah, cerrado</span><br />
                  - MAZZI, E. A. ; LIMA, I. B. T. ; CARVALHO, J. C. ; OMETTO, J. P. H. B. ; RAMOS, F. M. ; STECH, J. L. ; NOVO, E. M. L. M.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Greenhouse gases and the carbon circulation in a reservoir and its watershed</span><br />
                  - SANTOS, M. A. ; MATVIENKO, B. ; SIKAR, E. ; SILVA, M. B. ; ALMEIDA, C. H.E. ; SANTOS, E. O.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Sediment CH4 and CO2 concentrations and diffuse emission fluxes related to limnological factors in the Lobo-Broa reservoir, São Paulo State, Brazil</span><br />
                  - SIDAGIS-GALLI, C.; ADAMS, D. D.; ABE, D. S.; SIKAR, E.; TUNDISI, J. G.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Telemetric monitoring system for ecohydrology applications in aquatic environments</span><br />
                  - STECH, J. L. ; LIMA, I. B. T. ; NOVO, E. M. L. M. ; SILVA, C. M. ; ASSIREU, A. T. ; CARVALHO, J. C. ; LORENZZETTI, J. A. ; BARBOSA, C. C. ; ROSA, R. R.
                </p>
              </div>
            </li>

            {/* SIL - 2007. Montreal, Canada */}
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-bold text-lg text-gray-800 mb-2">SIL - 2007. Montreal, Canada (XXX Congress of the International Association of Theoretical and Applied Limnology)</div>
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-semibold text-[#0077b6]">Greenhouse gas emissions from natural ecosystems and reservoirs</span><br />
                  (Title of the congress theme, not a specific paper title)
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Carbon budget in seven Brazilian hydropower reservoirs</span><br />
                  - CIMBLERIS, A. C. P. ; BRUM, P. R. ; SOARES, C. B. P. ; ROLAND, F. ; ROSA, L. P. ; SANTOS, M. A. ; MATVIENKO, B. ; TUNDISI, J. G. ; ABE, D. S. ; GALLI, C. S. ; STECH, J. L. ; NOVO, E. M. L. M.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Greenhouse gas emissions downstream tropical hydroeletric reservoirs</span><br />
                  - DOS SANTOS, M. A. ; ROSA, L. P. ; MATVIENKO, B. ; DOS SANTOS, E. O. ; ROCHA, C. H. E. D’A. ; SIKAR, E. ; SILVA, M. B. ; JUNIOR, A. M. P. B.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Greenhouse gas concentrations and diffusive flux at the sediment-water interface from two reservoirs in Brazil</span><br />
                  - GALLI, C. S. ; ABE, D. S. ; TUNDISI, J.G. ; ADAMS, D. D. ; TUNDISI, T. M. ; TUNDISI, J. E. ; BRUM, P. R. ; CIMBLERIS, A. C. P.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Sunlight effects on diel CO2 and CH4 emissions from a tropical reservoirs</span><br />
                  - LIMA, I. B. T. ; CIMBLERIS, A. C. P. ; MAZZI, E. A. ; NOVO, E. M. L. M. ; OMETTO, J. P. H. B. ; RAMOS, F. M. ; ROSA, R. R. ; STECH, J. L.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Concentrarion profile at the air-water interface and its bearing on mentane flux measurement</span><br />
                  - MATVIENKO, B. ; SIKAR, E. ; DOS SANTOS, M. ; ROSA, L. ; SILVA, M. ; DOS SANTOS, E. ; ROCHA, C.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Evaluation of dissolved carbon dioxide and methane at three tropical hydroelectric</span><br />
                  - ROCHA, C. H. E. D’A. ; DOS SANTOS, M. A. ; MATVIENKO, B. ; ROSA, L. P. ; DOS SANTOS, E. O. ; SIKAR, E. ; SILVA, M. B. ; JUNIOR, A. M. P. B.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Contribution of planktonic respiration to greenhouse emissions in tropical reservoirs</span><br />
                  - ROLAND, F. ; HUSZAR, V. L. M. ; BARROS, N. O. ; FERREIRA, R. M. ; ASSIREU, A. T. ; CIMBLERIS, A. C. P. ; BRUM, P. R. ; COLE, J. J.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">The importance of land use changes analisys in the greenhouse gas emissions from hydroelectric reservoirs</span><br />
                  - SANTOS, E. ; SILVA, C. ; MATVIENKO, B. ; ROCHA, C. H. ; ROSA, L. P. ; SIKAR, E. ; SILVA, M. ; JUNIOR, A. B.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Tropical reservoirs are on average 2.7 times bigger carbon sinks than soils</span><br />
                  - SIKAR, E. ; MATVIENKO, B. ; DOS SANTOS,M. ; ROSA, L. ; SILVA, M. ; DOS SANTOS, E. ; ROCHA, C. ; JUNIOR, A. B.
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Does methane from hydro-reservoirs fiz out from the water upon turbine discharge?</span><br />
                  - SILVA, M. ; MATVIENKO, B. ; DOS SANTOS, M. ; SIKAR, E. ; ROSA, L. ; DOS SANTOS E. ; ROCHA, C.
                </p>
              </div>
            </li>

            {/* Outros Congressos */}
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-bold text-lg text-gray-800 mb-2">Outros Congressos</div>
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-semibold text-[#0077b6]">Existe relação entre a complexidade geométrica do entorno dos reservatórios e a variabilidade espacial dos parâmetros limnológicos?</span><br />
                  - ASSIREU, A. T. ; ROLAND, F. ; NOVO, E. M. L. M. ; BARROS, N. O. ; STECH, J. L. ; PACHECO, F. S. <br />
                  Anais XIII Simpósio Brasileiro de Sensoriamento Remoto, Florianópolis, Brasil, 21-26 abril 2007, p. 3263-3269
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Distribuição vertical do fitoplâncton nos reservatórios de Serra da Mesa (GO) e Manso (MT) no início do período de chuvas</span><br />
                  - SILVA, L. H. S. ; TRINDADE, T. N. ; ROLAND, F. ; CESAR, D. E. <br />
                  I Simpósio de Ecologia de Reservatórios, Avaré - SP, 2004
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Distribuição vertical do fitoplâncton nos reservatórios de Serra da Mesa (GO) e Manso (MT) em três períodos climatológicos</span><br />
                  - TRINDADE, T. N. <br />
                  VI Seminário de Iniciação Científica da Biologia da Universidade Gama Filho, RJ, 2004
                </p>
                <p>
                  <span className="font-semibold text-[#0077b6]">Dinâmica horizontal do fitoplâncton no reservatório de Corumbá (GO) em três períodos climatológicos</span><br />
                  - TRINDADE, T. N. ; SILVA, L. H. S. ; HUSZAR, V. L. M. ; ROLAND, F. ; CESAR, D. E. <br />
                  XI Congresso Brasileiro de Ficologia, Itajaí - SC, 2006
                </p>
                {/* XI Seminário de Iniciação Científica, Juiz de Fora - MG, 2004 */}
                <p className="font-bold mt-3">XI Seminário de Iniciação Científica, Juiz de Fora - MG, 2004:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><span className="font-semibold text-[#0077b6]">Variação da intensidade luminosa em dois reservatórios do sistema FURNAS</span><br />- BARROS, N. O. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Relação entre a densidade bacteriana e a concentração de oxigênio dissolvido na variação vertical de dois reservatórios recentes do sistema FURNAS Centrais Elétricas (UHE de Serra da Mesa – GO e APM de Manso – MT) no período de seca</span><br />- DEL'DUCA, A. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Variação espacial da densidade bacteriana nos reservatórios de Serra da Mesa e de Manso em diferentes épocas do ano</span><br />- DEL'DUCA, A. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Perfil vertical da condutividade elétrica em dois reservatórios do sistema FURNAS</span><br />- DUQUE-ESTRADA, C. H. E. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Variação Nictemeral no início do período de estiagem no reservatório de Manso (MT)</span><br />- DUQUE-ESTRADA, C. H. E. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Variação nas taxas de produção fitoplanctônica em dois reservatórios do sistema FURNAS</span><br />- FERREIRA, R. M. ; BASSOLI-ROSA, F. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Respiração planctônica em dois reservatórios do sistema FURNAS</span><br />- FERREIRA, R. M. ; VIDAL, L. O. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Contribuição das bactérias heterotróficas para o estoque de carbono em reservatórios tropicais</span><br />- LOBÃO, L. M. ; ALFENAS, G. F. M. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Perfil vertical da produção bacteriana em dois reservatórios do sistema FURNAS</span><br />- LOBÃO, L. M. ; ALFENAS, G. F. M. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Estudo qualitativo e quantitativo do processo de sedimentação em dois reservatórios do sistema FURNAS</span><br />- MENDONÇA, R. F. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Avaliação da eficiência de métodos de preservação de amostras para análises de carbono</span><br />- MENDONÇA, R. F. ; MARINHO, M. M. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Concentração de Fósforo em dois reservatórios do sistema FURNAS</span><br />- NOYMA, N. P. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Concentração de Silicato em dois reservatórios do sistema FURNAS</span><br />- NOYMA, N. P. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Análise e comparação de carbono orgânico total em dois reservatórios do sistema FURNAS de geração de energia elétrica</span><br />- PACHECO, F. S. ; CESAR, D. E. ; ROLAND, F.</li>
                  <li><span className="font-semibold text-[#0077b6]">Variação Nictemeral de fatores abióticos no reservatório da UHE de Serra da Mesa/GO</span><br />- PACHECO, F. S. ; CESAR, D. E. ; ROLAND, F.</li>
                </ul>
                {/* X Congresso Brasileiro de Limnologia, Ilhéus - BA, 2005 */}
                <p className="font-bold mt-3">X Congresso Brasileiro de Limnologia, Ilhéus - BA, 2005:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><span className="font-semibold text-[#0077b6]">Bactérias heterotróficas: um passeio por seis reservatórios tropicais</span><br />- DEL'DUCA, A. ; ROLAND, F. ; CESAR, D. E.</li>
                  <li><span className="font-semibold text-[#0077b6]">Determinação do Carbono Inorgânico Dissolvido (DIC): avaliação da eficiência dos métodos direto e indireto</span><br />- MARINHO, M. M. ; MENDONÇA, R.F. ; ROLAND, F..</li>
                  <li><span className="font-semibold text-[#0077b6]">Metabolismo planctônico em dois reservatórios do sistema FURNAS – reservatório de Serra da Mesa (GO) e de Manso (MT)</span><br />- MELLO, M. ; CESAR, D. E. ; ROLAND, F..</li>
                  <li><span className="font-semibold text-[#0077b6]">Dinâmica dos estoques de carbono orgânico e inorgânico em reservatórios de diferentes idades</span><br />- MENDONÇA, R. F. ; MARINHO, M. M. ; ROLAND, F..</li>
                  <li><span className="font-semibold text-[#0077b6]">Concentrações de clorofila e biomassa fitoplanctônica em diferentes profundidades em um reservatório de FURNAS Centrais Elétricas S.A. no início do período de chuvas</span><br />- PACHECO, F. S. ; ROLAND, F. ; CESAR, D. E..</li>
                  <li><span className="font-semibold text-[#0077b6]">Dinâmica dos sólidos suspensos em reservatórios: entrada e processamento do material alóctone</span><br />- ROLAND, F. ; MENDONÇA, R. F..</li>
                  <li><span className="font-semibold text-[#0077b6]">Avaliação da biomassa (conteúdo de carbono) de Rotifera no reservatório de Manso (MT), Brasil</span><br />- ROSA, P. G. ; BRANCO, C. W. C. ; ROLAND, F..</li>
                  <li><span className="font-semibold text-[#0077b6]">Variação da densidade relativa zooplanctônica, em três épocas distintas, do reservatório de UHE Serra da Mesa (GO), Brasil</span><br />- ROSA, P. G. ; BRANCO, C. W. C. ; ROLAND, F..</li>
                  <li><span className="font-semibold text-[#0077b6]">Dinâmica do fitoplâncton no reservatório de Manso (MT)</span><br />- SILVA, L. H. S. ; TRINDADE, T. N. ; HUSZAR, V. L. M. ; ROLAND, F. ; CESAR, D. E..</li>
                  <li><span className="font-semibold text-[#0077b6]">Dinâmica do fitoplâncton no reservatório de Serra da Mesa (GO)</span><br />- TRINDADE, T. N. ; SILVA, L. H. S. ; HUSZAR, V. L. M. ; ROLAND, F. ; CESAR, D. E..</li>
                </ul>
              </div>
            </li>
          </ul>
        </section>

        <hr className="border-gray-300"/>

        {/* Seção de Resumos Publicados 📑 */}
        <section>
          <h4 className="text-2xl font-semibold text-[#0077b6] mb-4">📑 Resumos Publicados</h4>
          <ul className="space-y-4">
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Trophic classifications between temperate and tropical aquatic ecosystems: is such terminology unrealistic for sedimentary carbon cycling?
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - ABE, D. S. ; ADAMS, D. D. ; SIDAGIS-GALLI, C. ; TUNDISI, J. G. ; CIMBLERIS, A. C. P. ; BRUM, P. R. <br />
                In: 11th World Lakes Conference - Management of Lake Basins for their Sustainable Use: Global Experience and African Issues, 2005, Nairobi. 11th World Lakes Conference - Abstracts Volume. Nairobi : PASS, University of Nairobi, 2005. v. 1. p. 105-105
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Carbon budget in hydroelectric reservoirs of FURNAS Centrais Elétricas, Brazil
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - CIMBLERIS, A. C. P. ; SANTOS, M. A. ; MATVIENKO, B. ; STECH, J. L. ; LIMA, I. B. T. ; TUNDISI, J. G. ; ABE, D. S. ; SIDAGIS-GALLI, C. V. ; ROLAND, F. ; CESAR, D. E. ; BRUM, P. R. <br />
                Proceedings of the International Association of Theoretical and Applied Limnology, v. 29, p. 563, 2005
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Concentração de oxigênio e suas implicações na estrutura e metabolismo bacteriano no reservatório de Serra da Mesa/GO
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - DEL'DUCA, A. ; CESAR, D. E. ; ROLAND, F. <br />
                XXIII Brazilian Congress of Microbiology, Santos - SP, Brazil, 2005
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Ferramentas para abrir uma caixa, ainda, nebulosa
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - DEL'DUCA, A. ; ROLAND, F. ; CESAR, D. E. <br />
                X Brazilian Congress of Limnology, Ilhéus - BA, Brazil, 2005
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Carbon budget in two neotropical reservoirs
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - ROLAND, F. ; BRUM, P. R. ; SOARES, C. B. ; CESAR, D. E. ; ROSA, L. P. ; SANTOS, M. A. ; SIKAR, B. M. ; TUNDISI, J. G. ; ABE, D. S. ; STECH, J. L. ; NOVO, E. M. L. M. <br />
                In: ASLO - Aquatic Sciences Meeting, 2006, Victoria
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Heterotrophic pathways on carbon balance in tropical reservoirs
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - ROLAND, F. ; VIDAL, L. ; COLE, J. J.; CIMBLERIS, A. C. P. <br />
                In: ASLO - Aquatic Sciences Meeting, 2006, Victoria
              </div>
            </li>
          </ul>
        </section>

        <hr className="border-gray-300"/>

        {/* Seção de Monografias 🎓 */}
        <section>
          <h4 className="text-2xl font-semibold text-[#0077b6] mb-4">🎓 Monografias</h4>
          <ul className="space-y-4">
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Comunidade zooplanctônica de quatro reservatórios do centro-oeste do Brasil: abundância e biomassa em carbono
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - ROSA, P. G. <br />
                Trabalho de Conclusão de Curso (Graduação em Ciências Biológicas) - Universidade Federal do Estado do Rio de Janeiro, 2005
              </div>
            </li>
            <li className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="font-semibold text-lg text-[#0077b6]">
                Dinâmica horizontal do fitoplâncton no reservatório de Serra da Mesa (GO) em três períodos climatológicos
              </div>
              <div className="text-sm mt-2 text-gray-700">
                - Trindade, T. N. <br />
                Trabalho de Conclusão de Curso (Graduação em Ciências Biológicas) - Universidade Federal do Estado do Rio de Janeiro, 2007
              </div>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Publicacoes;