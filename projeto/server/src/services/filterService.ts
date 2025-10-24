//src/services/filterService.ts
import { Request } from 'express';

// Interface para um mapa de colunas (Parâmetro da URL -> Coluna do Banco)
type ColumnMap = { [key: string]: string };

export interface FilterResult {
	whereClause: string; // Ex: "WHERE a.idcampanha = $1 AND c.idsitio = $2"
	params: any[]; // Ex: [10, 5]
	nextIndex: number; // Ex: 3 (o próximo índice a ser usado é $3)
}

/**
 * Serviço de utilidade estático para construir filtros SQL
 * a partir de parâmetros de requisição.
 */
export class FilterService {
	/**
	 * Constrói uma cláusula WHERE parametrizada a partir do req.query.
	 * @param query Os parâmetros da URL (req.query ou req.body.filters).
	 * @param columnMap O mapeamento de parâmetros para colunas (ex: { idcampanha: 'a.idcampanha' }).
	 * @param startIndex O índice inicial para os parâmetros (ex: 1).
	 * @returns Um objeto com a cláusula WHERE, os parâmetros e o próximo índice.
	 */
	public static buildFilter(
		query: Request['query'] | any, // Aceita 'any' para req.body.filters
		columnMap: ColumnMap,
		startIndex: number = 1,
	): FilterResult {
		const whereClauses: string[] = [];
		const params: any[] = [];
		let paramIndex = startIndex;

		for (const key in query) {
			if (columnMap[key] && query[key] != null && query[key] !== '') {
				const columnName = columnMap[key];
				// TODO: Adicionar suporte para outros operadores (LIKE, >, <) se necessário
				// Por enquanto, só suporta igualdade (=)
				whereClauses.push(`${columnName} = $${paramIndex++}`);
				params.push(query[key]);
			}
		}

		// Adicione lógicas genéricas aqui se desejar
		// ex: if (query.search) { ... }

		if (whereClauses.length === 0) {
			return { whereClause: '', params: [], nextIndex: startIndex };
		}

		return {
			whereClause: `WHERE ${whereClauses.join(' AND ')}`,
			params: params,
			nextIndex: paramIndex,
		};
	}
}