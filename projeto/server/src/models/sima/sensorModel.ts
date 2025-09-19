import { simaPool } from "../../configs/db";
import (QueryResult) from 'pg';

export interface Sensor{
    idSensor: number;
    nome: string;
    fabricante?: string;
    modelo?: string;
    precisao?: string;
}

export const getSensorById = async (idSensor:number): Promise<Sensor | null> => {
    const query = 'SELECT * FROM tbSensor WHERE "idSensor" = $1';
    const values = [idSensor];

    try{
        const result: QueryResult<Sensor> = await simaPool.query(query, values);
        return result.rows[0] || null;
    } catch (error){
        throw new Error(`Erro ao buscar sensor: ${(error as Error).message}`);
    }
};