//src/components/commons/TableMenu
import { useMemo } from "react";
// Adicionamos 'X' para o botão de fechar
import { Database, Table2, X } from "lucide-react";
import type { DatabaseName } from "../../types/types";

interface TabelaDisponivel {
  label: string;
  value: string;
}

interface MenuProps {
  title?: string;
  tabelas: TabelaDisponivel[];
  tabelaAtiva: string | null;
  onSelectTabela: (value: string) => void;
  database: DatabaseName;
  // NOVAS PROPS PARA RESPONSIVIDADE
  isOpen: boolean;
  onClose: () => void;
}

export function Menu({
  title,
  tabelas,
  tabelaAtiva,
  onSelectTabela,
  database,
  isOpen,
  onClose,
}: MenuProps) {
  const databaseDisplayName = useMemo(() => {
    switch (database) {
      case "furnas":
        return "Furnas";
      case "balcar":
        return "Balcar";
      case "sima":
        return "Sima";
      default:
        return "Database";
    }
  }, [database]);

  return (
    <>
      {/* 1. OVERLAY (Apenas Mobile) */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. SIDEBAR COM CLASSES RESPONSIVAS */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 text-white flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(to bottom, #2f2f2f, #3a3a3a, #4b4b4b)",
        }}
      >
        {/* Cabeçalho do Menu */}
        <div className="flex items-center justify-between px-4 h-20 border-b border-white/20">
          <div className="flex items-center">
            <Database className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">{databaseDisplayName}Data</h1>
          </div>
          {/* Botão Fechar (Apenas Mobile) */}
          <button onClick={onClose} className="md:hidden text-gray-300 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Título da Seção */}
        {title && (
          <div className="px-4 pt-6 pb-2">
            <h3 className="text-sm font-semibold uppercase text-gray-300 tracking-wider">
              {title}
            </h3>
          </div>
        )}

        {/* Lista de Itens */}
        <nav
          className={`flex-1 px-4 space-y-2 overflow-y-auto ${
            title ? "py-4" : "py-6"
          }`}
        >
          {tabelas.map((tabela) => {
            const isAtivo = tabela.value === tabelaAtiva;
            return (
              <button
                key={tabela.value}
                onClick={() => {
                  onSelectTabela(tabela.value);
                  onClose(); // Fecha o menu ao selecionar no mobile
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors duration-200
                  ${
                    isAtivo
                      ? "bg-white/20 text-white"
                      : "text-gray-200 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Table2 className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="truncate">{tabela.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Rodapé */}
        <div className="p-4 border-t border-white/20 text-center text-xs text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} - Projeto {databaseDisplayName}
          </p>
        </div>
      </aside>
    </>
  );
}