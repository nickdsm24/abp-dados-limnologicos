import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

// Configuração para rodar dentro de container Docker
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // plugin do Tailwind para Vite
  ],
  server: {
    host: true, // permite acesso externo (ex: http://localhost:5173)
    port: 5173, // porta padrão Vite
    strictPort: true, // falha caso a porta já esteja em uso
    watch: {
      usePolling: true, // garante hot reload no bind mount
    },
  },
  preview: {
    host: true,
    port: 5173,
  },
});