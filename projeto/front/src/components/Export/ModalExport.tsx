import { useState } from 'react';
import { X, Sheet, FileText, ChevronDown, Download, Loader2 } from 'lucide-react';
import type { DatabaseName, FilterParams } from '../../types/types'; // Ajuste o caminho

// Tipos para as opções do formulário
type ExportFormat = 'csv' | 'xlsx';
type ExportEncoding = 'utf-8' | 'iso-8859-1';
type ExportDelimiter = ',' | ';';
type ExportRange = 'page' | 'all'; // 'page' = dados atuais, 'all' = todos os dados com filtros

interface ModalExportProps {
  isOpen: boolean;
  onClose: () => void;
  // Precisamos saber O QUE exportar
  database: DatabaseName;
  tableName: string;
  currentFilters: FilterParams;
  // Passar o total de registros (para 'Todos') e o total da página (para 'Página Atual')
  totalRecords: number; 
  pageRecords: number;
}

export function ModalExport({
  isOpen,
  onClose,
  database,
  tableName,
  currentFilters,
  totalRecords,
  pageRecords
}: ModalExportProps) {
  // Estado interno do formulário
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [encoding, setEncoding] = useState<ExportEncoding>('utf-8');
  const [delimiter, setDelimiter] = useState<ExportDelimiter>(';');
  const [range, setRange] = useState<ExportRange>('all');
  const [includeHeaders, setIncludeHeaders] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) {
    return null;
  }

  // Impede que o clique no modal feche o modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // --- LÓGICA DE EXPORTAÇÃO (Simulação) ---
    // Aqui você chamaria sua API de exportação
    console.log('Iniciando exportação com:', {
      database,
      tableName,
      format,
      range,
      includeHeaders,
      filters: currentFilters,
      // Apenas adiciona opções de CSV se o formato for CSV
      ...(format === 'csv' && {
        encoding,
        delimiter,
      }),
    });

    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // TODO: Substitua a simulação por uma chamada real à sua API de exportação.
    // Ex: const blob = await api.exportData({ ... });
    //     downloadFile(blob, `export_${tableName}.${format}`);

    console.log('Exportação concluída!');
    setIsExporting(false);
    onClose(); // Fecha o modal após a exportação
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center transition-opacity duration-300"
    >
      {/* Modal Card */}
      <div
        onClick={handleModalClick}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4"
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Exportar Dados</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo (Formulário) */}
        <div className="p-6 space-y-6">
          {/* 1. Formato do Arquivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato
            </label>
            <div className="flex w-full rounded-md border border-gray-300">
              <button
                onClick={() => setFormat('xlsx')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-l-md transition-colors ${
                  format === 'xlsx'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Sheet size={16} />
                Excel (.xlsx)
              </button>
              <button
                onClick={() => setFormat('csv')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-r-md transition-colors border-l border-gray-300 ${
                  format === 'csv'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText size={16} />
                CSV (.csv)
              </button>
            </div>
          </div>

          {/* 2. Opções de CSV (Condicional) */}
          {format === 'csv' && (
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4">
              <h4 className="text-sm font-medium text-gray-600">Opções de CSV</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Delimitador */}
                <div>
                  <label htmlFor="delimiter" className="block text-sm font-medium text-gray-700 mb-1">
                    Delimitador
                  </label>
                  <SelectWrapper>
                    <select
                      id="delimiter"
                      value={delimiter}
                      onChange={(e) => setDelimiter(e.target.value as ExportDelimiter)}
                      className="select-input"
                    >
                      <option value=";">Ponto e vírgula (;)</option>
                      <option value=",">Vírgula (,)</option>
                    </select>
                  </SelectWrapper>
                  <p className="text-xs text-gray-500 mt-1">Use (;) para Excel.</p>
                </div>
                {/* Codificação */}
                <div>
                  <label htmlFor="encoding" className="block text-sm font-medium text-gray-700 mb-1">
                    Codificação
                  </label>
                  <SelectWrapper>
                    <select
                      id="encoding"
                      value={encoding}
                      onChange={(e) => setEncoding(e.target.value as ExportEncoding)}
                      className="select-input"
                    >
                      <option value="utf-8">UTF-8 (Padrão)</option>
                      <option value="iso-8859-1">ISO-8859-1 (Latin1)</option>
                    </select>
                  </SelectWrapper>
                </div>
              </div>
            </div>
          )}

          {/* 3. Intervalo de Dados */}
          <div>
            <label htmlFor="range" className="block text-sm font-medium text-gray-700 mb-1">
              Intervalo de Dados
            </label>
            <SelectWrapper>
              <select
                id="range"
                value={range}
                onChange={(e) => setRange(e.target.value as ExportRange)}
                className="select-input"
              >
                <option value="page">Página atual ({pageRecords} registros)</option>
                <option value="all">Todos os dados ({totalRecords} registros)</option>
              </select>
            </SelectWrapper>
            <p className="text-xs text-gray-500 mt-1">
              "Todos" aplica os filtros atuais a todo o banco de dados.
            </p>
          </div>

          {/* 4. Incluir Cabeçalho (Checkbox) */}
          <div className="flex items-center">
            <input
              id="includeHeaders"
              type="checkbox"
              checked={includeHeaders}
              onChange={(e) => setIncludeHeaders(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="includeHeaders" className="ml-2 block text-sm text-gray-900">
              Incluir cabeçalhos (nomes das colunas)
            </label>
          </div>
        </div>

        {/* Rodapé (Ações) */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="relative flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download size={16} />
                Exportar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Componente Wrapper para Select (Estilização) */}
      <style>{`
        .select-wrapper {
          position: relative;
        }
        .select-input {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 100%;
          padding: 0.5rem 2.5rem 0.5rem 0.75rem;
          background-color: #fff;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          line-height: 1.25;
          font-size: 0.875rem;
        }
        .select-icon {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          padding-right: 0.75rem;
          pointer-events: none;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}

// Wrapper para estilizar o <select> com um ícone
const SelectWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="select-wrapper">
    {children}
    <div className="select-icon">
      <ChevronDown size={18} />
    </div>
  </div>
);
