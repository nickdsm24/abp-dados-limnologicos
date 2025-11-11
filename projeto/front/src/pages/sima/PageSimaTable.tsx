// src/pages/sima/PageSimaTable.tsx
import { useState, useMemo } from 'react'; 
import { Menu } from '../../components/commons/TableMenu';
import DataTable from '../../components/commons/DataTable';
import { Placeholder } from '../../components/commons/TablePlaceholder';
import { FilterBar } from '../../components/Filters/FilterBar';
import { ModalExport } from '../../components/Export/ModalExport'; 
import { useTableData } from '../../hooks/useTableData';
import type { 
  FilterParams, 
  ColumnInfo, 
  ColumnType, 
} from '../../types/types'; // Ajuste o caminho

// --- LISTA DE TABELAS (Sem alteração) ---
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

  const { dados, colunas, paginacao, loading, error } = useTableData(
    'sima', // Database correto
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
     * Ele varre os dados para encontrar o primeiro valor não-nulo
     * e usa o tipo desse valor.
     */
    const getColumnType = (coluna: string): ColumnType => {
      // 1. Regras especiais por nome (case-insensitive)
      const lowerCol = coluna.toLowerCase();
      if (lowerCol.startsWith('data')) return 'date';
      if (lowerCol.startsWith('hora')) return 'time';

      // 2. Inferência robusta baseada em dados
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

      // 3. Se a coluna inteira for nula ou os dados estiverem vazios, 
      // assume 'string' como padrão seguro.
      return 'string';
    };

    // Mapeia as colunas usando o helper robusto
    return colunas.map(coluna => {
      return {
        name: coluna,
        type: getColumnType(coluna),
      };
    });
  }, [colunas, dados]); // Depende de 'colunas' e 'dados'
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
  	        <FilterBar 
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
  	  </main>

  	  {/* Modal de Exportação */}
  	  {tabelaAtiva && (
  	    <ModalExport
  	      currentPage={paginacao.page}
  	      currentLimit={paginacao.limit}
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