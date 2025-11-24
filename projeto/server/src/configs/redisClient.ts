import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Recupera as configurações do .env
// Se estiver rodando via Docker, o host é 'redis-cache' (nome do serviço)
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD || undefined;

// Instância do cliente Redis
const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  // Configuração de retry (se cair, tenta reconectar)
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Eventos para monitoramento (Logs no console para sabermos se funcionou)
redisClient.on("connect", () => {
  console.log("🟢 Conectado ao Redis com sucesso!");
});

redisClient.on("error", (err) => {
  console.error("🔴 Erro na conexão com o Redis:", err);
});

export { redisClient };