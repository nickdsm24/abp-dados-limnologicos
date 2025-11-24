import { Request, Response, NextFunction } from "express";
import { redisClient } from "../configs/redisClient";

/**
 * Middleware de Cache
 * @param duration Tempo em segundos que o cache deve durar (TTL)
 */
export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Cria uma chave única baseada na URL da requisição
    // Ex: se a rota for /api/dados?lago=furnas, a chave será "cache:/api/dados?lago=furnas"
    const key = `cache:${req.originalUrl || req.url}`;

    try {
      // 2. Tenta buscar essa chave no Redis
      const cachedData = await redisClient.get(key);

      // --- CENÁRIO A: CACHE HIT (SUCESSO) ---
      if (cachedData) {
        // Se achou, devolve a resposta imediatamente e INTERROMPE o fluxo aqui.
        // O controller e o banco de dados nem serão chamados.
        // console.log(`⚡ Cache HIT para: ${key}`); // Descomente para debug
        return res.json(JSON.parse(cachedData));
      }

      // --- CENÁRIO B: CACHE MISS (FALHA) ---
      // Se não achou, precisamos deixar a requisição passar (next),
      // mas precisamos "interceptar" a resposta quando ela voltar do controller para salvar no Redis.

      // Guardamos a referência original da função res.json
      const originalJson = res.json;

      // Sobrescrevemos a função res.json temporariamente
      res.json = (body: any): Response => {
        // Antes de enviar a resposta ao usuário, salvamos no Redis
        // 'EX' define que expira em X segundos (duration)
        redisClient.set(key, JSON.stringify(body), "EX", duration);

        // Agora sim, enviamos a resposta original
        return originalJson.call(res, body);
      };

      // Passa a bola para o próximo passo (o Controller que vai buscar no Banco)
      next();
    } catch (err) {
      console.error("Erro no middleware de cache:", err);
      // Se o Redis falhar, não podemos parar a aplicação.
      // Simplesmente ignoramos o cache e deixamos a requisição seguir pro banco.
      next();
    }
  };
};