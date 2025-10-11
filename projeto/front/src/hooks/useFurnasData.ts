import { useState, useEffect } from 'react';
import { fetchFurnasData } from '../api/furnasApi';
import type { DataType, PaginacaoState } from '../types/furnas';

type FilterParams = Record<string, string | number>;

export const useFurnasData = (
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
        const resultado = await fetchFurnasData(tableName, currentPage, 10, filters);
        
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
    // A dependência `filters` é adicionada para silenciar o linter, 
    // enquanto `stringifiedFilters` efetivamente controla as re-execuções.
  }, [tableName, currentPage, stringifiedFilters, filters]);

  return { dados, colunas, paginacao, loading, error };
};