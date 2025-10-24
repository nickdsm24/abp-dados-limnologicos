// PageBalcarTable.tsx 
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

// --- LISTA DE TABELAS DISPONÍVEIS PARA A PÁGINA BALCAR ---
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
  // 4. Adicionar estado para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { dados, colunas, paginacao, loading, error } = useTableData(
    'balcar', // Database correto
    tabelaAtiva,
    currentPage,
    filters
  );

  // 5. Lógica 'useMemo' para inferir os tipos de coluna (A "Ponte")
  const colunasDisponiveis = useMemo((): ColumnInfo[] => {
    // Se não houver colunas (ex: estado inicial), retorna array vazio
    if (!colunas || colunas.length === 0) {
      return [];
    }

    // Pega a primeira linha de dados para inspecionar os tipos
    const primeiraLinha: DataRow | undefined = dados?.[0];

    return colunas.map((colNome) => {
      let tipo: ColumnType = 'unknown';

      // 1. Inferir por prefixo (data/hora)
      if (colNome.startsWith('data')) {
        tipo = 'date';
      } else if (colNome.startsWith('hora')) {
        tipo = 'time';
      } 
      // 2. Inferir pelo tipo de dado da primeira linha
      else if (primeiraLinha) {
        const valor = primeiraLinha[colNome];
        if (typeof valor === 'number') {
          tipo = 'number';
        } else if (typeof valor === 'string') {
          tipo = 'string';
        }
      }
      // 3. Se ainda for 'unknown' (ex: primeiraLinha é null), padrão para 'string'
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
        title="Dados Balcar"
        database='balcar'
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
      </main>

      {/* 7. Renderizar o Modal (controlado pela página-pai) */}
      {tabelaAtiva && ( // Só renderiza o modal se houver uma tabela ativa
        <ModalExport
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          database="balcar" // Database correto
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