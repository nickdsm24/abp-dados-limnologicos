/**
 * Representa os tipos de dados primitivos que uma célula da tabela pode conter.
 * Isso substitui o `any` por uma união de tipos específicos e seguros.
 */
export type CellValue = string | number | boolean | null;

// Interface para o objeto de paginação
export interface PaginacaoState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * O tipo do nosso dado.
 * Cada item do array é um objeto (linha da tabela) onde as chaves são os nomes
 * das colunas (string) e os valores são do tipo CellValue.
 */
export type DataType = Record<string, CellValue>[];

// Interface para a resposta completa da API
export interface ApiResponse {
  data: DataType;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}