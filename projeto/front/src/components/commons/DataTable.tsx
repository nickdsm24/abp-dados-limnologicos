// src/components/commons/DataTable.tsx 
import { useMemo } from 'react'; // Importa o useMemo
import { Loader2, AlertCircle, Table2 } from 'lucide-react';
import type { 
  DataType, 
  PaginacaoState, 
  DatabaseName 
} from '../../types/types'; // Ajuste o caminho

// --- Definições dos Temas ---
// Objeto que armazena as classes do Tailwind para cada tema
const themes = {
  furnas: {
    headerBg: 'bg-[#1777af]',
    rowEven: 'even:bg-blue-50', // Tom de azul bem claro
    rowHover: 'hover:bg-blue-100',
    loader: 'text-[#1777af]',
    paginationBg: 'bg-[#1777af]',
    paginationBgHover: 'hover:bg-[#136190]', // Azul mais escuro (do MenuBar)
    paginationText: 'text-white',
  },
  balcar: {
    headerBg: 'bg-[#006666]',
    rowEven: 'even:bg-teal-50', // 'teal' é um bom análogo para este verde
    rowHover: 'hover:bg-teal-100',
    loader: 'text-[#006666]',
    paginationBg: 'bg-[#006666]',
    paginationBgHover: 'hover:bg-[#005555]', // Verde mais escuro (do MenuBar)
    paginationText: 'text-white',
  },
  sima: {
    headerBg: 'bg-[#2c2c2c]',
    rowEven: 'even:bg-gray-100', // Cinza claro padrão
    rowHover: 'hover:bg-gray-200',
    loader: 'text-[#2c2c2c]',
    paginationBg: 'bg-[#2c2c2c]',
    paginationBgHover: 'hover:bg-[#444444]', // Cinza mais escuro (do MenuBar)
    paginationText: 'text-white',
  }
};

// Tipo para garantir que o 'database' é uma chave válida dos temas
type ThemeName = keyof typeof themes;

interface DataTableProps {
  database: DatabaseName; // Esta prop será usada como a 'ThemeName'
  tableName: string;
  dados: DataType;
  colunas: string[];
  loading: boolean;
  error: string | null;
  paginacao: PaginacaoState;
  onPageChange: (newPage: number) => void;
}

export default function DataTable({
  database, // Usaremos esta prop para selecionar o tema
  tableName,
  dados,
  colunas,
  loading,
  error,
  paginacao,
  onPageChange
}: DataTableProps) {

  // Seleciona o tema correto usando useMemo.
  // Ele só será recalculado se a prop 'database' mudar.
  const theme = useMemo(() => {
    // Garante que o 'database' é um nome de tema válido, senão usa 'furnas'
    const themeName = database as ThemeName;
    return themes[themeName] || themes.furnas;
  }, [database]);


  // --- Estados de Feedback (Estilizados com o Tema) ---

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Cor do ícone agora é dinâmica */}
          <Loader2 className={`animate-spin ${theme.loader}`} size={40} />
          <p className="mt-3 text-lg font-medium text-gray-700">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Erros devem ser sempre vermelhos, independente do tema
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

  // Estado vazio é neutro, não precisa de tema
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

  // --- Renderização da Tabela (Estilizada com o Tema) ---
  return (
    <div className="p-4">
      <div className="overflow-hidden bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            
            {/* 2. Cabeçalho com cor dinâmica do tema */}
            <thead className={theme.headerBg}>
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

            {/* 3. Corpo com linhas "zebra" dinâmicas */}
            <tbody className="bg-white">
              {dados.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  // Linhas zebradas e hover dinâmicos + borda movida para o TR
                  className={`
                    odd:bg-white ${theme.rowEven} ${theme.rowHover} 
                    transition-colors duration-150 
                    border-t border-gray-200 first:border-t-0
                  `}
                >
                  {colunas.map((coluna) => (
                    <td 
                      key={`${rowIndex}-${coluna}`} 
                      // Borda removida do TD (agora está no TR)
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
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

      {/* 4. Paginação (passando o tema para o sub-componente) */}
      <Pagination 
        paginacao={paginacao}
        onPageChange={onPageChange}
        theme={theme} // Passa o objeto do tema
      />
    </div>
  );
}

// --- Componente de Paginação (Estilizado com o Tema) ---

// Define o tipo do 'theme' que a paginação espera
type PaginationTheme = {
  paginationBg: string;
  paginationBgHover: string;
  paginationText: string;
};

interface PaginationProps {
  paginacao: PaginacaoState;
  onPageChange: (newPage: number) => void;
  theme: PaginationTheme; // Recebe o tema
}

function Pagination({ paginacao, onPageChange, theme }: PaginationProps) {
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
          // Botões agora usam as cores do tema!
          className={`
            px-3 py-1.5 text-sm font-medium rounded-lg 
            ${theme.paginationBg} ${theme.paginationText} ${theme.paginationBgHover}
            disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
            transition-colors
          `}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">
          Página <span className="font-semibold text-gray-900">{page}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          // Botões agora usam as cores do tema!
          className={`
            px-3 py-1.5 text-sm font-medium rounded-lg 
            ${theme.paginationBg} ${theme.paginationText} ${theme.paginationBgHover}
            disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
            transition-colors
          `}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}