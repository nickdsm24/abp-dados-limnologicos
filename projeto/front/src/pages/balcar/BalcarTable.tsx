import React, { useState, useMemo } from 'react';

// --- CONFIGURAÇÃO DA PALETA DE CORES ---
// Primary: #1777af
// Secondary: #FFA500
// Background: #F3F7FB
// Card BG: #FFFFFF

// =========================================================================
// SIMULANDO ESTRUTURA: src/types/data.ts (Interfaces)
// =========================================================================

interface Tbreservatorio {
  idreservatorio: number;
  nome: string;
  lat: number;
  lng: number;
}

interface Tbinstituicao {
  idinstituicao: number;
  nome: string;
}

interface Tbcampanha {
  idcampanha: number;
  idreservatorio: number;
  idinstituicao: number;
  nrocampanha: number;
  datainicio: string; // DATE
  datafim: string; // DATE
}

interface Tbsitio {
  idsitio: number;
  idreservatorio: number;
  nome: string;
  lat: number;
  lng: number;
  descricao: string;
}

interface Tbfluxoinpe {
  idfluxoinpe: number;
  idsitio: number;
  idcampanha: number;
  datamedida: string; // DATE
  ch4: number | null;
  batimetria: number | null;
  tempar: number | null;
  tempcupula: number | null;
  tempaguasubsuperficie: number | null;
  tempaguameio: number | null;
  tempaguafundo: number | null;
  phsubsuperficie: number | null;
  phmeio: number | null;
  phfundo: number | null;
  condutividadesubsuperficie: number | null;
  odmeio: number | null;
  tsdfundo: number | null;
}

// =========================================================================
// SIMULANDO ESTRUTURA: src/data/mock.ts (Dados Mock)
// =========================================================================

const mockReservatorios: Tbreservatorio[] = [
  { idreservatorio: 1, nome: 'Reservatório do Sol', lat: -23.5, lng: -46.6 },
  { idreservatorio: 2, nome: 'Represa Nova Aurora', lat: -22.9, lng: -43.2 },
];

const mockInstituicoes: Tbinstituicao[] = [
  { idinstituicao: 101, nome: 'INPE' },
  { idinstituicao: 102, nome: 'USP' },
];

const mockSitios: Tbsitio[] = [
  { idsitio: 2001, idreservatorio: 1, nome: 'Ponto A - Superfície', lat: -23.51, lng: -46.61, descricao: 'Local de Coleta 1' },
  { idsitio: 2002, idreservatorio: 1, nome: 'Ponto B - Fundo', lat: -23.52, lng: -46.62, descricao: 'Local de Coleta 2' },
  { idsitio: 2003, idreservatorio: 2, nome: 'Ponto C - Entrada', lat: -22.91, lng: -43.21, descricao: 'Local de Coleta 3' },
];

const mockCampanhas: Tbcampanha[] = [
  { idcampanha: 1001, idreservatorio: 1, idinstituicao: 101, nrocampanha: 1, datainicio: '2023-01-15', datafim: '2023-01-20' },
  { idcampanha: 1002, idreservatorio: 2, idinstituicao: 102, nrocampanha: 2, datainicio: '2023-03-10', datafim: '2023-03-15' },
];

const mockFluxoInpe: Tbfluxoinpe[] = [
  { idfluxoinpe: 3001, idsitio: 2001, idcampanha: 1001, datamedida: '2023-01-16', ch4: 5.23, batimetria: 10.5, tempar: 28.5, tempcupula: 30.1, tempaguasubsuperficie: 25.4, tempaguameio: 24.8, tempaguafundo: 22.1, phsubsuperficie: 7.2, phmeio: 7.1, phfundo: 6.8, condutividadesubsuperficie: 0.15, odmeio: 8.5, tsdfundo: 0.22 },
  { idfluxoinpe: 3002, idsitio: 2002, idcampanha: 1001, datamedida: '2023-01-16', ch4: 8.11, batimetria: 25.0, tempar: 28.5, tempcupula: 30.1, tempaguasubsuperficie: 25.3, tempaguameio: 24.6, tempaguafundo: 21.9, phsubsuperficie: 7.2, phmeio: 7.0, phfundo: 6.7, condutividadesubsuperficie: 0.16, odmeio: 7.9, tsdfundo: 0.23 },
  { idfluxoinpe: 3003, idsitio: 2003, idcampanha: 1002, datamedida: '2023-03-11', ch4: 4.50, batimetria: 15.2, tempar: 30.2, tempcupula: 32.5, tempaguasubsuperficie: 26.1, tempaguameio: 25.5, tempaguafundo: 23.0, phsubsuperficie: 7.5, phmeio: 7.4, phfundo: 6.9, condutividadesubsuperficie: 0.20, odmeio: 9.1, tsdfundo: 0.30 },
  { idfluxoinpe: 3004, idsitio: 2001, idcampanha: 1001, datamedida: '2023-01-17', ch4: 5.50, batimetria: 10.5, tempar: 29.0, tempcupula: 31.0, tempaguasubsuperficie: 25.5, tempaguameio: 24.9, tempaguafundo: 22.2, phsubsuperficie: 7.3, phmeio: 7.2, phfundo: 6.9, condutividadesubsuperficie: 0.15, odmeio: 8.6, tsdfundo: 0.22 },
  { idfluxoinpe: 3005, idsitio: 2002, idcampanha: 1001, datamedida: '2023-01-17', ch4: 8.30, batimetria: 25.0, tempar: 29.0, tempcupula: 31.0, tempaguasubsuperficie: 25.4, tempaguameio: 24.7, tempaguafundo: 22.0, phsubsuperficie: 7.3, phmeio: 7.1, phfundo: 6.8, condutividadesubsuperficie: 0.16, odmeio: 8.0, tsdfundo: 0.23 },
];

