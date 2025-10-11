import { useState } from 'react';
import { Menu } from '../../components/Furnas/Table/FurnasTableMenu';
import FurnasTable from '../../components/Furnas/Table/FurnasTable'; // Verifique se a exportação default está correta
import { Placeholder } from '../../components/Furnas/Table/FurnasTablePlaceholder';

// --- LISTA DE TABELAS DISPONÍVEIS ---
// Podemos manter essa lista aqui ou importá-la de um arquivo de configuração
const tabelasDisponiveis = [
  { label: 'Sítios', value: 'sitio' },
  { label: 'Reservatórios', value: 'reservatorio' },
  { label: 'Campanhas', value: 'campanha' },
  { label: 'Abiótico (Coluna)', value: 'abiotico-coluna' },
  { label: 'Abiótico (Superfície)', value: 'abiotico-superficie' },
];

export function FurnasTablePage() {
  // Este estado controla qual tabela está ativa na aplicação inteira
  const [tabelaAtiva, setTabelaAtiva] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu Lateral */}
      <Menu 
        tabelas={tabelasDisponiveis}
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={setTabelaAtiva} // Passamos a função para o menu poder atualizar o estado
      />

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {tabelaAtiva ? (
          // Se uma tabela está ativa, renderiza o FurnasTable
          <FurnasTable tableName={tabelaAtiva} />
        ) : (
          // Caso contrário, renderiza o placeholder
          <Placeholder />
        )}
      </main>
    </div>
  );
}

export default FurnasTablePage;