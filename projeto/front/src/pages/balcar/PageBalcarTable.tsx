import { useState } from 'react';
import { Menu } from '../../components/commons/TableMenu';
import DataTable from '../../components/commons/DataTable';
import { Placeholder } from '../../components/commons/TablePlaceholder';

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
  // O estado gerencia a tabela ativa para esta página
  const [tabelaAtiva, setTabelaAtiva] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Reutilizamos o Menu. 
        Para um bônus, podemos passar um título diferente para ele.
        (Isso requer a "melhoria opcional" que discutimos para o Menu)
      */}
      <Menu 
        title="Dados Balcar" // Título dinâmico para a página
        tabelas={tabelasDisponiveis}
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={setTabelaAtiva}
      />

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {tabelaAtiva ? (
          // Reutilizamos o DataTable, informando o banco "furnas" como solicitado
          <DataTable 
            database="furnas" // <-- BUSCANDO DADOS DO BANCO "FURNAS"
            tableName={tabelaAtiva} 
          />
        ) : (
          <Placeholder />
        )}
      </main>
    </div>
  );
}

export default PageBalcarTable;