import { Request } from 'express';
import { furnasPool } from '../configs/db';
import { BaseService } from './BaseService';
import { logger } from '../configs/logger';

class FurnasService extends BaseService {
    // Fornece a pool específica deste serviço
    protected pool = furnasPool;

    /**
     * Busca dados da tabela ABIOTICO SUPERFICIE
     */
    public async findAbioticoSuperficie(query: Request['query']) {
        const page = Number(query.page) || 1;
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
        
        const finalQuery = `${baseQuery} ${whereClause} ORDER BY c.nome LIMIT ...`; // Adicionar paginação
        // ... lógica para executar a query com this.pool ...
        
        logger.info('Executando query para Abiotico Superficie');
        return { message: 'Dados de Abiotico Superficie aqui' };
    }

    /**
     * Busca dados da tabela SITIOS
     */
    public async findSitios(query: Request['query']) {
        // Mapeamento específico para esta consulta
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

        const finalQuery = `${baseQuery} ${whereClause} ORDER BY a.nome LIMIT ...`;
        // ... lógica para executar a query com this.pool ...

        logger.info('Executando query para Sitios');
        return { message: 'Dados de Sitios aqui' };
    }

    // Adicione quantos métodos mais você precisar para este banco...
    public async findCampanhas(query: Request['query']) {
        // ...
    }
}

// Exporta uma ÚNICA instância para toda a aplicação
export const furnasService = new FurnasService();