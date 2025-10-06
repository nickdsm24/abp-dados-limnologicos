import React, { useState, useEffect, useMemo } from "react";
// OBSERVAÇÃO: Os Styled Components originais foram substituídos por classes Tailwind CSS
// A estética e a paleta de cores foram unificadas com BalcarPage.

// --- CONFIGURAÇÃO DA PALETA DE CORES ---
// Primary: #1777af (Azul)
// Secondary: #FFA500 (Laranja)
// Background: #F3F7FB (Cinza Claro)
// Card BG: #FFFFFF (Branco)

// =========================================================================
// SIMULAÇÃO DE TIPOS E HOOKS (Para compilação no Canvas)
// No seu ambiente real, esses seriam importados de seus respectivos arquivos.
// =========================================================================

// Tipos SIMULADOS
interface SimaRegistro {
  idsima: number;
  datahora: string;
  regno: number | null;
  nofsamples: number | null;
  proamag: number | null;
  dirvt: number | null;
  intensvt: number | null;
  u_vel: number | null;
  v_vel: number | null;
  tempag1: number | null;
  tempag2: number | null;
  tempag3: number | null;
  tempag4: number | null;
  tempar: number | null;
  ur: number | null;
  tempar_r: number | null;
  pressatm: number | null;
  radincid: number | null;
  radrefl: number | null;
  bateria: number | null;
  precipitacao: number | null;
}

interface SimaResponse {
  data: SimaRegistro[];
  totalRecords: number;
  totalPages: number;
}

interface Estacao {
  idestacao: string;
  rotulo: string;
  inicio: string; // Ex: "2000-01-01T00:00:00Z"
  fim: string;    // Ex: "2020-01-01T00:00:00Z"
}

// SIMULAÇÃO de useSima e useEstacao
const useEstacao = () => {
  const estacoesMock: Estacao[] = useMemo(() => [
    { idestacao: "32445", rotulo: "Estação Fluvial A - Rio Paraná", inicio: "2000-01-01T00:00:00Z", fim: "2022-12-31T23:59:59Z" },
    { idestacao: "45123", rotulo: "Estação Pluviométrica B - Serra do Mar", inicio: "2015-05-01T00:00:00Z", fim: "2024-10-31T23:59:59Z" },
    { idestacao: "98765", rotulo: "Estação Meteorológica C - Litoral", inicio: "2010-01-01T00:00:00Z", fim: "2021-01-01T23:59:59Z" },
  ], []);

  // Simulação de carregamento instantâneo
  return { data: estacoesMock, loading: false, error: null };
};

const useSima = () => {
  const [data, setData] = useState<SimaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados mock para simular a resposta da API (15 registros, 2 páginas de 10)
  const allData: SimaRegistro[] = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    idsima: 5000 + i,
    datahora: new Date(new Date('2020-01-01T10:00:00Z').getTime() + i * 3600000).toISOString(),
    regno: 10 + i,
    nofsamples: 500 + i,
    proamag: 1.5 + i * 0.1,
    dirvt: 90 + i * 5,
    intensvt: 0.2 + i * 0.05,
    u_vel: 0.1 * i,
    v_vel: 0.2 * i,
    tempag1: 22.0 + i * 0.1,
    tempag2: 22.5 + i * 0.1,
    tempag3: 23.0 + i * 0.1,
    tempag4: 23.5 + i * 0.1,
    tempar: 28.0 + i * 0.2,
    ur: 70 + i,
    tempar_r: 27.5 + i * 0.2,
    pressatm: 1010.5 + i * 0.5,
    radincid: 500 + i * 10,
    radrefl: 50 + i * 2,
    bateria: 12.0 - i * 0.05,
    precipitacao: i < 5 ? 0 : 2.5,
  })), []);

  const fetchData = async ({ page, limit, idestacao, inicio, fim }: { page: number, limit: number, idestacao: string, inicio: string, fim: string }) => {
    setLoading(true);
    setError(null);
    try {
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulação de filtragem por estação e data
      const filteredData = allData.filter(row => {
        // Ignoramos o filtro de estação e data por simplicidade do mock,
        // mas em um cenário real, esses parâmetros seriam usados para filtrar a API
        return true; 
      });

      const totalRecords = filteredData.length;
      const totalPages = Math.ceil(totalRecords / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setData({
        data: paginatedData,
        totalRecords,
        totalPages
      });
      
    } catch (e) {
      setError("Falha ao carregar dados SIMA (Mock Error).");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};


// =========================================================================
// FUNÇÕES AUXILIARES
// =========================================================================

const formatDateTime = (isoString: string | undefined) => {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', month: '2-digit', year: '2-digit', 
      hour: '2-digit', minute: '2-digit', hour12: false 
    };
    return date.toLocaleDateString('pt-BR', options).replace(',', '');
  } catch {
    return 'Data Inválida';
  }
};

