import type { ApiResponse } from '../types/furnas';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type FilterParams = Record<string, string | number>;

export const fetchFurnasData = async (
  tableName: string,
  page: number,
  limit: number = 10,
  filters: FilterParams = {}
): Promise<ApiResponse> => {
  const baseUrl = `${API_BASE_URL}/api/furnas/${tableName}/all`;

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

  // A CORREÇÃO ESTÁ AQUI 👇
  const resultado = await response.json();
  return resultado as ApiResponse;
};