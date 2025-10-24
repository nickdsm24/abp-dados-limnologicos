// src/components/commons/DataTable.tsx (REESCRITO)

import { Loader2, AlertCircle, Table2 } from 'lucide-react';
import type { 
  DataType, 
  PaginacaoState, 
  DatabaseName 
} from '../../types/types'; // Ajuste o caminho

// 1. Definir as PROPS que o DataTable agora espera receber
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

// 2. O componente agora é 'burro' (de apresentação)
// Ele recebe tudo via props e não tem mais o hook useTableData
export default function DataTable({
  tableName,
  dados,
  colunas,
  loading,
  error,
  paginacao,
  onPageChange
}: DataTableProps) {

  // Handler para loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  // Handler para erro
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertCircle size={40} />
        <p className="mt-2 text-lg font-semibold">Erro ao carregar dados</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // Handler para dados vazios
  if (!dados || dados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Table2 size={40} />
        <p className="mt-2 text-lg font-semibold">Nenhum dado encontrado</p>
        <p className="text-sm">Nenhum registro corresponde aos filtros para a tabela "{tableName}".</p>
      </div>
    );
  }

  // Renderização da Tabela
  return (
    <div className="p-4">
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {colunas.map((coluna) => (
                <th
                  key={coluna}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {coluna.replace(/_/g, ' ')} {/* Formata nomes de coluna */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dados.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {colunas.map((coluna) => (
                  <td key={`${rowIndex}-${coluna}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {/* Converte valores para string para renderização segura */}
                    {String(row[coluna] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Renderiza o componente de paginação */}
      <Pagination 
        paginacao={paginacao}
        onPageChange={onPageChange}
      />
    </div>
  );
}

// --- Componente de Paginação (embutido) ---

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

  if (totalPages <= 1) return null; // Não mostra paginação se só houver 1 página

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <div className="text-sm text-gray-700">
        Total de <span className="font-medium">{total}</span> registros
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">
          Página <span className="font-medium">{page}</span> de <span className="font-medium">{totalPages}</span>
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}