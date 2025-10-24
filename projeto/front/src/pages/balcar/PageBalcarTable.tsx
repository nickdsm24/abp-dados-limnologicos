// PageBalcarTable.tsx (CORRIGIDO E ATUALIZADO)

import { useState } from 'react';
import { Menu } from '../../components/commons/TableMenu';
import DataTable from '../../components/commons/DataTable';
import { Placeholder } from '../../components/commons/TablePlaceholder';
// 1. Importar o FilterBar
import { FilterBar } from '../../components/Filters/FilterBar'; 
// 2. Importar o Hook e os Tipos necessários
import { useTableData } from '../../hooks/useTableData';
import type { FilterParams } from '../../types/types'; // Ajuste o caminho

// --- LISTA DE TABELAS DISPONÍVEIS PARA A PÁGINA BALCAR ---
const tabelasDisponiveis = [
  { label: 'Campanha', value: 'campanha' },
  { label: 'Fluxo INPE', value: 'fluxoinpe' },
  { label: 'Instituição', value: 'instituicao' },
  { label: 'Reservatório', value: 'reservatorio' },
  { label: 'Sítio', value: 'sitio' },
  { label: 'Tabela Campo', value: 'tabelacampo' },
];

export function PageBalcarTable() {
  const [tabelaAtiva, setTabelaAtiva] = useState<string | null>(null);

  // 3. LEVANTAR O ESTADO: Adicionar estados para filtros e paginação
  const [filters, setFilters] = useState<FilterParams>({});
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 4. CHAMAR O HOOK AQUI: O pai agora busca os dados
  // *** IMPORTANTE: O database foi corrigido para 'balcar' ***
  const { dados, colunas, paginacao, loading, error } = useTableData(
    'balcar', // <-- CORRIGIDO de 'furnas' para 'balcar'
    tabelaAtiva, // Passando string | null
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

  // 6. Função para o componente de Paginação (que DataTable deve ter)
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu Lateral */}
      <Menu 
        title="Dados Balcar" // Título dinâmico para a página
        tabelas={tabelasDisponiveis}
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={handleSelectTabela} // Usar a nova função
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

            {/* 8. Passar dados, paginação e handlers para o DataTable */}
            <DataTable 
              database="balcar" // <-- CORRIGIDO
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

export default PageBalcarTable;