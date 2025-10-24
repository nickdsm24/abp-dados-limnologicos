//src/components/commons/TableMenu
import { Database, Zap } from 'lucide-react';

interface TabelaDisponivel {
  label: string;
  value: string;
}

// 1. ADICIONAMOS A PROP 'title' COMO OPCIONAL
interface MenuProps {
  title?: string; // <-- MUDANÇA AQUI
  tabelas: TabelaDisponivel[];
  tabelaAtiva: string | null;
  onSelectTabela: (value: string) => void;
}

// 2. RECEBEMOS A PROP 'title'
export function Menu({ title, tabelas, tabelaAtiva, onSelectTabela }: MenuProps) {
  return (
    <aside className="w-64 bg-[#1777af] text-white flex flex-col">
      
      {/* Cabeçalho do Menu (Marca) - Permanece igual */}
      <div className="flex items-center justify-center h-20 border-b border-white/20">
        <Zap className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">FurnasData</h1>
      </div>

      {/* 3. TÍTULO DA SEÇÃO (NOVO) */}
      {/* Esta seção só aparece se a prop 'title' for passada */}
      {title && (
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-sm font-semibold uppercase text-gray-300 tracking-wider">
            {title}
          </h3>
        </div>
      )}

      {/* Lista de Itens do Menu */}
      {/* 4. Ajustamos o padding top para 'py-4' se o título existir, ou 'py-6' se não */}
      <nav className={`flex-1 px-4 space-y-2 ${title ? 'py-4' : 'py-6'}`}>
        {tabelas.map((tabela) => {
          const isAtivo = tabela.value === tabelaAtiva;
          return (
            <button
              key={tabela.value}
              onClick={() => onSelectTabela(tabela.value)}
              className={`
                w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors duration-200
                ${isAtivo
                  ? 'bg-white/20 text-white' // Estilo do item ativo
                  : 'text-gray-200 hover:bg-white/10 hover:text-white' // Estilo do item inativo
                }
              `}
            >
              <Database className="h-5 w-5 mr-3" />
              <span>{tabela.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Rodapé do Menu */}
      <div className="p-4 border-t border-white/20 text-center text-xs text-gray-300">
        <p>&copy; {new Date().getFullYear()} - Projeto Furnas</p>
      </div>
    </aside>
  );
}