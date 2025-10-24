// src/components/commons/DataTable.tsx 
import { Loader2, AlertCircle, Table2 } from 'lucide-react';
import type { 
  DataType, 
  PaginacaoState, 
  DatabaseName 
} from '../../types/types'; // Ajuste o caminho

interface DataTableProps {
  database: DatabaseName;
  tableName: string;
  dados: DataType;
  colunas: string[];
  loading: boolean;
  error: string | null;
  paginacao: PaginacaoState;
  onPageChange: (newPage: number) => void;
}

export default function DataTable({
  tableName,
  dados,
  colunas,
  loading,
  error,
  paginacao,
  onPageChange
}: DataTableProps) {

  // --- Estados de Feedback (Estilizados) ---

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Cor do ícone atualizada para o tema "mar" */}
          <Loader2 className="animate-spin text-cyan-600" size={40} />
          <p className="mt-3 text-lg font-medium text-gray-700">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-lg border border-red-200 text-red-600">
          <AlertCircle size={40} />
          <p className="mt-3 text-lg font-semibold">Erro ao carregar dados</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!dados || dados.length === 0) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-500">
          <Table2 size={40} />
          <p className="mt-3 text-lg font-semibold">Nenhum dado encontrado</p>
          <p className="text-sm">Nenhum registro corresponde aos filtros para a tabela "{tableName}".</p>
        </div>
      </div>
    );
  }

  // --- Renderização da Tabela (Estilizada) ---
  return (
    <div className="p-4">
      {/* 1. Wrapper com cantos arredondados e overflow hidden */}
      <div className="overflow-hidden bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            
            {/* 2. Cabeçalho azul-mar com texto branco */}
            <thead className="bg-cyan-700">
              <tr>
                {colunas.map((coluna) => (
                  <th
                    key={coluna}
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                  >
                    {coluna.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>

            {/* 3. Corpo com linhas "zebra" (cor sim, cor não) */}
            <tbody className="bg-white">
              {dados.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="odd:bg-white even:bg-sky-50 hover:bg-sky-100 transition-colors duration-150"
                >
                  {colunas.map((coluna) => (
                    <td 
                      key={`${rowIndex}-${coluna}`} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 border-t border-gray-200"
                    >
                      {String(row[coluna] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Paginação com cantos arredondados */}
      <Pagination 
        paginacao={paginacao}
        onPageChange={onPageChange}
      />
    </div>
  );
}

// --- Componente de Paginação (Estilizado) ---

interface PaginationProps {
  paginacao: PaginacaoState;
  onPageChange: (newPage: number) => void;
}

function Pagination({ paginacao, onPageChange }: PaginationProps) {
  const { page, totalPages, total } = paginacao;

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <div className="text-sm text-gray-700">
        Total de <span className="font-semibold text-gray-900">{total}</span> registros
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg bg-white 
                     hover:bg-gray-50 
                     disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">
          Página <span className="font-semibold text-gray-900">{page}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg bg-white 
                     hover:bg-gray-50 
                     disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
