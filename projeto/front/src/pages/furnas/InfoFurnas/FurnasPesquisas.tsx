import React from "react";

const FurnasPesquisas: React.FC = () => {
  return (
    // Fundo branco (white) ou cinza claro (gray-50), com fonte de texto mais escura e legível (gray-900).
    <div className="font-sans bg-white text-gray-900 min-h-screen">
      {/* Header da página: Cor primária Furnas/Energia (azul mais escuro) */}
      <header className="bg-[#0077b6] text-white py-10 px-4 sm:px-6 shadow-lg">
      </header>

      {/* Conteúdo da página */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <h4 className="text-2xl font-bold mb-6 mt-4 border-b-2 border-blue-400 pb-2 text-blue-400">
          Artigos de Pesquisa Relevantes
        </h4>
        
        {/* Lista de Artigos: Melhorando a legibilidade e espaçamento da lista */}
        <ul className="list-none space-y-6">
          {/* Mapeie seus dados de pesquisa aqui se fossem dinâmicos */}
          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              The Third Assessment Report of the Intergovernmental Panel on Climate Change
            </strong>
            <span className="text-sm text-gray-500">
              IPCC 2001 - <a href="http://www.ipcc.ch" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-400 font-medium hover:underline">IPCC</a>
            </span>
          </li>
          
          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Sediment greenhouse gases (methane and carbon dioxide) in the Lobo-Broa Reservoir, São Paulo State, Brazil: Concentrations and diffuse emission fluxes for carbon budget considerations
            </strong>
            <span className="text-gray-700 block mt-1">
              ABE, D. S. ; ADAMS, D. D. ; GALLI, C. V. S. ; SIKAR, E. ; TUNDISI, J. G.
            </span>
            <em className="text-sm text-gray-500">
              Lakes & Reservoirs: Research and Management, 10: 201-209, 2005
            </em>
          </li>
          
          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              A comparison of the carbon balances of a natural lake (L. O. rtra.sket) and a hydroelectric reservoir (L.Skinnmuddselet) in northern Sweden
            </strong>
            <span className="text-gray-700 block mt-1">
              ABERG, JAN ; BERGSTROM, ANN-K. ; ALGESTEN, G. ; DERBACK, G. ; JANSSON, M.
            </span>
            <em className="text-sm text-gray-500">
              Water Research, 38, 531-538, 2004
            </em>
          </li>
          {/* Adicione os demais itens da lista com o novo estilo de <li> */}
          {/* O código anterior da lista foi mantido, mas aplicado o novo estilo. */}
          
          {/* Início dos itens copiados/adaptados para o novo estilo */}
          
          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              CH4 e CO2 emissions and carbon imbalance in a 10-years old tropical reservoir (Petit-Saut, French Guiana)
            </strong>
            <span className="text-gray-700 block mt-1">
              ABRIL, G. ; GUÉRIN, F. ; RICHARD, S. ; DELMAS, R. ; GALY-LACAUX, C. ; TREMBLAY, A. ; VARFALVY, L. ; GOSSE, P. ; SANTOS, M. A. ; MATVIENKO, B.
            </span>
            <em className="text-sm text-gray-500">
              Global Biogeochemical Cycles, 19, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              In situ measurements of dissolved gases (CO2 and CH4) in a wide range of concentrations in a tropical reservoir using an Equilibrator
            </strong>
            <span className="text-gray-700 block mt-1">
              ABRIL, G. ; RICHARD, S. ; GUÉRIN, F.
            </span>
            <em className="text-sm text-gray-500">
              Science of the Total Environment 354, 246-251, 2006
            </em>
            <a href="https://www.elsevier.com/locate/scitotenv" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-400 font-medium hover:underline text-sm mt-1 block">Link</a>
          </li>
          
          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Aquatic cycling and hydrosphere to troposphere transport of reduced gases - A review
            </strong>
            <span className="text-gray-700 block mt-1">
              ADAMS, D. D.
            </span>
            <em className="text-sm text-gray-500">
              In: D. D. Adams, S. P. Seitzinger and P. M. Crill, Mitteilungen (Communications) No. 25, International Association of Theoretical and Applied Limnology (SIL). Publisher: E. Schweizerbart'sche Verlagsbuchhandlungen, Stuttgart, Germany, pp. 1-13, 1996
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Methane, carbon dioxide and nitrogen gases in the surficial sediments of two Chilean reservoirs - diffusive fluxes at the sediment water interface
            </strong>
            <span className="text-gray-700 block mt-1">
              ADAMS, D. D.
            </span>
            <em className="text-sm text-gray-500">
              Dams and Climate Change, Luiz P. Rosa and Marco A. dos Santos, eds.; Proceedings of International Workshop on Hydrodams, Lakes and Greenhouse Gas Emissions, COPPE-UFRJ, Rio de Janeiro, Brazil, pp. 50-77, 1999
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Reservoirs and Greenhouse Gases
            </strong>
            <span className="text-gray-700 block mt-1">
              ADAMS, D. D. ; DELMAS, R. ; LE, M. ; VARFALVY L. ; NOVO, E. M. L. M. ; GOSSE P. ; BOON, P.
            </span>
            <em className="text-sm text-gray-500">
              Reservoirs and Greenhouse Gases, special session 42 at Societas Internationalis Limnologiae, Monash University, Melbourne, Australia, 2001
            </em>
          </li>
          
          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Gases in the sediments of two eutrophic Chilean reservoirs: potential sediment oxygen demand and sediment-water flux of CH4 and CO2 before and after an El Niño event
            </strong>
            <span className="text-gray-700 block mt-1">
              ADAMS, D. D. ; VILA, I. ; PIZARRO, J. ; SALAZAR, C.
            </span>
            <em className="text-sm text-gray-500">
              Verh. Internat. Verein. Limnol., 27:1376-1381, 2000
            </em>
          </li>
          
          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Investigating Ebullition in a Sand Column Using Dissolved Gas Analysis and Reactive Transport Modeling
            </strong>
            <span className="text-gray-700 block mt-1">
              AMOS, R. ; YER, K.
            </span>
            <em className="text-sm text-gray-500">
              Environmental Science Technology, 40, 5361-5367, 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Mitigation and recovery of methane emissions from tropical hydroelectric dams
            </strong>
            <span className="text-gray-700 block mt-1">
              BAMBACE, L. A. W. ; RAMOS, F. M. ; LIMA, I. B. T. ; ROSA R. R.
            </span>
            <em className="text-sm text-gray-500">
              Energy, 32, 1038-1046, 2007
            </em>
            <a href="https://www.elsevier.com/locate/energy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-400 font-medium hover:underline text-sm mt-1 block">Link</a>
          </li>
          
          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Measurement of Methane Oxidation in Lakes: A Comparison of Methods
            </strong>
            <span className="text-gray-700 block mt-1">
              BASTVIKEN, D. ; NEJLERTSSON, J. ; TRANVIK, L.
            </span>
            <em className="text-sm text-gray-500">
              Environmental. Science & Technology, 36, 3354-3361, 2004
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Estimating production of heterotrophic bacterioplankton via incorporation of tritiated thymidine
            </strong>
            <span className="text-gray-700 block mt-1">
              BELL, R. T.
            </span>
            <em className="text-sm text-gray-500">
              In: P.F. Kemp, B. F. Sherr, E.B. Sherr and J.J. Cole (eds) Handbook of Methods in Aquatic Microbial Ecology. Lewis. 1993
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Emission of CO2 from hydroelectric reservoirs in northern Sweden
            </strong>
            <span className="text-gray-700 block mt-1">
              BERGSTRÖM, ANN-K. ; ALGESTEN, G. ; SOBEK, S. ; TRANVIK, L. ; JANSSON, M.
            </span>
            <em className="text-sm text-gray-500">
              Arch. Hydrobiol., 159 1 25-42, 2004
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Experimenting with hydroelectric reservoirs: researchers created reservoirs in Canada to explore the impacts of hydroelectric developments on greenhouse gas and methylmercury production
            </strong>
            <span className="text-gray-700 block mt-1">
              BODALY, R. A. ; BEATY, K. G. ; HENDZEL, L. ; MAJEWSKI, A. R. ; PATERSON, M. J. ; ROLFHUS, K. R. ; PENN, A. F. ; ST. LOUIS, V. L. ; HALL, B. ; MATTHEWS, C. J. D. ; CHEREWYK, K. ; MAILMAN, M. ; PHURLEY, J. ; CHIFF, S. S. ; VENKITESWARAN, J. J.
            </span>
            <em className="text-sm text-gray-500">
              Environmental Science & Technology, 347-352, 2004
            </em>
          </li>
          
          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Carbon cycling in Australian wetlands: the importance of methane
            </strong>
            <span className="text-gray-700 block mt-1">
              BOON P. I.
            </span>
            <em className="text-sm text-gray-500">
              Verh. Internat. Verein. Limnol., 27:37-50, 2000
            </em>
          </li>
          
          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Fluxes of methane and carbon dioxide from a small productive lake to the atmosphere
            </strong>
            <span className="text-gray-700 block mt-1">
              CASPER, P. ; MABERLY, S. C. ; HALL, G. H. ; FINLAY, B. J.
            </span>
            <em className="text-sm text-gray-500">
              Biogeochemistry, 49:1-19, 2000
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Planktonic bacterial respiration as a function of C:N:P ratios across temperate lakes
            </strong>
            <span className="text-gray-700 block mt-1">
              CIMBLERIS, A. C. P. ; KALFF, J.
            </span>
            <em className="text-sm text-gray-500">
              Hydrobiologia, 384:89-100, 1998
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Carbon in catchments: connecting terrestrial carbon losses with aquatic metabolism
            </strong>
            <span className="text-gray-700 block mt-1">
              COLE, J. J. ; CARACO, N. F.
            </span>
            <em className="text-sm text-gray-500">
              Marine and Freshwater Research. 52:101-110, 2001
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Carbon dioxide supersaturation in the surface waters of lakes
            </strong>
            <span className="text-gray-700 block mt-1">
              COLE, J. J. ; CARACO, N. F. ; KLING, G. W. ; KRATZ, T. K.
            </span>
            <em className="text-sm text-gray-500">
              Science, 265:1568-1570, 1994
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Persistence of net heterotrophy in lakes during nutrient addition and food web manipulations
            </strong>
            <span className="text-gray-700 block mt-1">
              COLE, J. J. ; PACE; M. L. ; CARPENTER, S. R. ; KITCHELL, J. F.
            </span>
            <em className="text-sm text-gray-500">
              Limnol. Oceanogr. 45(8):1718-1730, 2000
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              The Dam Debate And Its Discontents
            </strong>
            <span className="text-gray-700 block mt-1">
              CULLENWARD, D. ; VICTOR, D. G.
            </span>
            <em className="text-sm text-gray-500">
              Editorial Comment , Climatic Change, 75: 81-86, 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Sources and transfers of particulate organic matter in a tropical reservoir ( Petit Saut, French Guiana): a multitracers analysis using d13C, C/N ratio and pigments
            </strong>
            <span className="text-gray-700 block mt-1">
              DEJUNET, A. ; ABRIL, G. ; GUÉRIN, F. ; WIT, R.
            </span>
            <em className="text-sm text-gray-500">
              Submitted December 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Respiration rates in bacteria exceed phytoplankton production in unproductive aquatic systems
            </strong>
            <span className="text-gray-700 block mt-1">
              DEL GIORGIO, P. A. ; COLE, J. J. ; CIMBLERIS, A.
            </span>
            <em className="text-sm text-gray-500">
              Nature 385:148-151
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Emission of greenhouse gases from the tropical hydroelectric reservoir of Petit Saut (French Guiana) compared with emissions from thermal alternatives
            </strong>
            <span className="text-gray-700 block mt-1">
              DELMAS, R. ; GALY-LACAUX, C. ; RICHARD, S.
            </span>
            <em className="text-sm text-gray-500">
              Global Biogeochemical Cycles, 15, 993-1003, 2001
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Greenhouse gas emissions from hydroelectric dams in the tropics: a case study in French Guiana
            </strong>
            <span className="text-gray-700 block mt-1">
              DELMAS, R. ; RICHARD, S. ; GALY-LACAUX, C. ; GUÉRIN, F. ; DELON, C.
            </span>
            <em className="text-sm text-gray-500">
              ILEAPS - International Open Science Conference, Helsinki, Finland, 73-78, 2003
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Long term greenhouse gas emissions from the hydroelectric reservoir of Petit Saut (French Guiana) and potencial impacts
            </strong>
            <span className="text-gray-700 block mt-1">
              DELMAS, R. ; RICHARD, S. ; GUÉRIN, F. ; ABRIL, G. ; GALY-LACAUX, C. ; DELON, C ; GRÉGOIRE, A.
            </span>
            <em className="text-sm text-gray-500">
              In: Greenhouse gases emissions from natural environments and hydroelectric reservoirs: fluxes and processes, A. Tremblay, L. Varfalvy, C. Roehm and M. Garneau (Eds) Springer-Verlag, 293-312
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Greenhouse Gas Emissions from Energy Systems: Comparision and Overview
            </strong>
            <span className="text-gray-700 block mt-1">
              DONES, R. ; HECK, T. ; HIRSCHBERG, S.
            </span>
            <em className="text-sm text-gray-500">
              In PSI Annual Report, Annex IV, Paul Scherrer Institut, Villigen, Switzerland, 27-40, 2003
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              CH4 emissions from flooded land: Basis for future methodological development
            </strong>
            <span className="text-gray-700 block mt-1">
              DUCHEMIN, E. ; HUTTUNEN, J. T. ; TREMBLAY, A. ; DELMAS, R. ; MENEZES, C. F. S.
            </span>
            <em className="text-sm text-gray-500">
              IGES, Kanagawa, Japan, pp. Ap3.1 - Ap3.8
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Possible approach for estimating CO2 emissions from lands converted to permanently flooded land: Basis for future methodological development
            </strong>
            <span className="text-gray-700 block mt-1">
              DUCHEMIN, E. ; HUTTUNEN, J. T. ; TREMBLAY, A. ; DELMAS, R. ; MENEZES, C. F. S.
            </span>
            <em className="text-sm text-gray-500">
              IGES, Kanagawa, Japan, pp. Ap2.1 - Ap2.9
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Comparison of static chamber and Boundary Layer Equation methods for measuring greenhouse gas emissions from large water bodies
            </strong>
            <span className="text-gray-700 block mt-1">
              DUCHEMIN, E. ; LUCOTTE, M. ; CANUEL, R.
            </span>
            <em className="text-sm text-gray-500">
              Environmental Science & Technology, 33:350-357, 1999
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Production of greenhouse gases CH4 and CO2 by hydroelectric reservoirs of the boreal region
            </strong>
            <span className="text-gray-700 block mt-1">
              DUCHEMIN, E. ; LUCOTTE, M. ; CANUEL, R.
            </span>
            <em className="text-sm text-gray-500">
              Global Biogeochemical Cycles, vol 9, no 4, p. 529-540, 1995
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Comparison of greenhouse gas emissions from an old tropical reservoir with those from other reservoirs worldwide
            </strong>
            <span className="text-gray-700 block mt-1">
              DUCHEMIN, E. ; LUCOTTE, M. ; CANUEL, R. ; QUEIROZ, A. G. ; ALMEIDA, D. C. ; PEREIRA, H. C. ; DEZINCOURT, J.
            </span>
            <em className="text-sm text-gray-500">
              Verh. Internat. Verein. Limnol., 27:1391-1395, 2000
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              First assessment of methane and carbon dioxide emissions from shallow and deep zones of boreal reservoirs upon ice break-up
            </strong>
            <span className="text-gray-700 block mt-1">
              DUCHEMIN, E. ; LUCOTTE, M. ; CANUEL, R. ; SOUMIS, N.
            </span>
            <em className="text-sm text-gray-500">
              Lakes & Reservoirs: Research and Management, 11: 9-19, 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Influence of light intensity on methanotrophic bacterial activity in the Petit Saut reservoir, French Guiana
            </strong>
            <span className="text-gray-700 block mt-1">
              DUMESTRE, J. F. ; GUEZENNEC, J. ; GALY-LACAUX, C. ; DELMAS, R. ; RICHARD, S. ; LABROUE, L.
            </span>
            <em className="text-sm text-gray-500">
              Applied and Environmental Microbiology, 65, 534 - 539, 1999
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Greenhouse gas emissions from hydroelectric reservoir (Brazil's Tucuruí dam) and the energy policy implications
            </strong>
            <span className="text-gray-700 block mt-1">
              FEARNSIDE, P.
            </span>
            <em className="text-sm text-gray-500">
              Water, Air and Soil Pollution, 133:69-96, 2002
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Do hydroelectric dams mitigate globalwarming? The case of Brazil's Curuí-Una dam
            </strong>
            <span className="text-gray-700 block mt-1">
              FEARNSIDE, P. M.
            </span>
            <em className="text-sm text-gray-500">
              Mitigation and Adaptation Strategies for Global Change, 10: 675-691, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Environmental impacts of Brazil's Tucuruí dam: unlearned lessons for hydroelectric development in Amazonia
            </strong>
            <span className="text-gray-700 block mt-1">
              FEARNSIDE, P. M.
            </span>
            <em className="text-sm text-gray-500">
              Environmental Management, 27 (3): 377-396, 2001
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Greenhouse gas emissions from hydroelectric dams: controversies provide a springboard for rethinking a supposedly 'clean' energy source
            </strong>
            <span className="text-gray-700 block mt-1">
              FEARNSIDE, P. M.
            </span>
            <em className="text-sm text-gray-500">
              Climatic Change 66: 1-8, 2004
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Greenhouse-gas emissions from Amazonian hydroelectric reservoirs: the example of Brazil's Tucuruí dam as compared to fossil fuel alternatives
            </strong>
            <span className="text-gray-700 block mt-1">
              FEARNSIDE, P. M.
            </span>
            <em className="text-sm text-gray-500">
              Environmental Conservation, 24 (1): 64-75, 1997
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              A headspace equilibration technique for measurement of dissolved gases in sediment pore water
            </strong>
            <span className="text-gray-700 block mt-1">
              FENDINGER, N. J. ; ADAMS, D. D.
            </span>
            <em className="text-sm text-gray-500">
              Intern. J. Environ. Anal. Chem., 23:253-265, 1986
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Methane and oxygen dynamics in a shallow floodplain lake: the significance of periodic stratification
            </strong>
            <span className="text-gray-700 block mt-1">
              FORD, P. W. ; BOON, P. I. ; LEE, K.
            </span>
            <em className="text-sm text-gray-500">
              Hydrobiologia, 485: 97-110, 2002
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Greenhouse gas emissions from hydropower: The state of research in 1996
            </strong>
            <span className="text-gray-700 block mt-1">
              GAGNON, L. ; VATE, VAN DE J. F.
            </span>
            <em className="text-sm text-gray-500">
              Energy Policy, 25,(I),7-13, 1997
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Gaseuos emission and oxygen consumption in hydroelectric dams. A case study in French Guiana
            </strong>
            <span className="text-gray-700 block mt-1">
              GALY-LACAUX, C. ; DELMAS, R. ; DUMESTRE, J. F. ; LABROUE, L. ; GOSSE, P.
            </span>
            <em className="text-sm text-gray-500">
              Global Biogeochemical Cycles, 11, 471-483, 1997
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Long term greenhouse gas emissions from hydroelectric reservoirs in tropical forest regions
            </strong>
            <span className="text-gray-700 block mt-1">
              GALY-LACAUX, C. ; DELMAS, R. ; KOUADIO, G. ; RICHARD, S. ; GOSSE, P.
            </span>
            <em className="text-sm text-gray-500">
              Global Biogeochemical Cycles, 13, 503-517, 1999
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Emission de Méthane et consommation d'oxygène dans le retenue de Petit Saut en Guyane
            </strong>
            <span className="text-gray-700 block mt-1">
              GALY-LACAUX, C. ; JAMBERT, C. ; DELMAS, R. ; DUMESTRE, J. F. ; LABROUE, L. ; CERDAN, P. ; RICHARD, S.
            </span>
            <em className="text-sm text-gray-500">
              Comptes Rendus de I
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Evolution and relationship between 3 dissolved gases (oxygen, methane, and carbon dioxide) over a 10-year period (1994-2003) in a river downstream of a new intertropical dam
            </strong>
            <span className="text-gray-700 block mt-1">
              GOSSE, P. ; ABRIL, G. ; GUÉRIN, F. ; RICHARD, S. ; DELMAS, R.
            </span>
            <em className="text-sm text-gray-500">
              Verhandlungen der Internationalen Vereinigung für Theoretische und Angewandte Limnologie, 29, 594-600, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Evolution and relationships of greenhouse gases and dissolved oxygen during 1994-2003 in a river downstream of a tropical reservoir
            </strong>
            <span className="text-gray-700 block mt-1">
              GOSSE, P. ; ABRIL, G. ; GUERIN, F. ; RICHARD, S. ; DELMAS, R.
            </span>
            <em className="text-sm text-gray-500">
              Verhandlungen der Internationalen Vereinigung für Theoretische und Angewandte Limnologie, 29, 594-600, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Emission of CO2, CH4 and N2O from lakeshore soils in an Antarctic dry valley
            </strong>
            <span className="text-gray-700 block mt-1">
              GREGORICH, E. G. ; HOPKINS, D. W. ; ELBERLING, B. ; SPARROW, A. D. ; NOVIS, P. ; GREENFIELD, L. G. ; ROCHETTE, P.
            </span>
            <em className="text-sm text-gray-500">
              Soil Biology & Biochemistry, 38, 3120-3129, 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Production of carbon dioxide and methane by flooded tropical soils during anoxic incubations: Implication for atmospheric emissions from a hydroelectric reservoir (Petit Saut, French Guiana)
            </strong>
            <span className="text-gray-700 block mt-1">
              GUÉRIN, F. ; ABRIL, G. ; DEJUNET, A. ; DELMAS, R.
            </span>
            <em className="text-sm text-gray-500">
              Under preparation
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Methane and carbon emissions from tropical reservoirs: significance of downstream rivers
            </strong>
            <span className="text-gray-700 block mt-1">
              GUÉRIN, F. ; ABRIL, G. ; RICHARD, S. ; BURBAN, B. ; REYNOUARD, C. ; SEYLER, P. ; DELMAS, R.
            </span>
            <em className="text-sm text-gray-500">
              Geophysical Research Letters, 33, L21407, 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Gas transfer velocities measured by eddy correlations and floating chambers techniques in tropical reservoir
            </strong>
            <span className="text-gray-700 block mt-1">
              GUÉRIN, F. ; ABRIL, G. ; SERÇA, D. ; DELON, C. ; RICHARD, S. ; DELMAS, R. ; TREMBLAY, A. ; VARFALVY, L.
            </span>
            <em className="text-sm text-gray-500">
              SOLAS Newsletter, 2, 7, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Gas transfer velocities of CO2 and CH4 in a tropical reservoir and its river downstream
            </strong>
            <span className="text-gray-700 block mt-1">
              GUÉRIN, F. ; ABRIL, G. ; SERÇA, D. ; DELON, C. ; RICHARD, S. ; DELMAS, R. ; TREMBLAY, A. ; VARFALVY, L.
            </span>
            <em className="text-sm text-gray-500">
              Journal of Marine Systems, 66, 161-172, 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Contribution of winter to the annual CH4 emission from a eutrophied boreal lake
            </strong>
            <span className="text-gray-700 block mt-1">
              HUTTUNEN, J. T. ; ALM, J. ; SAARIJARVI, E. ; LAPPALAINEN, K. M. ; SILVOLA, J. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Chemosphere, 50, 247-250, 2003
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Fluxes of methane, carbon dioxide and nitrous oxide in boreal lakes and potential anthropogenic effects on the aquatic greenhouse gas emissions
            </strong>
            <span className="text-gray-700 block mt-1">
              HUTTUNEN, J. T. ; ALM, J. ;, LIIKANEN, A. ; JUUTINEN, S. ; LARMOLA, T. ; HAMMAR, T. ; SILVOLA, J. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Chemosphere, 52, 609-621, 2003
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Long-term effects of boreal reservoirs on the landscape-atmosphere N2O exchange
            </strong>
            <span className="text-gray-700 block mt-1">
              HUTTUNEN, J. T. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Verhandlungen der Internationalen Vereinigung für Theoretische und Angewandte Limnologie, 29, 607-611, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Long-term effects of nortern reservoirs on the landscape-scale CH4 and N2O exchanges
            </strong>
            <span className="text-gray-700 block mt-1">
              HUTTUNEN, J. T. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Report Series in Aerosol Science No. 81A. Yliopistopaino, Helsinki, 197-201, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Long-term net methane release from finish hydro reservoirs
            </strong>
            <span className="text-gray-700 block mt-1">
              HUTTUNEN, J. T. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Global Warming and Hydroeletric Reservoirs, op. cit., pp. 125-135, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Methane emissions from natural peatlands on the northern boreal zone on Finland, Fennoscandia
            </strong>
            <span className="text-gray-700 block mt-1">
              HUTTUNEN, J. T. ; NYKÄNEN, H. ; TURUNEN, J. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Atmospheric Environment 37, 147-151, 2003
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Fluxes of nitrous oxide on natural peatlands in Vuotos, an area projected for a hydroelectric reservoir in northern Finland
            </strong>
            <span className="text-gray-700 block mt-1">
              HUTTUNEN, J. T. ; NYKÄNEN, H. ; TURUNEN, J. ; NENONEN, O. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              SUO, 53, 87-96, 2002
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Exchange of CO2, CH4 and N2O between the atmosphere and two northern boreal ponds with catchments dominated by peatlands or forests
            </strong>
            <span className="text-gray-700 block mt-1">
              HUTTUNEN, J. T. ; VÄISÄNEN, T. S. ; HEIKKINEN, S. ; NYKÄNEN, H. ; NENONEN, O. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Plant and Soil, 242, 137-146
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Fluxes of CH4, CO2 and N2O in hydroelectric reservoirs Lokka and Porttipahta in the northern boreal zone in Finland
            </strong>
            <span className="text-gray-700 block mt-1">
              HUTTUNEN, J. T. ; VÄISÄNEN, T. S. ; HELLSTEN, S. K. ; HEIKKINEN, S. ; NYKÄNEN, H. ; JUNGNER, H. ; NISKANEN, A. ; VIRTANEN, M. O. ; LINDQVIST, O. V. ; NENONEN, O. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Global Biogeochemical Cycles, 16, 1003, 2002
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Methane fluxes at the sediment-water interface in some boreal lakes and reservoirs
            </strong>
            <span className="text-gray-700 block mt-1">
              HUTTUNEN, J. T. ; VÄISÄNEN, T. S. ; HELLSTEN, S. K. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Boreal Environment Research, 11, 27-34, 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Hydrologic sources of carbon cycling uncertainty throughout the terrestrial-aquatic continuum
            </strong>
            <span className="text-gray-700 block mt-1">
              JENERETTE, G. D. ; LAL, R.
            </span>
            <em className="text-sm text-gray-500">
              Global Change Biology, 11, 1873-1882, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Increases in fluxes of greenhouse gases and methyl mercury following flooding of an experimental reservoir
            </strong>
            <span className="text-gray-700 block mt-1">
              KELLY, C. A. ; RUDD, W. M. ; BODALY, R. A. ; ROULET, N. P. ; ST. LOUIS, V. L. ; HEYES, A. ; MOORE, T. R. ; SCHIFF, S. ; ARAVENA, R. ; SCOTT, K. J. ; DYCK; B. ; HARRIS, R. ; WARNER, B. ; EDWARDS, G.
            </span>
            <em className="text-sm text-gray-500">
              Environment Science Technology, 31, 1334-1344, 1997
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Sediment respiration and lake trophic state are important predictors of large CO2 evasion from small boreal lakes
            </strong>
            <span className="text-gray-700 block mt-1">
              KORTELAINEN, P. ; RANTAKARI, M. ; HUTTUNEN, J. T. ; MATTSSON, T. ; ALM, J. ; JUUTINEN, S. ; LARMOLA, T. ; SILVOLA, J. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Global Change Biology, 12, 1554-1567, 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Spatial and seasonal variation in greenhouse gas and nutrient dynamics and their interactions in the sediments of a boreal eutrophic lake
            </strong>
            <span className="text-gray-700 block mt-1">
              LIIKANEN, A. ; HUTTUNEN, J. T. ; MURTONIEMI, T. ; TANSKANEN, H. ; VÄISÄNEN, T. ; SILVOLA, J. ; ALM, J. ; MARTIKAINEN, P. J.
            </span>
            <em className="text-sm text-gray-500">
              Biogeochemistry, 65: 83-103, 2003, Kluwer Academic Publishers
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Biogeochemical distinction of methane releases from two Amazon hydroreservoirs
            </strong>
            <span className="text-gray-700 block mt-1">
              LIMA, I. B. T.
            </span>
            <em className="text-sm text-gray-500">
              Chemosphere, 59, 1697-1702, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Emissão de metano em reservatórios hidreléricos amazônicos através de leis de potência
            </strong>
            <span className="text-gray-700 block mt-1">
              LIMA, I. B. T.
            </span>
            <em className="text-sm text-gray-500">
              Tese de Doutorado, Centro de Energia Nuclear na Agricultura - USP, Piracicaba, 2002, 108p. (no prelo)
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Carbon flows in the Tucuruí reservoir
            </strong>
            <span className="text-gray-700 block mt-1">
              LIMA, I. B. T. ; NOVO, E. M. L. M.
            </span>
            <em className="text-sm text-gray-500">
              In: Proceedings of International Workshop on Hydro Dams, Lakes and Greenhouse Gas Emissions, Rio de Janeiro, Brazil, COPPE-UFRJ, pp.78-84, 1999
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Methane production, transport and emission in Amazon hydroelectric plants
            </strong>
            <span className="text-gray-700 block mt-1">
              LIMA, I. B. T. ; NOVO, E. M. L. M. ; BALLESTER, M. V. F. ; OMETTO, J. P.
            </span>
            <em className="text-sm text-gray-500">
              IEEE, 2529-2531, 1998
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Role of the macrophyte community in the CH4 production and emission in the tropical reservoir of Tucuruí, Pará State, Brazil
            </strong>
            <span className="text-gray-700 block mt-1">
              LIMA, I. B. T. ; NOVO, E. M. L. M. ; BALLESTER, M. V. R. ; OMETTO, J. P.
            </span>
            <em className="text-sm text-gray-500">
              Verh. Internat. Verein. Limnol., 27:1437-1440, 2000
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Methane, carbon dioxide, and nitrous oxide emissions from two Amazonian reservoirs during high water table
            </strong>
            <span className="text-gray-700 block mt-1">
              LIMA, I. B. T. ; VICTORIA, R. L. ; NOVO, E. M. L. M. ; FEIGL, B. J. ; BALLESTER, M. V. R.; OMETTO, J. P.
            </span>
            <em className="text-sm text-gray-500">
              XXVIII Societas Internationalis Limnologiae Congress, Melbourn, Australia, 2001. In press.
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              The effect of termite biomass and anthropogenic on the CH4 budgets of tropical forests in Cameroon and Borneo
            </strong>
            <span className="text-gray-700 block mt-1">
              MACDONALD, J. A. ; JEEVA, D. ; EGGLETON, P. ; DAVIES, R. ; BIGNELL, D. E. ; FOWLER, D. ; LAWTON, J. ; MARYATI, M.
            </span>
            <em className="text-sm text-gray-500">
              Global change Biology, 5, 869-879, 1999
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Methane Emission from Lakes
            </strong>
            <span className="text-gray-700 block mt-1">
              MAKHOV, G. A. ; BAZHIN, M.
            </span>
            <em className="text-sm text-gray-500">
              Chemosphere, 38 (6), 1453-1459, 1999
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Methane emissions from lakes and floodplains in Pantanal, Brazil
            </strong>
            <span className="text-gray-700 block mt-1">
              MARANI, L. ; ALVALÁ, P. C.
            </span>
            <em className="text-sm text-gray-500">
              Atmospheric Environment, 41, 1627-1633, 2007
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Carbon Dioxide and Methane production in small reservoirs flooding upland boreal forest
            </strong>
            <span className="text-gray-700 block mt-1">
              MATTHEWS, C. J. D. ; JOYCE, E. M. ; ST. LOUIS, V. L. ; SCHIFF, S. L. ; VENKITESWARAN, J. J. ; HALL, B. D. ; BODALY, R. A. ; BEATY, K. G.
            </span>
            <em className="text-sm text-gray-500">
              Ecosystems, 8: 267-285, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Comparison of three techniques used to measure diffusive gas exchange from sheltered aquatic surfaces
            </strong>
            <span className="text-gray-700 block mt-1">
              MATTHEWS, C. J. D. ; ST. LOUIS, V. L. ; HESSLEIN, R. H.
            </span>
            <em className="text-sm text-gray-500">
              Environmnet Science Technology, 37, 772-780, 2003
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Flooding the land, warming the Earth: greenhouse gas emissions from dams
            </strong>
            <span className="text-gray-700 block mt-1">
              MCCULLY, P.
            </span>
            <em className="text-sm text-gray-500">
              International Rivers Network, 2002
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Tropical hydropower is a significant source of greenhouse gas emissions: a response to the International Hydropower Association
            </strong>
            <span className="text-gray-700 block mt-1">
              MCCULLY, P.
            </span>
            <em className="text-sm text-gray-500">
              International Rivers Network, 2004
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Tropical hydropower is a significant source of greenhouse gas emissions: response to the International Hydropower Association
            </strong>
            <span className="text-gray-700 block mt-1">
              MCCULLY, P.
            </span>
            <em className="text-sm text-gray-500">
              International Rivers Network, 2004
            </em>
            <a href="http://www.irn.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-400 font-medium hover:underline text-sm mt-1 block">Link</a>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Effect of temperature on production of CH4 and CO2 from peat in a natural and flooded boreal forest wetland
            </strong>
            <span className="text-gray-700 block mt-1">
              MCKENZIE, C. ; SCHIFF, S. ; ARAVENA, R. ; KELLY, C. ; ST. LOUIS, V.
            </span>
            <em className="text-sm text-gray-500">
              Climatic change, 40: 247-266, 1998
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Nitrous oxide emissions to the atmosphere from an artificially oxygenated lake
            </strong>
            <span className="text-gray-700 block mt-1">
              MEYER, M. ; GÄCHTER, R. ; WEHRLI, B.
            </span>
            <em className="text-sm text-gray-500">
              Limnol. Oceanogr., 41:548-553, 1996
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Greenhouse gas emissions from building and operating electric power plants in the upper Colorado river basin
            </strong>
            <span className="text-gray-700 block mt-1">
              PACCA, S. ; HORVATH, A.
            </span>
            <em className="text-sm text-gray-500">
              Environment Science Technology, 36, 3194-3200, 2002
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Extreme event dynamics in methane ebullition fluxes from tropical reservoirs
            </strong>
            <span className="text-gray-700 block mt-1">
              RAMOS, F. M. ; LIMA, I. B. T. ; ROSA, R. R. ; MAZZI, E. A. ; CARVALHO, J. C. ; RASERA, M. F. F. L. ; OMETTO, J. P. H. B. ; ASSIREU, A. T. ; STECH, J. L.
            </span>
            <em className="text-sm text-gray-500">
              Geophysical research letters, 33 (21), CiteID L21404, 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Interannual variation and climatic regulation of the CO2 emission from large boreal lakes
            </strong>
            <span className="text-gray-700 block mt-1">
              RANTAKARI, M. ; KORTELAINEN, P.
            </span>
            <em className="text-sm text-gray-500">
              Global Change Biology, 11, 1368-1380, 2005
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Evolution of physico-chemical water quality and methane emissions in the tropical hydroelectric reservoir of Petit Saut (French Guiana)
            </strong>
            <span className="text-gray-700 block mt-1">
              RICHARD, S. ; GALY-LACAUX, C. ; ARNOUX, A. ; CERDAN, P. ; DELMAS, R. ; DUMESTRE, J. F. ; GOSSE, P. ; HOREAU, V. ; LABROUE, L. ; SISSAKIAN, C.
            </span>
            <em className="text-sm text-gray-500">
              Verhandlungen der Internationalen Vereinigung für Theoretische e Angewandte Limnologie, 27, 1454-1458, 2000
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Impact of methane oxidation in tropical reservoirs on greenhouse gas fluxes and water quality
            </strong>
            <span className="text-gray-700 block mt-1">
              RICHARD, S. ; GOSSE, P. ; GRÉGOIRE, A. ; DELMAS, R. ; GALY LACAUX, C.
            </span>
            <em className="text-sm text-gray-500">
              In: A. Tremblay et. al. op. cit., 329-560
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Certainty and uncertainty in the science of greenhouse gas emissions from hydroelectric reservoirs
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SANTOS, M. A.
            </span>
            <em className="text-sm text-gray-500">
              Thematic Review II.2 prepared as an input to the World Commission on Dams, Cape Town, 2000
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Dams and climate change
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SANTOS, M. A. (eds.)
            </span>
            <em className="text-sm text-gray-500">
              Proceedings of International Workshop on Hydro Dams, Lakes and Greenhouse Gas Emissions, Rio de Janeiro, Brazil, 1999
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Hydropower plants and greenhouse gas emissions
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SANTOS, M. A. (eds.)
            </span>
            <em className="text-sm text-gray-500">
              Proceedings of International Workshop on Greenhouse Gas Emissions from Hydroelectric Reservoirs, Rio de Janeiro, Brazil, 1997
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Biogenic gas production from major Amazon reservoirs, Brazil
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SANTOS, M. A. ; MATVIENKO, B. ; SIKAR, E. ; LOURENÇO, R. S. M. ; MENEZES, C. F. S.
            </span>
            <em className="text-sm text-gray-500">
              Hydrological Processes, 17, 1433-1450, 2003
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Scientific errors in the Fearnside comments on Greenhouse Gas Emissions (GHG) from hydroelectric dams and response to his political claiming
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SANTOS, M. A. ; MATVIENKO, B. ; SIKAR, E. ; SANTOS, E. O.
            </span>
            <em className="text-sm text-gray-500">
              Climatic Change, 75: 91-102, 2006
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Greenhouse gas emissions from hydroelectric reservoirs in tropical regions
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SANTOS, M. A. ; SIKAR, B. M. ; SANTOS, E. O. ; SIKAR, E.
            </span>
            <em className="text-sm text-gray-500">
              Climatic Change, 66:9-21, 2004, Netherlands
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Greenhouse gas emissions from hydropower reservoirs and water quality
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SANTOS, M. A. ; TUNDISI, J. G.
            </span>
            <em className="text-sm text-gray-500">
              COOPE/ UFRJ, 1st ed., 136 pp.
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Measurements of greenhouse gas emission in Samuel, Tucuruí and Balbina dams - Brazil
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SANTOS, M. A. ; TUNDISI, J. G. ; SIKAR, B. M.
            </span>
            <em className="text-sm text-gray-500">
              In: Hydropower Plants and Greenhouse Gas Emissions, Rosa, L. P. & Santos, M. A. (eds.), COPPE publication, Rio de Janeiro, 1997
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Global warming potentials: the case of emissions from dams
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SHAEFFER, R.
            </span>
            <em className="text-sm text-gray-500">
              Energy Policy, 23 (2), pp. 149-158, 1995
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Greenhouse gas emissions from hydroelectric reservoirs
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SHAEFFER, R.
            </span>
            <em className="text-sm text-gray-500">
              Ambio, 23 (2), pp. 164-165, 1994
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Are hydroelectric dams in the Brazilian Amazon significant sources of greenhouse gases
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SHAEFFER, R. ; SANTOS, M. A.
            </span>
            <em className="text-sm text-gray-500">
              Environmental Conservation, 66, n.1, 2-6, Cambridge University Press, UK, 1996
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Methane and Carbon Dioxide emissions of hydroelectric power plants in the Amazon compared to thermoelectric equivalents
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SHAEFFER, R. ; SANTOS, M. A.
            </span>
            <em className="text-sm text-gray-500">
              Unpublished report, Energy Planning Program, COPPE/UFRJ, August, 1994 (manuscript, 48 pp.)
            </em>
          </li>

          <li className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:border-blue-400 transition duration-150 ease-in-out">
            <strong className="text-lg font-semibold block text-blue-400">
              Emissões de gases de efeito estufa de reservatórios hidrelétricos
            </strong>
            <span className="text-gray-700 block mt-1">
              ROSA, L. P. ; SIKAR, B. M. ; SANTOS, M. A. ; MONTEIRO, J. L. ; SIKAR, E. ; SILVA, M. B. ; SANTOS, E. O. ; JUN
            </span>
            {/* O restante do texto deste item foi cortado, mas o estilo foi aplicado ao item existente. */}
          </li>

          {/* Fim dos itens copiados/adaptados */}

        </ul>
        
        {/* Rodapé opcional para fechar o conteúdo */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          Fim da lista de publicações.
        </div>
      </main>
    </div>
  );
};

export default FurnasPesquisas;