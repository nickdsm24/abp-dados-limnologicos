import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LoaderCircle, ServerCrash, Table } from 'lucide-react';

// --- DEFINIÇÃO DE TIPOS E INTERFACES ---

// Interface para o objeto de paginação retornado pela API
interface PaginacaoState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Interface para os objetos da lista de tabelas
interface TabelaDisponivel {
  label: string;
  value: string;
}

// O tipo do nosso dado. Como cada tabela tem colunas diferentes,
// usamos um tipo genérico: um array de objetos onde as chaves são strings
// e os valores podem ser qualquer coisa.
type DataType = Record<string, any>[];


// --- LISTA DE TABELAS DISPONÍVEIS ---
const tabelasDisponiveis: TabelaDisponivel[] = [
  { label: 'Sítios', value: 'sitio' },
  { label: 'Reservatórios', value: 'reservatorio' },
  { label: 'Campanhas', value: 'campanha' },
  { label: 'Abiótico (Coluna)', value: 'abiotico-coluna' },
  { label: 'Abiótico (Superfície)', value: 'abiotico-superficie' },
  // ... adicione as outras ...
];

function FurnasTable() {
  // --- ESTADOS DO COMPONENTE (AGORA TIPADOS) ---
  const [tabelaSelecionada, setTabelaSelecionada] = useState<string>('');
  const [dados, setDados] = useState<DataType>([]);
  const [colunas, setColunas] = useState<string[]>([]);
  const [paginacao, setPaginacao] = useState<PaginacaoState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- EFEITO PARA BUSCAR DADOS (SEM MUDANÇAS NA LÓGICA) ---
  useEffect(() => {
    if (!tabelaSelecionada) {
      setDados([]);
      setColunas([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `http://localhost:3000/api/furnas/${tabelaSelecionada}/all?page=${paginaAtual}&limit=${paginacao.limit}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resultado = await response.json();

        setDados(resultado.data || []);
        setPaginacao({
          page: resultado.page,
          limit: resultado.limit,
          total: resultado.total,
          totalPages: resultado.totalPages,
        });

        if (resultado.data && resultado.data.length > 0) {
          setColunas(Object.keys(resultado.data[0]));
        } else {
          setColunas([]);
        }

      } catch (err) {
        setError('Não foi possível carregar os dados. Verifique a API ou tente novamente.');
        setDados([]);
        setColunas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tabelaSelecionada, paginaAtual]);

  // --- FUNÇÕES AUXILIARES (AGORA TIPADAS) ---
  const formatarNomeColuna = (nome: string): string => {
    const resultado = nome.replace(/([A-Z])/g, ' $1');
    return resultado.charAt(0).toUpperCase() + resultado.slice(1);
  };
  
  const renderizarCelula = (item: any): string => {
    if (item === null || item === undefined) return 'N/A';
    if (typeof item === 'object') return JSON.stringify(item);
    return String(item);
  };

  const handleSelecaoTabela = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTabelaSelecionada(e.target.value);
    setPaginaAtual(1);
  };

  const handlePaginaAnterior = () => {
    setPaginaAtual((prev) => Math.max(prev - 1, 1));
  };
  
  const handlePaginaProxima = () => {
    setPaginaAtual((prev) => Math.min(prev + 1, paginacao.totalPages));
  };
  
  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <div className="min-h-screen bg-[#F3F7FB] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Visualizador de Dados - Furnas</h1>
          <p className="text-gray-600 mt-1">Selecione uma tabela para explorar os dados limnológicos.</p>
        </header>

        {/* Controles */}
        <div className="mb-6">
          <label htmlFor="tabela-select" className="block text-sm font-medium text-gray-700 mb-2">
            Selecione a Tabela
          </label>
          <select
            id="tabela-select"
            value={tabelaSelecionada}
            onChange={handleSelecaoTabela}
            className="block w-full max-w-sm p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1777af] focus:border-[#1777af]"
          >
            <option value="">-- Escolha uma tabela --</option>
            {tabelasDisponiveis.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Área de Conteúdo (Tabela ou Mensagens de Estado) */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center justify-center p-12 text-[#1777af]">
              <LoaderCircle className="animate-spin h-10 w-10 mb-4" />
              <p className="text-lg font-semibold">Carregando dados...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center p-12 text-red-600">
              <ServerCrash className="h-10 w-10 mb-4" />
              <p className="text-lg font-semibold">Ocorreu um Erro</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && dados.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <Table className="h-10 w-10 mb-4" />
              <p className="text-lg font-semibold">
                {tabelaSelecionada ? 'Nenhum dado encontrado.' : 'Selecione uma tabela para começar.'}
              </p>
            </div>
          )}
          
          {!loading && !error && dados.length > 0 && (
            <>
              {/* Tabela de Dados */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-white uppercase bg-[#1777af]">
                    <tr>
                      {colunas.map((col) => (
                        <th key={col} scope="col" className="px-6 py-3">
                          {formatarNomeColuna(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dados.map((item, index) => (
                      <tr key={item.id || index} className="bg-white border-b hover:bg-[#F3F7FB]">
                        {colunas.map((col) => (
                          <td key={col} className="px-6 py-4">
                            {renderizarCelula(item[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Controles de Paginação */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <span className="text-sm text-gray-700">
                  Página <span className="font-semibold">{paginacao.page}</span> de <span className="font-semibold">{paginacao.totalPages}</span> ({paginacao.total} registros)
                </span>
                <div className="inline-flex items-center space-x-2">
                  <button
                    onClick={handlePaginaAnterior}
                    disabled={paginaAtual === 1}
                    className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-[#1777af] rounded-l-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-opacity-90"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </button>
                  <button
                    onClick={handlePaginaProxima}
                    disabled={paginaAtual === paginacao.totalPages || paginacao.totalPages === 0}
                    className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-[#1777af] rounded-r-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-opacity-90"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FurnasTable;