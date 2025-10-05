import { Request } from 'express';

// Interface para um mapa de colunas (Parâmetro da URL -> Coluna do Banco)
type ColumnMap = { [key: string]: string };

export interface FilterResult {
    whereClause: string;
    params: any[];
}

export abstract class BaseService {
    // A pool de conexão que será fornecida pela classe filha
    protected abstract pool: any;

    /**
     * Ferramenta protegida para construir filtros. As classes filhas chamarão este método.
     * @param query Os parâmetros da URL (req.query).
     * @param columnMap O mapeamento de parâmetros para colunas, específico para a consulta.
     * @returns Um objeto com a cláusula WHERE e os parâmetros.
     */
    protected buildFilter(query: Request['query'], columnMap: ColumnMap): FilterResult {
        const whereClauses: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        for (const key in query) {
            if (columnMap[key]) {
                const columnName = columnMap[key];
                whereClauses.push(`${columnName} = $${paramIndex++}`);
                params.push(query[key]);
            }
        }
        
        // Você pode adicionar lógicas genéricas aqui também se quiser
        // ex: if (query.search) { ... }

        if (whereClauses.length === 0) {
            return { whereClause: '', params: [] };
        }

        return {
            whereClause: `WHERE ${whereClauses.join(' AND ')}`,
            params: params
        };
    }
}