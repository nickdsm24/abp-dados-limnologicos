// SimaTablePage.tsx 
import { useState } from 'react';
import { Menu } from '../../components/commons/TableMenu';
import DataTable from '../../components/commons/DataTable';
import { Placeholder } from '../../components/commons/TablePlaceholder';
// 1. Importar o FilterBar
import { FilterBar } from '../../components/Filters/FilterBar'; // Ajuste o caminho se necessário
// 2. Importar o Hook e os Tipos
import { useTableData } from '../../hooks/useTableData';
import type { FilterParams } from '../../types/types'; // Ajuste o caminho se necessário

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

  // 3. LEVANTAR O ESTADO: Adicionar estados para filtros e paginação
  const [filters, setFilters] = useState<FilterParams>({});
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 4. CHAMAR O HOOK AQUI: O pai agora busca os dados
  const { dados, colunas, paginacao, loading, error } = useTableData(
    'sima', // <-- Database correto
    tabelaAtiva,
    currentPage,
    filters
  );

  // 5. Função para lidar com a seleção de uma NOVA tabela
  const handleSelectTabela = (novaTabela: string) => {
    setTabelaAtiva(novaTabela);
    // Reseta filtros e páginação ao trocar de tabela
    setFilters({});
    setCurrentPage(1);
  };

  // 6. Função para o componente de Paginação
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu Lateral */}
      <Menu 
        title="Dados Sima"
        tabelas={tabelasDisponiveis}
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={handleSelectTabela} // <-- Usar o novo handler
      />

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {tabelaAtiva ? (
          <>
            {/* 7. Renderizar o FilterBar */}
            <FilterBar 
              key={tabelaAtiva} // Força o reset do FilterBar ao trocar de tabela
              onApplyFilters={setFilters}
              onClearFilters={() => setFilters({})}
            />

            {/* 8. Passar todas as props necessárias para o DataTable */}
            <DataTable 
              database="sima"
              tableName={tabelaAtiva} 
              
              // Props de dados (resultado do hook)
              dados={dados}
              colunas={colunas}
              loading={loading}
              error={error}
              
              // Props de Paginação
              paginacao={paginacao}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <Placeholder />
        )}
      </main>
    </div>
  );
}

export default SimaTablePage;