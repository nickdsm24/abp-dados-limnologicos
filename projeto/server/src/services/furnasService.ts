//import { Request } from 'express';
import { furnasPool } from '../configs/db';
import { BaseService } from './baseService';
//import { logger } from '../configs/logger';

class FurnasService extends BaseService {
    // Fornece a pool específica deste serviço
    protected pool = furnasPool;

    
}

// Exporta uma ÚNICA instância para toda a aplicação
export const furnasService = new FurnasService();