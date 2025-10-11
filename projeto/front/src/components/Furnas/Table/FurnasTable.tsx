import { useState } from 'react';
import { ChevronLeft, ChevronRight, LoaderCircle, ServerCrash, Table, Search } from 'lucide-react';
import { useFurnasData } from '../../../hooks/useFurnasData'; // Ajuste o caminho para o seu hook se necessário

// 1. Interface que define as props que este componente espera receber
interface FurnasTableProps {
  tableName: string;
}

// 2. O componente agora recebe as props, especificamente 'tableName'
function FurnasTable({ tableName }: FurnasTableProps) {
  // Estados que o componente gerencia: paginação e filtros
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [filtrosAtivos, setFiltrosAtivos] = useState({});
  const [filtrosForm, setFiltrosForm] = useState({
    animal: '',
    candy: '',
    money: '',
  });

  // 3. O hook é chamado com a 'tableName' recebida via prop
  const { dados, colunas, paginacao, loading, error } = useFurnasData(
    tableName,
    paginaAtual,
    filtrosAtivos
  );

  // --- Funções Auxiliares de Renderização ---
  const formatarNomeColuna = (nome: string): string => {
    const resultado = nome.replace(/([A-Z])/g, ' $1');
    return resultado.charAt(0).toUpperCase() + resultado.slice(1);
  };
  
  const renderizarCelula = (item: unknown): string => {
    if (item === null || item === undefined) return 'N/A';
    if (typeof item === 'object') return JSON.stringify(item);
    return String(item);
  };

  // --- Handlers de Eventos ---
  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltrosForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAplicarFiltros = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaAtual(1); // Reseta a paginação ao aplicar filtros
    setFiltrosAtivos(filtrosForm);
  };
  
  const handlePaginaAnterior = () => {
    setPaginaAtual((prev) => Math.max(prev - 1, 1));
  };
  
  const handlePaginaProxima = () => {
    setPaginaAtual((prev) => Math.min(prev + 1, paginacao.totalPages));
  };
  
  return (
    // O JSX agora usa as variáveis (loading, error, dados) para renderizar a UI correta
    <div className="bg-[#F3F7FB] p-4 sm:p-6 lg:p-8" style={{ minHeight: 'calc(100vh)' }}>
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            Tabela: {tableName.replace('-', ' ')}
          </h1>
          <p className="text-gray-600 mt-1">Explore os dados limnológicos da tabela selecionada.</p>
        </header>

        <form onSubmit={handleAplicarFiltros} className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              {/* Exemplo de Filtros */}
              <div>
                <label htmlFor="animal" className="block text-sm font-medium text-gray-700">Animal</label>
                <input type="text" id="animal" name="animal" value={filtrosForm.animal} onChange={handleFiltroChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
              </div>
              <button type="submit" className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#1777af] rounded-md hover:bg-opacity-90 h-10">
                <Search className="w-4 h-4 mr-2" /> Aplicar Filtros
              </button>
          </div>
        </form>

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
              <p className="text-lg font-semibold">Nenhum dado encontrado.</p>
              <p className="text-sm mt-1">Tente ajustar os filtros ou selecione outra tabela.</p>
            </div>
          )}
          
          {!loading && !error && dados.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-white uppercase bg-[#1777af]">
                    <tr>
                      {colunas.map((col) => (
                        <th key={col} scope="col" className="px-6 py-3">{formatarNomeColuna(col)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dados.map((item, index) => (
                      <tr key={typeof item.id === 'string' || typeof item.id === 'number' ? item.id : index} className="bg-white border-b hover:bg-[#F3F7FB]">
                        {colunas.map((col) => (
                          <td key={col} className="px-6 py-4">{renderizarCelula(item[col])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <span className="text-sm text-gray-700">
                  Página <span className="font-semibold">{paginacao.page}</span> de <span className="font-semibold">{paginacao.totalPages}</span> ({paginacao.total} registros)
                </span>
                <div className="inline-flex items-center space-x-2">
                  <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-[#1777af] rounded-l-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-opacity-90">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </button>
                  <button onClick={handlePaginaProxima} disabled={paginaAtual === paginacao.totalPages || paginacao.totalPages === 0} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-[#1777af] rounded-r-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-opacity-90">
                    Próxima <ChevronRight className="w-4 h-4 ml-1" />
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