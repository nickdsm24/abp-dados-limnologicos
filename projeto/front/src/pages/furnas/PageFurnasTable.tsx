// src/pages/furnas/PageFurnasTable.tsx
import { useState, useMemo } from "react";
import { Menu } from "../../components/commons/TableMenu";
import DataTable from "../../components/commons/DataTable";
import { Placeholder } from "../../components/commons/TablePlaceholder";
import { FilterBar } from "../../components/Filters/FilterBar";
import { useTableData } from "../../hooks/useTableData";
import { ModalExport } from "../../components/Export/ModalExport";
// Importação do ícone de menu
import { Menu as MenuIcon } from "lucide-react";
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

  // NOVO ESTADO: Controle da Sidebar no Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
     */
    const getColumnType = (coluna: string): ColumnType => {
      const lowerCol = coluna.toLowerCase();

      // 1. Regras especiais por nome (Heurística)
      if (lowerCol.startsWith("data")) return "date";
      if (lowerCol.startsWith("hora")) return "time";
      if (lowerCol.startsWith("descri")) return "string"; // Nova regra: descri... -> string

      // 2. Inferência baseada em dados (Paginação atual)
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

      // 3. Fallback final (Quando tudo for null)
      // Se não for data, hora ou descrição, e for tudo null, assume que é numérico
      return "number";
    };

    // Mapeia as colunas usando o helper robusto
    return colunas.map((coluna) => {
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

  // --- JSX (Refatorado para Responsividade) ---
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Menu Lateral Responsivo */}
      <Menu
        database="furnas"
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
              className="text-gray-600 hover:text-[#1777af] transition-colors p-1"
              aria-label="Abrir menu"
            >
              <MenuIcon className="w-7 h-7" />
            </button>
            <span className="font-bold text-lg text-[#1777af]">
              Projeto Furnas
            </span>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          {tabelaAtiva ? (
            <>
              <FilterBar
                database={"furnas"}
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
        </div>

        {/* Modal (fora do container de scroll para evitar problemas de z-index) */}
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