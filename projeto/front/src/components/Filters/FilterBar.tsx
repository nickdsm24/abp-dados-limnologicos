// src/components/commons/Filters/FilterBar.tsx
import { useState, useMemo } from "react";
import {
  Plus,
  Trash,
  Search,
  X,
  Download,
  Calendar,
  Clock,
  Hash,
  Type as IconType,
  Filter, // Ícone trocado, mais relevante
} from "lucide-react";
import type { 
  FilterParams, 
  ColumnInfo, 
  ColumnType,
  DatabaseName // ✅ Importa o tipo
} from "../../types/types"; // Ajuste o caminho

// --- Definições dos Temas ---

const themes = {
  furnas: {
    wrapperBg: 'bg-blue-50',
    title: 'text-blue-900',
    subtitle: 'text-blue-700',
    primaryBg: 'bg-[#1777af]',
    primaryHover: 'hover:bg-[#136190]',
    primaryRing: 'focus:ring-[#1777af]',
    primaryBorderFocus: 'focus:border-[#1777af]',
    secondaryText: 'text-[#1777af]',
    secondaryBorder: 'border-[#1777af]',
    secondaryHover: 'hover:bg-blue-100',
    placeholderIcon: 'text-blue-500',
    placeholderText: 'text-blue-700',
  },
  balcar: {
    wrapperBg: 'bg-teal-50',
    title: 'text-teal-900',
    subtitle: 'text-teal-700',
    primaryBg: 'bg-[#006666]',
    primaryHover: 'hover:bg-[#005555]',
    primaryRing: 'focus:ring-[#006666]',
    primaryBorderFocus: 'focus:border-[#006666]',
    secondaryText: 'text-[#006666]',
    secondaryBorder: 'border-[#006666]',
    secondaryHover: 'hover:bg-teal-100',
    placeholderIcon: 'text-teal-500',
    placeholderText: 'text-teal-700',
  },
  sima: {
    wrapperBg: 'bg-gray-100',
    title: 'text-gray-800',
    subtitle: 'text-gray-600',
    primaryBg: 'bg-[#2c2c2c]',
    primaryHover: 'hover:bg-[#444444]',
    primaryRing: 'focus:ring-[#2c2c2c]',
    primaryBorderFocus: 'focus:border-[#2c2c2c]',
    secondaryText: 'text-[#2c2c2c]',
    secondaryBorder: 'border-[#2c2c2c]',
    secondaryHover: 'hover:bg-gray-200',
    placeholderIcon: 'text-gray-500',
    placeholderText: 'text-gray-600',
  }
};

// Define o tipo para o nosso objeto de tema
type ThemeType = typeof themes.furnas;
type ThemeName = keyof typeof themes;

// --- Interfaces ---

interface FilterBarProps {
  database: DatabaseName; // ✅ Prop de Tema
  tableName: string;
  onApplyFilters: (filters: FilterParams) => void;
  onClearFilters: () => void;
  onExportClick: () => void;
  colunasDisponiveis: ColumnInfo[];
}

interface FilterRow {
  id: number;
  column: string;
  type: ColumnType;
  value: string;
  valueEnd?: string;
}

let filterIdCounter = 0;
const useUniqueId = () => {
  return () => filterIdCounter++;
};

// --- Componentes Movidos (Atualizados com Tema) ---

const StyledInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode; theme: ThemeType }
> = ({ icon, className, theme, ...props }) => (
  <div className={`relative flex-1 ${className}`}>
    {icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
    )}
    <input
      {...props}
      // ✅ Foco com tema aplicado
      className={`form-input w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm 
        focus:outline-none focus:ring-2 ${theme.primaryRing} ${theme.primaryBorderFocus} 
        ${icon ? "pl-9" : ""} ${props.disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
    />
  </div>
);

interface RenderValorInputsProps {
  row: FilterRow;
  onChange: (id: number, field: "value" | "valueEnd", newValue: string) => void;
  theme: ThemeType; // ✅ Recebe o tema
}

function RenderValorInputs({ row, onChange, theme }: RenderValorInputsProps) {
  const { id, type, value, valueEnd } = row;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: newValue } = e.target;
    onChange(id, name as "value" | "valueEnd", newValue);
  };

  switch (type) {
    case "string":
      return (
        <StyledInput
          type="text"
          name="value"
          value={value}
          onChange={handleChange}
          placeholder="Valor (ex: Ponto 1)"
          icon={<IconType size={14} className="text-gray-400" />}
          theme={theme} // ✅ Passa o tema
        />
      );
    case "number":
      return (
        <>
          <StyledInput
            type="number"
            name="value"
            value={value}
            onChange={handleChange}
            placeholder="Min"
            icon={<Hash size={14} className="text-gray-400" />}
            theme={theme} // ✅ Passa o tema
          />
          <span className="text-gray-500 font-medium">-</span>
          <StyledInput
            type="number"
            name="valueEnd"
            value={valueEnd ?? ""}
            onChange={handleChange}
            placeholder="Max"
            icon={<Hash size={14} className="text-gray-400" />}
            theme={theme} // ✅ Passa o tema
          />
        </>
      );
    case "date":
      return (
        <>
          <StyledInput
            type="date"
            name="value"
            value={value}
            onChange={handleChange}
            placeholder="Data Início"
            icon={<Calendar size={14} className="text-gray-400" />}
            theme={theme} // ✅ Passa o tema
          />
          <span className="text-gray-500 text-sm">até</span>
          <StyledInput
            type="date"
            name="valueEnd"
            value={valueEnd ?? ""}
            onChange={handleChange}
            placeholder="Data Fim"
            icon={<Calendar size={14} className="text-gray-400" />}
            theme={theme} // ✅ Passa o tema
          />
        </>
      );
    case "time":
      return (
        <>
          <StyledInput
            type="time"
            name="value"
            value={value}
            onChange={handleChange}
            placeholder="Hora Início"
            icon={<Clock size={14} className="text-gray-400" />}
            theme={theme} // ✅ Passa o tema
          />
          <span className="text-gray-500 text-sm">até</span>
          <StyledInput
            type="time"
            name="valueEnd"
            value={valueEnd ?? ""}
            onChange={handleChange}
            placeholder="Hora Fim"
            icon={<Clock size={14} className="text-gray-400" />}
            theme={theme} // ✅ Passa o tema
          />
        </>
      );
    default:
      return <StyledInput type="text" placeholder="Selecione uma coluna..." disabled theme={theme} />;
  }
}

// --- Sub-componentes Didáticos (Atualizados com Tema) ---

// 1. Cabeçalho da Barra de Filtro
interface FilterBarHeaderProps {
  tableName: string;
  onExportClick: () => void;
  onAddFilterRow: () => void;
  theme: ThemeType; // ✅ Recebe o tema
}

function FilterBarHeader({ tableName, onExportClick, onAddFilterRow, theme }: FilterBarHeaderProps) {
  // Formata o nome da tabela (ex: "abiotico-coluna" -> "Abiotico Coluna")
  const friendlyTableName = tableName.replace(/-/g, " ");

  return (
    <header className="flex flex-wrap justify-between items-center gap-4 mb-4">
      {/* Título e Subtítulo (com destaque maior para o nome) */}
      <div>
        <h3 className={`text-xl font-bold capitalize ${theme.title}`}>
          {friendlyTableName}
        </h3>
        <p className={`text-sm font-medium ${theme.subtitle}`}>Painel de Filtros</p>
      </div>

      {/* Botões de Ação Principais (com tema) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExportClick}
          className={`flex items-center py-2 px-4 text-sm font-medium ${theme.secondaryText} bg-white 
          border ${theme.secondaryBorder} rounded-lg shadow-sm 
          transition-all transform hover:scale-105 ${theme.secondaryHover} 
          focus:outline-none focus:ring-2 ${theme.primaryRing} focus:ring-opacity-50`}
        >
          <Download size={16} className="mr-1.5" />
          Exportar Dados
        </button>
        <button
          onClick={onAddFilterRow}
          className={`flex items-center py-2 px-4 text-sm font-medium text-white ${theme.primaryBg} rounded-lg shadow-sm 
          transition-all transform hover:scale-105 ${theme.primaryHover} 
          focus:outline-none focus:ring-2 ${theme.primaryRing} focus:ring-opacity-50`}
        >
          <Plus size={18} className="mr-1" />
          Adicionar Filtro
        </button>
      </div>
    </header>
  );
}

// 2. Item da Lista de Filtros (Uma Linha)
interface FilterRowItemProps {
  row: FilterRow;
  colunasDisponiveis: ColumnInfo[];
  onColumnChange: (id: number, value: string) => void;
  onValueChange: (id: number, field: "value" | "valueEnd", value: string) => void;
  onRemoveRow: (id: number) => void;
  theme: ThemeType; // ✅ Recebe o tema
}

function FilterRowItem({
  row,
  colunasDisponiveis,
  onColumnChange,
  onValueChange,
  onRemoveRow,
  theme, // ✅ Usa o tema
}: FilterRowItemProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Seletor de Coluna */}
      <select
        value={row.column}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onColumnChange(row.id, e.target.value)
        }
        // ✅ Foco com tema aplicado
        className={`form-select flex-1 min-w-[200px] px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm 
        focus:outline-none focus:ring-2 ${theme.primaryRing} ${theme.primaryBorderFocus}`}
      >
        <option value="" disabled>
          Selecione uma coluna...
        </option>
        {colunasDisponiveis.map((col) => (
          <option key={col.name} value={col.name}>
            {col.name.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Inputs de Valor (Min/Max, Texto, etc.) */}
      <RenderValorInputs row={row} onChange={onValueChange} theme={theme} />

      {/* Botão de Remover Linha */}
      <button
        onClick={() => onRemoveRow(row.id)}
        className="p-2 text-red-500 rounded-full 
        transition-all transform hover:scale-110 hover:bg-red-100"
        aria-label="Remover filtro"
      >
        <Trash size={18} />
      </button>
    </div>
  );
}

// 3. Ações da Barra de Filtro (Aplicar/Limpar)
interface FilterBarActionsProps {
  onApply: () => void;
  onClear: () => void;
  theme: ThemeType; // ✅ Recebe o tema
}

function FilterBarActions({ onApply, onClear, theme }: FilterBarActionsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onApply}
        // ✅ Botão primário com tema
        className={`flex items-center py-2 px-4 text-sm font-medium text-white ${theme.primaryBg} rounded-lg shadow-md 
        transition-all transform hover:scale-105 ${theme.primaryHover} 
        focus:outline-none focus:ring-2 ${theme.primaryRing} focus:ring-opacity-50`}
      >
        <Search size={16} className="mr-1.5" />
        Aplicar Filtros
      </button>
      <button
        onClick={onClear}
        className={`flex items-center py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md 
        transition-all transform hover:scale-105 hover:bg-gray-50 
        focus:outline-none focus:ring-2 ${theme.primaryRing} focus:ring-opacity-50`}
      >
        <X size={16} className="mr-1.5" />
        Limpar
      </button>
    </div>
  );
}

// --- Componente Principal (Agora com Tema) ---

export function FilterBar({
  database, // ✅ Prop de tema recebida
  tableName,
  onApplyFilters,
  onClearFilters,
  onExportClick,
  colunasDisponiveis,
}: FilterBarProps) {
  const [filterRows, setFilterRows] = useState<FilterRow[]>([]);
  const getNextId = useUniqueId();

  // ✅ Seleciona o tema com base na prop
  const theme = useMemo(() => {
    const themeName = database as ThemeName;
    return themes[themeName] || themes.furnas; // 'furnas' como padrão
  }, [database]);

  // --- Lógica de Handlers (Estado fica aqui) ---
  // (Nenhuma mudança na lógica, apenas na renderização)

  const addFilterRow = () => {
    setFilterRows([
      ...filterRows,
      { id: getNextId(), column: "", type: "unknown", value: "", valueEnd: "" },
    ]);
  };

  const removeFilterRow = (id: number) => {
    setFilterRows(filterRows.filter((row) => row.id !== id));
  };

  const handleColumnChange = (id: number, selectedColumn: string) => {
    const colInfo = colunasDisponiveis.find((c) => c.name === selectedColumn);
    const newType = colInfo?.type || "unknown";
    setFilterRows(
      filterRows.map((row) =>
        row.id === id
          ? { ...row, column: selectedColumn, type: newType, value: "", valueEnd: "" }
          : row,
      ),
    );
  };

  const handleValueChange = (id: number, field: "value" | "valueEnd", newValue: string) => {
    setFilterRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, [field]: newValue } : row)),
    );
  };

  const handleApply = () => {
    const formattedFilters = filterRows.reduce((acc: FilterParams, row) => {
      if (!row.column || row.type === "unknown") return acc;
      if (row.type === "string") {
        if (row.value) acc[row.column] = row.value;
      } else if (row.type === "number" || row.type === "date" || row.type === "time") {
        if (row.value) acc[`${row.column}_gte`] = row.value;
        if (row.valueEnd) acc[`${row.column}_lte`] = row.valueEnd;
      }
      return acc;
    }, {});
    onApplyFilters(formattedFilters);
  };

  const handleClear = () => {
    setFilterRows([]);
    onClearFilters();
  }; 

  // --- Renderização Didática (com Tema) ---

  return (
    // ✅ Fundo do wrapper com tema
    <div className={`p-5 ${theme.wrapperBg} border-b border-gray-200 shadow-lg font-sans`}>
      
      {/* 1. Renderiza o Cabeçalho (passando o tema) */}
      <FilterBarHeader
        tableName={tableName}
        onExportClick={onExportClick}
        onAddFilterRow={addFilterRow}
        theme={theme} // ✅
      />
      
      {/* 2. Renderiza a Lista de Filtros */}
      <section className="space-y-3">
        {filterRows.length === 0 && ( 
          // ✅ Placeholder "Sem box pontilhado", agora é limpo e com tema
          <div className="text-center p-4 rounded-lg">
            <Filter size={18} className={`mx-auto ${theme.placeholderIcon} mb-2`} />
            <p className={`font-medium ${theme.placeholderText}`}>Nenhum filtro aplicado</p>
            <p className={`text-sm ${theme.placeholderText} opacity-80`}>
              Clique em "Adicionar Filtro" acima para começar a refinar seus dados.
            </p>
          </div>
        )}
        
        {/* Mapeia cada linha de filtro para seu componente */}
        {filterRows.map((row) => (
          <FilterRowItem
            key={row.id}
            row={row}
            colunasDisponiveis={colunasDisponiveis}
            onColumnChange={handleColumnChange}
            onValueChange={handleValueChange}
            onRemoveRow={removeFilterRow}
            theme={theme} // ✅ Passa o tema
          />
        ))}
      </section>
      
      {/* 3. Renderiza as Ações (Aplicar/Limpar) se houver filtros */}
      {filterRows.length > 0 && (
        <footer className="mt-4">
          <FilterBarActions 
            onApply={handleApply} 
            onClear={handleClear} 
            theme={theme} // ✅ Passa o tema
          />
        </footer>
      )}
    </div>
  );
}