// =========================================================================
// COMPONENTE PRINCIPAL: SimaPage
// =========================================================================

function SimaTable() {
  const [page, setPage] = useState(1);
  const [idestacao, setIdestacao] = useState<string>("32445"); // inicia com 32445
  const [dataInicio, setDataInicio] = useState<string>("2000-01-01");
  const [dataFim, setDataFim] = useState<string>("2020-01-01");
  const [tituloEstacao, setTituloEstacao] = useState<string>(""); // Título controlado

  const { data: estacoes, loading: loadingEstacoes, error: erroEstacoes } = useEstacao();
  const { data, loading, error, fetchData } = useSima();

  // Encontra a estação selecionada e define as datas min/max do input
  const estacaoSelecionada = useMemo(() => estacoes.find((e) => e.idestacao === idestacao), [estacoes, idestacao]);
  const minDate = estacaoSelecionada?.inicio ? estacaoSelecionada.inicio.split("T")[0] : "";
  const maxDate = estacaoSelecionada?.fim ? estacaoSelecionada.fim.split("T")[0] : "";

  const handleFetch = async (newPage = page) => {
    // A requisição precisa sempre usar o ID da estação mais recente
    const currentIdEstacao = idestacao; 
    
    await fetchData({
      page: newPage,
      limit: 10,
      idestacao: currentIdEstacao,
      inicio: dataInicio,
      fim: dataFim,
    });
    
    // Atualiza o estado da página somente se a busca for bem-sucedida ou a primeira busca
    setPage(newPage);

    // Atualiza o título após a requisição
    const est = estacoes.find((e) => e.idestacao === currentIdEstacao);
    if (est) {
      setTituloEstacao(` - ${est.rotulo}`);
    }
  };

  // Busca inicial ao montar a página
  useEffect(() => {
    handleFetch(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Efeito para garantir que o título da estação seja atualizado se os dados de estação carregarem
  useEffect(() => {
    if (estacoes.length > 0) {
      const est = estacoes.find((e) => e.idestacao === idestacao);
      if (est) {
        setTituloEstacao(` - ${est.rotulo}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estacoes]);

  // Handler para mudança de estação
  const handleEstacaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdestacao(e.target.value);
    setPage(1); // Volta para a primeira página ao trocar a estação
  };

  // Nomes de colunas amigáveis
  const columnHeaders = [
    { key: 'datahora', label: 'Data/Hora', format: formatDateTime },
    { key: 'regno', label: 'regno' },
    { key: 'nofsamples', label: 'nofsamples' },
    { key: 'proamag', label: 'proamag' },
    { key: 'dirvt', label: 'dirvt' },
    { key: 'intensvt', label: 'intensvt' },
    { key: 'u_vel', label: 'u_vel' },
    { key: 'v_vel', label: 'v_vel' },
    { key: 'tempag1', label: 'Temp. Água 1' },
    { key: 'tempag2', label: 'Temp. Água 2' },
    { key: 'tempag3', label: 'Temp. Água 3' },
    { key: 'tempag4', label: 'Temp. Água 4' },
    { key: 'tempar', label: 'Temp. Ar' },
    { key: 'ur', label: 'Umidade Rel.' },
    { key: 'tempar_r', label: 'Temp. Ar (Rec)' },
    { key: 'pressatm', label: 'Pressão Atm.' },
    { key: 'radincid', label: 'Rad. Incid.' },
    { key: 'radrefl', label: 'Rad. Refl.' },
    { key: 'bateria', label: 'Bateria' },
    { key: 'precipitacao', label: 'Precipitação' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F7FB] p-4 sm:p-8 font-sans">
      <div className="max-w-full mx-auto">
        
        {/* Título da Página (Unified Style) */}
        <header className="mb-8 pt-4">
          <h1 className="text-4xl font-extrabold text-[#1777af] mb-2">
            Dados SIMA
            <span className="text-gray-600 font-semibold">{tituloEstacao}</span>
          </h1>
          <div className="h-1 w-20 bg-[#FFA500] rounded-full mt-2"></div>
        </header>

        {/* Contêiner de Filtros (Unified Style) */}
        <div className="flex flex-wrap gap-4 md:gap-6 mb-8 items-center bg-white p-4 md:p-6 rounded-xl shadow-lg">
          
          {/* Select de estação */}
          <div className="flex items-center space-x-3">
            <label className="text-gray-700 font-medium whitespace-nowrap">Estação:</label>
            {loadingEstacoes && <p className="text-gray-500">Carregando...</p>}
            {erroEstacoes && <p className="text-red-500">{erroEstacoes}</p>}
            {!loadingEstacoes && estacoes.length > 0 && (
              <select
                value={idestacao}
                onChange={handleEstacaoChange}
                className="p-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#1777af] focus:border-[#1777af] transition duration-150 shadow-sm"
              >
                {estacoes.map((est) => (
                  <option key={est.idestacao} value={est.idestacao}>
                    {est.rotulo}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Intervalo de datas */}
          {estacaoSelecionada && (
            <>
              <div className="flex items-center space-x-3">
                <label className="text-gray-700 font-medium whitespace-nowrap">Data Início:</label>
                <input
                  type="date"
                  min={minDate}
                  max={maxDate || undefined}
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="p-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#1777af] focus:border-[#1777af] transition duration-150 shadow-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-gray-700 font-medium whitespace-nowrap">Data Fim:</label>
                <input
                  type="date"
                  min={minDate}
                  max={maxDate || undefined}
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="p-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#1777af] focus:border-[#1777af] transition duration-150 shadow-sm"
                />
              </div>
            </>
          )}

          {/* Botão de busca */}
          <button 
            onClick={() => handleFetch(1)}
            disabled={loading || loadingEstacoes}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[#FFA500] rounded-lg shadow-md hover:bg-[#ffb020] transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait"
          >
            {loading ? 'Buscando...' : 'Obter Dados'}
          </button>
        </div>

        {loading && <div className="text-center py-12"><p className="text-[#1777af] font-semibold text-lg">Carregando registros...</p></div>}
        {error && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md"><p>{error}</p></div>}

        {!loading && data && (
          <>
            <div className="bg-white rounded-xl shadow-2xl overflow-x-auto border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#1777af] shadow-md">
                  <tr>
                    {columnHeaders.map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {data.data.map((row) => (
                    <tr key={row.idsima} className="hover:bg-[#F3F7FB] transition-colors duration-150">
                      {columnHeaders.map((col) => {
                        const rawValue = row[col.key as keyof SimaRegistro];
                        const displayValue = col.format ? col.format(rawValue as string | undefined) : (rawValue ?? "-");

                        return (
                          <td
                            key={col.key}
                            className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                          >
                            {displayValue}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {data.data.length === 0 && (
                    <tr>
                      <td colSpan={columnHeaders.length} className="px-4 py-4 text-center text-gray-500">
                        Nenhum registro encontrado para a seleção atual.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
              <span className="text-sm text-gray-600 mb-2 sm:mb-0">
                Página {page} de {data.totalPages}. Total de {data.totalRecords} registros.
              </span>
              <div className="flex space-x-3">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => handleFetch(page - 1)}
                  className="px-4 py-2 text-sm font-medium text-[#1777af] bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F3F7FB] transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>
                <button
                  disabled={page === data.totalPages || loading}
                  onClick={() => handleFetch(page + 1)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1777af] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1777af]/90 transition-colors shadow-sm"
                >
                  Próxima
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SimaTable;
