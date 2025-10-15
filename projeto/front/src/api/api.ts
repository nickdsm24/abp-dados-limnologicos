import type { ApiResponse } from '../types/types'; // Verifique o caminho dos seus tipos

// 1. (MELHORIA) Criamos um tipo para os nomes dos bancos de dados
// Isso garante que apenas os valores permitidos sejam passados para a função.
export type DatabaseName = 'furnas' | 'balcar' | 'sima';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type FilterParams = Record<string, string | number>;

/**
 * Busca dados paginados de uma tabela específica em um banco de dados.
 * @param database O nome do banco de dados ('furnas', 'balcar', ou 'sima').
 * @param tableName O nome da tabela para consultar.
 * @param page O número da página.
 * @param limit A quantidade de itens por página.
 * @param filters Um objeto com os parâmetros de filtro.
 * @returns Uma promessa que resolve com os dados da API.
 */
// 2. A função foi renomeada e agora aceita o parâmetro 'database'
export const fetchTableData = async (
  database: DatabaseName,
  tableName: string,
  page: number,
  limit: number = 10,
  filters: FilterParams = {}
): Promise<ApiResponse> => {
  
  // 3. A URL agora é construída dinamicamente com o nome do banco
  const baseUrl = `${API_BASE_URL}/api/${database}/${tableName}/all`;

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const resultado = await response.json();
  return resultado as ApiResponse;
};