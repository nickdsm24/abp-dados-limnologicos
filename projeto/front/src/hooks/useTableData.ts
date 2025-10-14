import { useState, useEffect } from 'react';
// 1. Imports atualizados para a nova API genérica e o tipo DatabaseName
import { fetchTableData, type DatabaseName } from '../api/api'; // Ajuste o caminho se necessário
import type { DataType, PaginacaoState } from '../types/types';

type FilterParams = Record<string, string | number>;

// 2. Hook renomeado e com o novo parâmetro 'database'
export const useTableData = (
  database: DatabaseName,
  tableName: string, 
  currentPage: number, 
  filters: FilterParams
) => {
  const [dados, setDados] = useState<DataType>([]);
  const [colunas, setColunas] = useState<string[]>([]);
  const [paginacao, setPaginacao] = useState<PaginacaoState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const stringifiedFilters = JSON.stringify(filters);

  useEffect(() => {
    // A guarda agora verifica se temos uma tabela para buscar
    if (!tableName) {
      setDados([]);
      setColunas([]);
      setPaginacao({ page: 1, limit: 10, total: 0, totalPages: 1 });
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 3. Chamada à nova função de API, passando o 'database'
        const resultado = await fetchTableData(database, tableName, currentPage, 10, filters);
        
        setDados(resultado.data || []);
        setPaginacao({
          page: resultado.page,
          limit: resultado.limit,
          total: resultado.total,
          totalPages: resultado.totalPages,
        });

        if (resultado.data && resultado.data.length > 0) {
          setColunas(Object.keys(resultado.data[0]));
        } else {
          setColunas([]);
        }

      } catch (err) {
        console.error("Falha ao buscar dados:", err); 
        setError('Não foi possível carregar os dados. Verifique a API ou tente novamente.');
        setDados([]);
        setColunas([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // 4. Parâmetro 'database' adicionado às dependências do useEffect
  }, [database, tableName, currentPage, stringifiedFilters, filters]);

  return { dados, colunas, paginacao, loading, error };
};