// =========================================================================
// SIMULANDO ESTRUTURA: src/components/Balcar/PageHeader.tsx
// =========================================================================

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

// O componente agora é definido localmente em BalcarPage.tsx
const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
  <header className="mb-8 pt-4">
    <h1 className="text-4xl font-extrabold text-[#1777af] mb-2">{title}</h1>
    <p className="text-gray-600 text-lg">{subtitle}</p>
    <div className="h-1 w-20 bg-[#FFA500] rounded-full mt-2"></div>
  </header>
);

// =========================================================================
// SIMULANDO ESTRUTURA: src/components/Balcar/ReservoirSummaryCard.tsx
// =========================================================================

interface ReservoirSummaryCardProps {
  reservoirs: Tbreservatorio[];
  fluxCount: number;
}

// O componente agora é definido localmente em BalcarPage.tsx
const ReservoirSummaryCard: React.FC<ReservoirSummaryCardProps> = ({ reservoirs, fluxCount }) => {
  const totalReservoirs = new Set(reservoirs.map(r => r.idreservatorio)).size;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Card 1: Reservatórios */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-[#1777af] transition duration-300 hover:shadow-xl">
        <p className="text-sm font-semibold text-gray-500 uppercase">Reservatórios Monitorados</p>
        <p className="text-4xl font-bold text-[#1777af] mt-1">{totalReservoirs}</p>
      </div>
      {/* Card 2: Medições de Fluxo */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-[#FFA500] transition duration-300 hover:shadow-xl">
        <p className="text-sm font-semibold text-gray-500 uppercase">Medições de Fluxo (CH4)</p>
        <p className="text-4xl font-bold text-[#FFA500] mt-1">{fluxCount}</p>
      </div>
      {/* Card 3: Período de Dados */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-gray-400 transition duration-300 hover:shadow-xl">
        <p className="text-sm font-semibold text-gray-500 uppercase">Período de Dados (Aprox.)</p>
        <p className="text-4xl font-bold text-gray-700 mt-1">2023</p>
      </div>
    </div>
  );
};

// =========================================================================
// SIMULANDO ESTRUTURA: src/components/Balcar/FluxDataTable.tsx
// =========================================================================

interface FluxDataTableProps {
  data: Tbfluxoinpe[];
  sitios: Tbsitio[];
  campanhas: Tbcampanha[];
  instituicoes: Tbinstituicao[]; // Novo: Adicionado para resolver o warning
}

// O componente agora é definido localmente em BalcarPage.tsx
const FluxDataTable: React.FC<FluxDataTableProps> = ({ data, sitios, campanhas, instituicoes }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Função auxiliar para encontrar o nome do sítio
  const getSiteName = (id: number | null | undefined) => {
    if (id === null || id === undefined) return 'N/A';
    return sitios.find(s => s.idsitio === id)?.nome || 'Sítio Desconhecido';
  };
  
  // Função auxiliar para buscar detalhes da campanha e instituição
  const getCampaignDetails = (id: number) => {
    const campaign = campanhas.find(c => c.idcampanha === id);
    if (!campaign) return { nro: 'N/A', instName: 'N/A' };
    
    const institution = instituicoes.find(i => i.idinstituicao === campaign.idinstituicao);
    
    return {
      nro: campaign.nrocampanha,
      instName: institution ? institution.nome : 'Instituição Desconhecida'
    };
  };

  // Configuração das colunas da tabela
  const columns = [
    { key: 'datamedida', header: 'Data', isNumeric: false },
    { key: 'ch4', header: 'CH4', isNumeric: true, unit: 'mol/m²s', highlighted: true },
    { key: 'batimetria', header: 'Batimetria', isNumeric: true, unit: 'm' },
    { key: 'tempar', header: 'Temp. Ar', isNumeric: true, unit: '°C' },
    { key: 'tempaguasubsuperficie', header: 'Temp. Água (Sub)', isNumeric: true, unit: '°C' },
    { key: 'phsubsuperficie', header: 'pH (Sub)', isNumeric: true },
    { key: 'odmeio', header: 'OD (Meio)', isNumeric: true },
    { key: 'idsitio', header: 'Sítio', isNumeric: false, formatter: (id: number) => getSiteName(id) },
    // MODIFICADO: Exibe o número da campanha ao invés do ID
    { key: 'idcampanha', header: 'Campanha Nº', isNumeric: false, formatter: (id: number) => getCampaignDetails(id).nro },
    // NOVO: Coluna virtual para o nome da instituição
    { key: 'institutionDisplay', header: 'Instituição', isNumeric: false, virtual: true },
  ];

  // Paginação
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatValue = (value: number | string | null, isNumeric: boolean) => {
    if (value === null || value === undefined) return '-';
    // Se for numérico, formatar com 2 casas decimais, senão retornar o valor
    return isNumeric && typeof value === 'number' ? value.toFixed(2) : String(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 overflow-x-auto">
      <h2 className="text-2xl font-semibold text-[#1777af] mb-6 border-b pb-3">Detalhe das Medições (tbfluxoinpe)</h2>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#1777af] shadow-md">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-bold text-white uppercase tracking-wider ${col.isNumeric ? 'text-right' : 'text-left'}`}
                >
                  {col.header}
                  {col.unit && <span className="ml-1 font-normal opacity-80 text-[#FFA500] text-[0.65rem]">{col.unit}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((row) => (
              <tr key={row.idfluxoinpe} className="hover:bg-[#F3F7FB] transition-colors duration-150">
                {columns.map((col) => {
                  
                  let displayValue: React.ReactNode;
                  const isNumeric = col.isNumeric;

                  if (col.key === 'institutionDisplay') {
                    // Lógica especial para coluna virtual de Instituição
                    const campaignId = row.idcampanha;
                    displayValue = getCampaignDetails(campaignId).instName;
                  } else {
                    // Lógica para colunas reais e modificadas (Campanha Nº)
                    const rawValue = row[col.key as keyof Tbfluxoinpe];
                    displayValue = col.formatter ? col.formatter(rawValue as number) : formatValue(rawValue, isNumeric);
                  }
                  
                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-3 whitespace-nowrap text-sm ${col.isNumeric ? 'text-right font-mono' : 'text-left text-gray-700'}`}
                    >
                      {/* Aplica destaque visual ao CH4 */}
                      {col.highlighted ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FFA500]/20 text-[#FFA500]">
                              {displayValue}
                          </span>
                      ) : (
                          displayValue
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                  <td colSpan={columns.length} className="px-4 py-4 text-center text-gray-500">
                      Nenhum dado encontrado.
                  </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginação */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
        <span className="text-sm text-gray-600 mb-2 sm:mb-0">
          Mostrando {paginatedData.length} de {data.length} registros. Página {currentPage} de {totalPages}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-[#1777af] bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F3F7FB] transition-colors shadow-sm"
          >
            Anterior
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-white bg-[#1777af] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1777af]/90 transition-colors shadow-sm"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};


// =========================================================================
// PÁGINA PRINCIPAL: src/pages/BalcarPage.tsx
// =========================================================================

export const BalcarTable: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F3F7FB] p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <PageHeader 
          title="Dados BALCAR" 
          subtitle="Visualização consolidada de medições de fluxo (CH4) e parâmetros físico-químicos."
        />

        <ReservoirSummaryCard 
          reservoirs={mockReservatorios} 
          fluxCount={mockFluxoInpe.length}
        />

        <FluxDataTable 
          data={mockFluxoInpe} 
          sitios={mockSitios} 
          campanhas={mockCampanhas} 
          instituicoes={mockInstituicoes} // Novo prop passado
        />

        <footer className="mt-10 text-center text-sm text-gray-500 py-4 border-t border-gray-200">
            Dados de Exemplo (Mock) baseados no esquema INPE.
        </footer>
      </div>
    </div>
  );
};

export default BalcarTable;
