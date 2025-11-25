// src/pages/sima/PageBalcarTable.tsx
import { useState, useMemo } from 'react'; 
import { Menu } from '../../components/commons/TableMenu';
import DataTable from '../../components/commons/DataTable';
import { Placeholder } from '../../components/commons/TablePlaceholder';
import { FilterBar } from '../../components/Filters/FilterBar';
import { ModalExport } from '../../components/Export/ModalExport'; 
import { useTableData } from '../../hooks/useTableData';
// Importação do ícone de menu (renomeado para evitar conflito com o componente Menu)
import { Menu as MenuIcon } from "lucide-react";

import type { 
  FilterParams, 
  ColumnInfo, 
  ColumnType, 
} from '../../types/types'; // Ajuste o caminho

// --- LISTA DE TABELAS (Balcar) ---
const tabelasDisponiveis = [
  { label: 'Campanha', value: 'campanha' },
  { label: 'Fluxo INPE', value: 'fluxo-inpe' },
  { label: 'Instituição', value: 'instituicao' },
  { label: 'Reservatório', value: 'reservatorio' },
  { label: 'Sítio', value: 'sitio' },
  { label: 'Tabela Campo', value: 'tabela-campo' },
];

export function PageBalcarTable() {
  const [tabelaAtiva, setTabelaAtiva] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NOVO ESTADO: Controle da Sidebar no Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { dados, colunas, paginacao, loading, error } = useTableData(
    'balcar', // Database correto
    tabelaAtiva,
    currentPage,
    filters
  );

  //
  // *** INÍCIO DA REFATORAÇÃO (useMemo) ***
  //
  const colunasDisponiveis = useMemo((): ColumnInfo[] => {

    /**
     * Helper que infere o tipo de uma coluna.
     */
    const getColumnType = (coluna: string): ColumnType => {
      const lowerCol = coluna.toLowerCase();

      // 1. Regras especiais por nome (Heurística)
      // Prioridade para definir tipos óbvios pelo nome antes de olhar os dados
      if (lowerCol.startsWith('data')) return 'date';
      if (lowerCol.startsWith('hora')) return 'time';
      if (lowerCol.startsWith('descri')) return 'string'; // Nova regra: descri... -> string

      // 2. Inferência baseada em dados (Paginação atual)
      // Itera pelos dados até encontrar um valor não-nulo
      for (const row of dados) {
        const value = row[coluna];
        
        if (value !== null && value !== undefined) {
          const type = typeof value;
          if (type === 'number') return 'number';
          if (type === 'string') return 'string';
          // (Pode adicionar 'boolean' aqui se necessário)
        }
      }

      // 3. Fallback final (Quando tudo for null)
      // Se não for data, hora ou descrição, e for tudo null, assume que é numérico
      return 'number';
    };

    // Mapeia as colunas usando o helper atualizado
    return colunas.map(coluna => {
      return {
        name: coluna,
        type: getColumnType(coluna),
      };
    });
  }, [colunas, dados]); 
  //
  // *** FIM DA REFATORAÇÃO (useMemo) ***
  //

  const handleSelectTabela = (novaTabela: string) => {
    setTabelaAtiva(novaTabela);
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Menu Lateral Responsivo */}
      <Menu 
        title="Dados Balcar"
        database='balcar'
        tabelas={tabelasDisponiveis}
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={handleSelectTabela}
        // Props obrigatórias para o funcionamento responsivo
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        
        {/* BARRA DE TOPO MOBILE (Hambúrguer) */}
        {/* Visível apenas em telas menores que 'md' */}
        <div className="md:hidden bg-white p-4 shadow-sm flex items-center justify-between z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-600 hover:text-[#4682B4] transition-colors p-1"
              aria-label="Abrir menu"
            >
              <MenuIcon className="w-7 h-7" />
            </button>
            <span className="font-bold text-lg text-[#4682B4]">
              Projeto Balcar
            </span>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          {tabelaAtiva ? (
            <>
              <FilterBar 
                database={"balcar"}
                tableName={tabelaAtiva}
                key={tabelaAtiva}
                onApplyFilters={setFilters}
                onClearFilters={() => setFilters({})}
                onExportClick={() => setIsModalOpen(true)}
                colunasDisponiveis={colunasDisponiveis} 
              />

              <DataTable 
                database="balcar"
                tableName={tabelaAtiva} 
                dados={dados}
                colunas={colunas}
                loading={loading}
                error={error}
                paginacao={paginacao}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <Placeholder />
          )}
        </div>
      </main>

      {/* Modal de Exportação */}
      {tabelaAtiva && ( 
        <ModalExport
          currentPage={paginacao.page}
          currentLimit={paginacao.limit}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          database="balcar"
          tableName={tabelaAtiva}
          currentFilters={filters}
          totalRecords={paginacao.total}
          pageRecords={dados.length}
        />
      )}
    </div>
  );
}

export default PageBalcarTable;