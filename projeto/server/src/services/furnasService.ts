import { Request } from 'express';
import { furnasPool } from '../configs/db';
import { BaseService } from './baseService';
import { logger } from '../configs/logger';

class FurnasService extends BaseService {
    // Fornece a pool específica deste serviço
    protected pool = furnasPool;

    /**
     * Busca dados da tabela ABIOTICO SUPERFICIE
     */
    public async findAbioticoSuperficie(query: Request['query']) {
        const page = Number(query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        // ...lógica de paginação...

        // Mapeamento específico para esta consulta
        const columnMap = {
            'idsitio': 'a.idsitio',
            'idcampanha': 'a.idcampanha',
            'data_inicio': 'a.datamedida >=' // Exemplo com operador
        };

        // Usa a ferramenta da classe mãe
        const { whereClause, params } = this.buildFilter(query, columnMap);

        const baseQuery = `
            SELECT a.*, b.nrocampanha, c.nome AS sitio_nome
            FROM tbabioticosuperficie AS a
            LEFT JOIN tbcampanha AS b ON a.idcampanha = b.idcampanha
            LEFT JOIN tbsitio AS c ON a.idsitio = c.idsitio
        `;
        
        const finalQuery = `${baseQuery} ${whereClause} ORDER BY c.nome LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        const finalParams = [...params, limit, offset];
        // ... lógica para executar a query com this.pool ...
        
        try{
            logger.info('Executando query para Abiotico Superfície.');
            const result = await this.pool.query(finalQuery, finalParams);
            return result.rows;

        }   catch (error:any){
            logger.error('Erro na query Abiotico Superfície:', error);
            throw error;
        }
    }

    /**
     * Busca dados da tabela SITIOS
     */
    public async findSitios(query: Request['query']) {
        // Mapeamento específico para esta consulta

        const page = Number(query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        // ...lógica de paginação...

        const columnMap = {
            'idreservatorio': 'a.idreservatorio',
            'nome': 'a.nome' // Supondo que você possa filtrar pelo nome do sítio
        };
        
        // Usa a MESMA ferramenta da classe mãe, mas com um mapa diferente
        const { whereClause, params } = this.buildFilter(query, columnMap);

        const baseQuery = `
            SELECT a.idsitio, a.nome, a.lat, a.lng, b.nome as reservatorio_nome
            FROM tbsitio AS a
            LEFT JOIN tbreservatorio AS b ON a.idreservatorio = b.idreservatorio
        `;

        const finalQuery = `${baseQuery} ${whereClause} ORDER BY a.nome LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        const finalParams = [...params, limit, offset];
        // ... lógica para executar a query com this.pool ...

         try{
            logger.info('Executando query para Sitios.');
            const result = await this.pool.query(finalQuery, finalParams);
            return result.rows;

        }   catch (error:any){
            logger.error('Erro na query Sitios:', error);
            throw error;
        }
    }
}

// Exporta uma ÚNICA instância para toda a aplicação
export const furnasService = new FurnasService();