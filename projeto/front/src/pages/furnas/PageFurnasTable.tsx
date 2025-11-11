// src/pages/furnas/PageFurnasTable.tsx
import { useState, useMemo } from "react";
import { Menu } from "../../components/commons/TableMenu";
import DataTable from "../../components/commons/DataTable";
import { Placeholder } from "../../components/commons/TablePlaceholder";
import { FilterBar } from "../../components/Filters/FilterBar";
import { useTableData } from "../../hooks/useTableData";
import { ModalExport } from "../../components/Export/ModalExport";
import type { FilterParams, ColumnInfo, ColumnType } from "../../types/types";

// --- LISTA DE TABELAS (Sem alteração) ---
const tabelasDisponiveis = [
  { label: "Abiótico (Coluna)", value: "abiotico-coluna" },
  { label: "Abiótico (Superfície)", value: "abiotico-superficie" },
  { label: "Água Matéria Orgânica Sedimento", value: "agua-materia-organica-sedimento" },
  { label: "Biótico (Coluna)", value: "biotico-coluna" },
  { label: "Biótico (Superfície)", value: "biotico-superficie" },
  { label: "Bolhas", value: "bolhas" },
  { label: "Câmara Solo", value: "camara-solo" },
  { label: "Campanha", value: "campanha" },
  { label: "Campanha por Tabela", value: "campanha-por-tabela" },
  { label: "Campo por Tabela", value: "campo-por-tabela" },
  { label: "Carbono", value: "carbono" },
  { label: "Concentração Gás Água", value: "concentracao-gas-agua" },
  { label: "Concentração Gás Sedimento", value: "concentracao-gas-sedimento" },
  { label: "Dados Precipitação", value: "dados-precipitacao" },
  { label: "Dados Represa", value: "dados-represa" },
  { label: "Difusão", value: "difusao" },
  { label: "Dupla Dessorção Água", value: "dupla-dessorcao-agua" },
  { label: "Fluxo Bolhas INPE", value: "fluxo-bolhas-inpe" },
  { label: "Fluxo Carbono", value: "fluxo-carbono" },
  { label: "Fluxo Difusivo", value: "fluxo-difusivo" },
  { label: "Fluxo Difusivo INPE", value: "fluxo-difusivo-inpe" },
  { label: "Gases em Bolhas", value: "gases-em-bolhas" },
  { label: "Horiba", value: "horiba" },
  { label: "Instituição", value: "instituicao" },
  {
    label: "Íons na Água Intersticial do Sedimento",
    value: "ions-na-agua-intersticial-do-sedimento",
  },
  { label: "Medida Campo Coluna", value: "medida-campo-coluna" },
  { label: "Medida Campo Superfície", value: "medida-campo-superficie" },
  { label: "Nutrientes Sedimento", value: "nutrientes-sedimento" },
  { label: "Parâmetros Biológicos Físicos Água", value: "parametros-biologicos-fisicos-agua" },
  { label: "PFQ", value: "pfq" },
  { label: "Reservatório", value: "reservatorio" },
  { label: "Sítio", value: "sitio" },
  { label: "Tabela", value: "tabela" },
  { label: "TC", value: "tc" },
  { label: "Variáveis Físicas Químicas da Água", value: "variaveis-fisicas-quimicas-da-agua" },
];

export function FurnasTablePage() {
  const [tabelaAtiva, setTabelaAtiva] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { dados, colunas, paginacao, loading, error } = useTableData(
    "furnas",
    tabelaAtiva,
    currentPage,
    filters,
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
      // 1. Regras especiais por nome
      const lowerCol = coluna.toLowerCase();
      if (lowerCol.startsWith("data")) return "date";
      if (lowerCol.startsWith("hora")) return "time";

      // 2. Inferência robusta baseada em dados
      // Itera pelos dados até encontrar um valor não-nulo
      for (const row of dados) {
        const value = row[coluna];

        if (value !== null && value !== undefined) {
          const type = typeof value;
          if (type === "number") return "number";
          if (type === "string") return "string";
          // (Pode adicionar 'boolean' aqui se necessário)
        }
      }

      // 3. Se a coluna inteira for nula ou os dados estiverem vazios,
      // assume 'string' como padrão seguro.
      return "string";
    };

    // Mapeia as colunas usando o helper robusto
    return colunas.map((coluna) => {
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

  // --- JSX (Sem alteração) ---
  return (
    <div className="flex h-screen bg-gray-100">
      <Menu
        database="furnas"
        tabelas={tabelasDisponiveis}
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={handleSelectTabela}
      />

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

        {tabelaAtiva && (
          <ModalExport
            currentPage={paginacao.page}
            currentLimit={paginacao.limit}
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
