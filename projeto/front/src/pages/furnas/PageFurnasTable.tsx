// FurnasTablePage.tsx (MODIFICADO)
import { useState, useMemo } from 'react'; // 1. Importar useMemo
import { Menu } from '../../components/commons/TableMenu';
import DataTable from '../../components/commons/DataTable';
import { Placeholder } from '../../components/commons/TablePlaceholder';
import { FilterBar } from '../../components/Filters/FilterBar';
import { useTableData } from '../../hooks/useTableData';
import { ModalExport } from '../../components/Export/ModalExport'; // 2. Importar o Modal

// 3. Importar os tipos necessários
import type { FilterParams, ColumnInfo, ColumnType } from '../../types/types'; 

// --- LISTA DE TABELAS DISPONÍVEIS PARA FURNAS (COMPLETA E ORDENADA) ---
const tabelasDisponiveis = [
  { label: 'Abiótico (Coluna)', value: 'abiotico-coluna' },
  { label: 'Abiótico (Superfície)', value: 'abiotico-superficie' },
  { label: 'Água Matéria Orgânica Sedimento', value: 'agua-materia-organica-sedimento' },
  { label: 'Biótico (Coluna)', value: 'biotico-coluna' },
  { label: 'Biótico (Superfície)', value: 'biotico-superficie' },
  { label: 'Bolhas', value: 'bolhas' },
  { label: 'Câmara Solo', value: 'camara-solo' },
  { label: 'Campanha', value: 'campanha' },
  { label: 'Campanha por Tabela', value: 'campanha-por-tabela' },
  { label: 'Campo por Tabela', value: 'campo-por-tabela' },
  { label: 'Carbono', value: 'carbono' },
  { label: 'Concentração Gás Água', value: 'concentracao-gas-agua' },
  { label: 'Concentração Gás Sedimento', value: 'concentracao-gas-sedimento' },
  { label: 'Dados Precipitação', value: 'dados-precipitacao' },
  { label: 'Dados Represa', value: 'dados-represa' },
  { label: 'Difusão', value: 'difusao' },
  { label: 'Dupla Dessorção Água', value: 'dupla-dessorcao-agua' },
  { label: 'Fluxo Bolhas INPE', value: 'fluxo-bolhas-inpe' },
  { label: 'Fluxo Carbono', value: 'fluxo-carbono' },
  { label: 'Fluxo Difusivo', value: 'fluxo-difusivo' },
  { label: 'Fluxo Difusivo INPE', value: 'fluxo-difusivo-inpe' },
  { label: 'Gases em Bolhas', value: 'gases-em-bolhas' },
  { label: 'Horiba', value: 'horiba' },
  { label: 'Instituição', value: 'instituicao' },
  { label: 'Íons na Água Intersticial do Sedimento', value: 'ions-na-agua-intersticial-do-sedimento' },
  { label: 'Medida Campo Coluna', value: 'medida-campo-coluna' },
  { label: 'Medida Campo Superfície', value: 'medida-campo-superficie' },
  { label: 'Nutrientes Sedimento', value: 'nutrientes-sedimento' },
  { label: 'Parâmetros Biológicos Físicos Água', value: 'parametros-biologicos-fisicos-agua' },
  { label: 'PFQ', value: 'pfq' },
  { label: 'Reservatório', value: 'reservatorio' },
  { label: 'Sítio', value: 'sitio' },
  { label: 'Tabela', value: 'tabela' },
  { label: 'TC', value: 'tc' },
  { label: 'Variáveis Físicas Químicas da Água', value: 'variaveis-fisicas-quimicas-da-agua' },
];

export function FurnasTablePage() {
  const [tabelaAtiva, setTabelaAtiva] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // 4. Adicionar estado para o modal de exportação
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hook principal de busca de dados
  const { dados, colunas, paginacao, loading, error } = useTableData(
    'furnas',
    tabelaAtiva,
    currentPage,
    filters
  );

  // 5. LÓGICA DO PASSO 2: Gerar colunasDisponiveis com useMemo
  const colunasDisponiveis = useMemo((): ColumnInfo[] => {
    // Pega a primeira linha de dados com segurança (pode ser undefined)
    const firstRow = dados?.[0];

    // Mapeia o array de 'colunas' (strings) para 'ColumnInfo' (objetos)
    return colunas.map(coluna => {
      
      // Lógica de inferência de tipo
      let tipo: ColumnType = 'unknown';

      if (coluna.toLowerCase().startsWith('data')) {
        tipo = 'date';
      } else if (coluna.toLowerCase().startsWith('hora')) {
        tipo = 'time';
      } else if (firstRow && typeof firstRow[coluna] === 'number') {
        // Se temos dados, checamos o tipo do primeiro registro
        tipo = 'number';
      } else {
        // Caso contrário, assumimos string (ou se firstRow não existir)
        tipo = 'string';
      }
      
      return {
        name: coluna,
        type: tipo,
      };
    });
  }, [colunas, dados]); // Depende de 'colunas' e 'dados'

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
      <Menu 
        database='furnas'
        tabelas={tabelasDisponiveis}
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={handleSelectTabela}
      />

      <main className="flex-1 overflow-y-auto">
        {tabelaAtiva ? (
          <>
            {/* 6. Passar as novas props para o FilterBar */}
            <FilterBar 
              key={tabelaAtiva}
              onApplyFilters={setFilters}
              onClearFilters={() => setFilters({})}
              onExportClick={() => setIsModalOpen(true)} // Prop para abrir o modal
              colunasDisponiveis={colunasDisponiveis}  // Prop do Passo 2
            />

            <DataTable 
              database="furnas" 
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

        {/* 7. Renderizar o Modal (controlado pela página) */}
        {/* Usamos 'tabelaAtiva &&' para garantir que não seja null */}
        {tabelaAtiva && (
          <ModalExport
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            database="furnas"
            tableName={tabelaAtiva}
            currentFilters={filters}
            totalRecords={paginacao.total}
            pageRecords={dados.length}
          />
        )}
      </main>
    </div>
  );
}

export default FurnasTablePage;