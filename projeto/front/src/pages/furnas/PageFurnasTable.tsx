import { useState } from 'react';
import { Menu } from '../../components/commons/TableMenu';
import DataTable from '../../components/commons/DataTable';
import { Placeholder } from '../../components/commons/TablePlaceholder';

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
  // Este estado controla qual tabela está ativa na aplicação inteira
  const [tabelaAtiva, setTabelaAtiva] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu Lateral */}
      <Menu 
        tabelas={tabelasDisponiveis}
        tabelaAtiva={tabelaAtiva}
        onSelectTabela={setTabelaAtiva}
      />

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {tabelaAtiva ? (
          // Se uma tabela está ativa, renderiza o DataTable,
          // informando a ele QUAL BANCO e QUAL TABELA usar.
          <DataTable 
            database="furnas" 
            tableName={tabelaAtiva} 
          />
        ) : (
          // Caso contrário, renderiza o placeholder
          <Placeholder />
        )}
      </main>
    </div>
  );
}

export default FurnasTablePage;