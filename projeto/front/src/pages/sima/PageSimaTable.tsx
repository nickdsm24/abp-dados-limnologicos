// SimaTablePage.tsx 
import { useState, useMemo } from 'react'; // 1. Importar useMemo
import { Menu } from '../../components/commons/TableMenu';
import DataTable from '../../components/commons/DataTable';
import { Placeholder } from '../../components/commons/TablePlaceholder';
import { FilterBar } from '../../components/Filters/FilterBar';
import { ModalExport } from '../../components/Export/ModalExport'; // 2. Importar ModalExport
import { useTableData } from '../../hooks/useTableData';
// 3. Importar todos os tipos necessários
import type { 
  FilterParams, 
  ColumnInfo, 
  ColumnType, 
  DataRow 
} from '../../types/types'; // Ajuste o caminho

// --- LISTA DE TABELAS DISPONÍVEIS PARA SIMA ---
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
  // 4. Adicionar estado para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { dados, colunas, paginacao, loading, error } = useTableData(
    'sima', // Database correto
    tabelaAtiva,
    currentPage,
    filters
  );

  // 5. Lógica 'useMemo' para inferir os tipos de coluna (A "Ponte")
  const colunasDisponiveis = useMemo((): ColumnInfo[] => {
    if (!colunas || colunas.length === 0) {
      return [];
    }

    const primeiraLinha: DataRow | undefined = dados?.[0];

    return colunas.map((colNome) => {
      let tipo: ColumnType = 'unknown';

      if (colNome.startsWith('data')) {
        tipo = 'date';
      } else if (colNome.startsWith('hora')) {
        tipo = 'time';
      } 
      else if (primeiraLinha) {
        const valor = primeiraLinha[colNome];
        if (typeof valor === 'number') {
          tipo = 'number';
        } else if (typeof valor === 'string') {
          tipo = 'string';
        }
      }
      
      if (tipo === 'unknown') {
        tipo = 'string';
      }
      
      return { name: colNome, type: tipo };
    });
  }, [colunas, dados]); // Recalcula se as colunas ou dados mudarem

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
      {/* Menu Lateral */}
      <Menu 
        database='sima'
        title="Dados Sima"
        tabelas={tabelasDisponiveis}
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={handleSelectTabela}
      />

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {tabelaAtiva ? (
          <>
            {/* 6. Passar as novas props para o FilterBar */}
            <FilterBar 
              key={tabelaAtiva}
              onApplyFilters={setFilters}
              onClearFilters={() => setFilters({})}
              onExportClick={() => setIsModalOpen(true)} // Abre o modal
              colunasDisponiveis={colunasDisponiveis}  // Passa as colunas inferidas
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
      </main>

      {/* 7. Renderizar o Modal (controlado pela página-pai) */}
      {tabelaAtiva && ( // Só renderiza o modal se houver uma tabela ativa
        <ModalExport
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          database="sima" // Database correto
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