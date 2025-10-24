// FurnasTablePage.tsx (MODIFICADO)

import { useState } from 'react';
import { Menu } from '../../components/commons/TableMenu';
import DataTable from '../../components/commons/DataTable';
import { Placeholder } from '../../components/commons/TablePlaceholder';
import { FilterBar } from '../../components/Filters/FilterBar'; // Importar o FilterBar
import { useTableData } from '../../hooks/useTableData';
// Importar o tipo de Filtro
import type { FilterParams } from '../../types/types'; // Ajuste o caminho

// --- LISTA DE TABELAS DISPONÍVEIS ... (seu código original) ---
const tabelasDisponiveis = [
 { label: 'Abiótico (Coluna)', value: 'abiotico-coluna' },
  // ... resto das tabelas
];

export function FurnasTablePage() {
 // Estado da tabela ativa (já estava em TS)
 const [tabelaAtiva, setTabelaAtiva] = useState<string | null>(null);
 
 // LEVANTAR O ESTADO: Tipar os novos estados
 const [filters, setFilters] = useState<FilterParams>({});
 const [currentPage, setCurrentPage] = useState<number>(1);

 // CHAMAR O HOOK AQUI: O pai agora busca os dados
 const { dados, colunas, paginacao, loading, error } = useTableData(
  'furnas',
  tabelaAtiva, // Passando string | null
  currentPage,
  filters
 );

 // Tipar o handler de seleção
 const handleSelectTabela = (novaTabela: string) => {
  setTabelaAtiva(novaTabela);
  // Reseta filtros e páginação ao trocar de tabela
  setFilters({});
  setCurrentPage(1);
 };

 // Tipar o handler de página
 const handlePageChange = (newPage: number) => {
  setCurrentPage(newPage);
 };

 return (
  <div className="flex h-screen bg-gray-100">
   {/* Menu Lateral */}
   <Menu 
    title = "Dados Furnas"
    tabelas={tabelasDisponiveis}
    tabelaAtiva={tabelaAtiva}
    onSelectTabela={handleSelectTabela} // Usar a nova função
   />

   {/* Área de Conteúdo Principal */}
   <main className="flex-1 overflow-y-auto">
    {tabelaAtiva ? (
     <>
      {/* Renderizar o FilterBar */}
      <FilterBar 
       key={tabelaAtiva} // Força o reset do FilterBar ao trocar de tabela
       onApplyFilters={setFilters}
       onClearFilters={() => setFilters({})}
      />

      {/* Passar dados, paginação e handlers para o DataTable */}
      <DataTable 
       database="furnas" 
       tableName={tabelaAtiva} 
       
       // Props de dados (resultado do hook)
       dados={dados}
       colunas={colunas}
       loading={loading}
       error={error}
       
       // Props de Paginação (assumindo que DataTable foi refatorado)
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

export default FurnasTablePage;