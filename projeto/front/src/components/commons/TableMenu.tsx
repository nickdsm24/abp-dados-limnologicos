//src/components/commons/TableMenu
import { useMemo } from "react";
// 1. Ícones atualizados: 'Zap' removido, 'Table2' (ou 'Table') adicionado
import { Database, Table2 } from "lucide-react";
// 2. Importar o tipo 'DatabaseName' para a nova prop
import type { DatabaseName } from "../../types/types"; // Ajuste o caminho se necessário

interface TabelaDisponivel {
  label: string;
  value: string;
}

interface MenuProps {
  title?: string;
  tabelas: TabelaDisponivel[];
  tabelaAtiva: string | null;
  onSelectTabela: (value: string) => void;
  // 3. Adicionada nova prop 'database' para dinamizar o conteúdo
  database: DatabaseName;
}

export function Menu({ title, tabelas, tabelaAtiva, onSelectTabela, database }: MenuProps) {
  // 4. Lógica para formatar o nome do banco (ex: 'furnas' -> 'Furnas')
  const databaseDisplayName = useMemo(() => {
    switch (database) {
      case "furnas":
        return "Furnas";
      case "balcar":
        return "Balcar";
      case "sima":
        return "Sima";
      default:
        return "Database"; // Fallback
    }
  }, [database]);

  return (
    // 5. Cor de fundo atualizada para #2d3748
    <aside className="w-64 bg-[#2d3748] text-white flex flex-col">
      {/* 6. Cabeçalho do Menu (Marca) agora é dinâmico */}
      <div className="flex items-center justify-center h-20 border-b border-white/20">
        {/* Ícone 'Zap' trocado por 'Database' */}
        <Database className="h-8 w-8 mr-2" />
        {/* Título 'FurnasData' agora é dinâmico (ex: 'SimaData') */}
        <h1 className="text-2xl font-bold">{databaseDisplayName}Data</h1>
      </div>

      {/* Título da Seção (ex: "Dados Sima") - Lógica mantida */}
      {title && (
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-sm font-semibold uppercase text-gray-300 tracking-wider">{title}</h3>
        </div>
      )}

      {/* Lista de Itens do Menu */}
      {/* 4. Ajustamos o padding e ADICIONAMOS overflow-y-auto */}
      <nav className={`flex-1 px-4 space-y-2 overflow-y-auto ${title ? "py-4" : "py-6"}`}>
        {tabelas.map((tabela) => {
          const isAtivo = tabela.value === tabelaAtiva;
          return (
            <button
              key={tabela.value}
              onClick={() => onSelectTabela(tabela.value)}
              className={`
                 w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors duration-200
                 ${isAtivo
                  ? "bg-white/20 text-white"
                  : "text-gray-200 hover:bg-white/10 hover:text-white"}
                `}>
              <Table2 className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="truncate">{tabela.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 8. Rodapé do Menu agora é dinâmico */}
      <div className="p-4 border-t border-white/20 text-center text-xs text-gray-300">
        <p>
          &copy; {new Date().getFullYear()} - Projeto {databaseDisplayName}
        </p>
      </div>
    </aside>
  );
}