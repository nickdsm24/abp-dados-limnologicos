// src/pages/sima/PageSimaTable.tsx
import { useState, useMemo } from 'react'; 
import { Menu } from '../../components/commons/TableMenu'; // Ajuste o caminho conforme seu projeto
import DataTable from '../../components/commons/DataTable'; // Ajuste o caminho
import { Placeholder } from '../../components/commons/TablePlaceholder'; // Ajuste o caminho
import { FilterBar } from '../../components/Filters/FilterBar'; // Ajuste o caminho
import { ModalExport } from '../../components/Export/ModalExport'; // Ajuste o caminho
import { useTableData } from '../../hooks/useTableData'; // Ajuste o caminho
// Importamos o ícone de Menu Hambúrguer
import { Menu as MenuIcon } from "lucide-react"; 

import type { 
  FilterParams, 
  ColumnInfo, 
  ColumnType, 
} from '../../types/types'; 

const tabelasDisponiveis = [
  { label: 'Campo Tabela', value: 'campo-tabela' },
  { label: 'Estação', value: 'estacao' },
  { label: 'Sensor', value: 'sensor' },
  { label: 'Sima', value: 'sima' },
  { label: 'Sima Offline', value: 'sima-offline' },
];

export function SimaTablePage() {
  const [tabelaAtiva, setTabelaAtiva] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ESTADO PARA CONTROLAR A SIDEBAR NO MOBILE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { dados, colunas, paginacao, loading, error } = useTableData(
    'sima', 
    tabelaAtiva,
    currentPage,
    filters
  );

  const colunasDisponiveis = useMemo((): ColumnInfo[] => {
    const getColumnType = (coluna: string): ColumnType => {
      const lowerCol = coluna.toLowerCase();
      if (lowerCol.startsWith('data')) return 'date';
      if (lowerCol.startsWith('hora')) return 'time';
      if (lowerCol.startsWith('descri')) return 'string';

      for (const row of dados) {
        const value = row[coluna];
        if (value !== null && value !== undefined) {
          const type = typeof value;
          if (type === 'number') return 'number';
          if (type === 'string') return 'string';
        }
      }
      return 'number';
    };

    return colunas.map(coluna => {
      return {
        name: coluna,
        type: getColumnType(coluna),
      };
    });
  }, [colunas, dados]); 

  const handleSelectTabela = (novaTabela: string) => {
    setTabelaAtiva(novaTabela);
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu Lateral Responsivo */}
      <Menu 
        database='sima'
        title="Dados Sima"
        tabelas={tabelasDisponiveis}
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={handleSelectTabela}
        // Props de controle
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* BARRA DE TOPO MOBILE (Hambúrguer) */}
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
              Projeto Sima
            </span>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto">
          {tabelaAtiva ? (
            <>
              <FilterBar 
                database={"sima"}
                tableName={tabelaAtiva}
                key={tabelaAtiva}
                onApplyFilters={setFilters}
                onClearFilters={() => setFilters({})}
                onExportClick={() => setIsModalOpen(true)}
                colunasDisponiveis={colunasDisponiveis} 
              />

              <DataTable 
                database="sima"
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
          database="sima"
          tableName={tabelaAtiva}
          currentFilters={filters}
          totalRecords={paginacao.total}
          pageRecords={dados.length}
        />
      )}
    </div>
  );
}

export default SimaTablePage;