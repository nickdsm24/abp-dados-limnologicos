// src/components/commons/FilterBar.tsx
import { useState } from 'react';
import { Plus, Trash, Search, X } from 'lucide-react';
// 1. Importar o tipo que define os filtros
import type { FilterParams } from '../../types/types'; // Ajuste o caminho se necessário

// 2. Definir a interface para as props do componente
interface FilterBarProps {
  onApplyFilters: (filters: FilterParams) => void;
  onClearFilters: () => void;
}

// 3. Definir a interface para uma única linha de filtro no estado local
interface FilterRow {
  id: number;
  column: string;
  value: string; // O valor do input é sempre string
}

// Hook para gerar IDs únicos
let filterIdCounter = 0;
const useUniqueId = () => {
  return () => filterIdCounter++;
};

export function FilterBar({ onApplyFilters, onClearFilters }: FilterBarProps) {
  // 4. Tipar o estado
  const [filterRows, setFilterRows] = useState<FilterRow[]>([]);
  const getNextId = useUniqueId();

  const addFilterRow = () => {
    setFilterRows([...filterRows, { id: getNextId(), column: '', value: '' }]);
  };

  // 5. Tipar os argumentos das funções
  const removeFilterRow = (id: number) => {
    setFilterRows(filterRows.filter((row) => row.id !== id));
  };

  const updateFilterRow = (id: number, field: 'column' | 'value', newValue: string) => {
    setFilterRows(
      filterRows.map((row) =>
        row.id === id ? { ...row, [field]: newValue } : row
      )
    );
  };

  const handleApply = () => {
    // 6. Tipar o acumulador do reduce
    const formattedFilters = filterRows.reduce((acc: FilterParams, row) => {
      // Só inclui filtros que tenham coluna e valor preenchidos
      if (row.column && row.value) {
        // O tipo FilterParams aceita string | number.
        // O valor do input (string) é compatível.
        acc[row.column] = row.value;
      }
      return acc;
    }, {});
    
    onApplyFilters(formattedFilters);
  };

  const handleClear = () => {
    setFilterRows([]);
    onClearFilters();
  };

  return (
    <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-700">Filtros</h3>
        <button
          onClick={addFilterRow}
          className="flex items-center px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <Plus size={16} className="mr-1" />
          Adicionar Filtro
        </button>
      </div>

      <div className="space-y-3">
        {filterRows.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum filtro aplicado.</p>
        )}

        {filterRows.map((row) => (
          <div key={row.id} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nome da Coluna (ex: sitio)"
              value={row.column}
              // 7. Tipar o evento onChange
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilterRow(row.id, 'column', e.target.value)
              }
              className="form-input flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500">=</span>
            <input
              type="text"
              placeholder="Valor (ex: Ponto 1)"
              value={row.value}
              // 7. Tipar o evento onChange
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilterRow(row.id, 'value', e.target.value)
              }
              className="form-input flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => removeFilterRow(row.id)}
              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
              aria-label="Remover filtro"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      {filterRows.length > 0 && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleApply}
            className="flex items-center px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <Search size={16} className="mr-1" />
            Aplicar
          </button>
          <button
            onClick={handleClear}
            className="flex items-center px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            <X size={16} className="mr-1" />
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
}