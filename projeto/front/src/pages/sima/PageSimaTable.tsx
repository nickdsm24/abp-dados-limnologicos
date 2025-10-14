import { useState } from 'react';
import { Menu } from '../../components/commons/TableMenu';
import DataTable from '../../components/commons/DataTable';
import { Placeholder } from '../../components/commons/TablePlaceholder';

// --- LISTA DE TABELAS DISPONÍVEIS PARA SIMA ---
const tabelasDisponiveis = [
  { label: 'Campo Tabela', value: 'campo-tabela' },
  { label: 'Estação', value: 'estacao' },
  { label: 'Sensor', value: 'sensor' },
  { label: 'Sima', value: 'sima' },
  { label: 'Sima Offline', value: 'sima-offline' },
];

export function SimaTablePage() {
  // O estado continua gerenciando a tabela ativa nesta página
  const [tabelaAtiva, setTabelaAtiva] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 1. Reutilizamos o mesmo componente de Menu */}
      <Menu 
        tabelas={tabelasDisponiveis} // Passamos a lista de tabelas do Sima
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={setTabelaAtiva}
      />

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {tabelaAtiva ? (
          // 2. Reutilizamos o mesmo DataTable, mas agora informando o banco "sima"
          <DataTable 
            database="sima" // <-- AQUI ESTÁ A MUDANÇA PRINCIPAL
            tableName={tabelaAtiva} 
          />
        ) : (
          // 3. Reutilizamos o mesmo placeholder
          <Placeholder />
        )}
      </main>
    </div>
  );
}

export default SimaTablePage;