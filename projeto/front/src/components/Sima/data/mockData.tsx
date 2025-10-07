// front/src/components/Sima/data/mockDataSima.ts

import type { ColorPalette, Reservatorio } from "../../Balcar/data/mockData";

// --- TIPAGEM CUSTOMIZADA PARA SÍTIOS SIMA ---
// Adicionando um campo de dado importante para a visualização
export interface SitioSima {
    idsitio: number;
    idreservatorio: number;
    nome: string;
    lat: number;
    lng: number;
    descricao: string;
    // Campo específico para o SIMA (Requisito 3.1)
    precipitacao_24h: number; // Exemplo em mm
}

// Paleta de Cores para o projeto SIMA
export const colorsSima: ColorPalette = {
    background: '#F3F7FB',
    surface: '#FFFFFF',
    primary: '#008080', // Verde-Água/Ciano escuro para SIMA
    secondary: '#00CED1', // Ciano Médio
};

// Dados Mockados de Reservatórios SIMA (Reutilizando o tipo Reservatorio padrão)
export const mockReservatoriosSima: Reservatorio[] = [
    // Estes dados podem ser diferentes ou um subconjunto dos seus dados PostGIS
    { idreservatorio: 50, nome: 'Reservatório SIMA - Oeste', lat: -15.0, lng: -55.0 },
    { idreservatorio: 51, nome: 'Reservatório SIMA - Leste', lat: -12.0, lng: -45.0 },
];

// Dados Mockados de Sítios SIMA (Usando o tipo SitioSima)
export const mockSitiosSima: SitioSima[] = [
    { idsitio: 5001, idreservatorio: 50, nome: 'Estação de Monitoramento 1', lat: -15.1, lng: -55.1, descricao: 'Coleta de vazão e precipitação', precipitacao_24h: 35.5 },
    { idsitio: 5002, idreservatorio: 50, nome: 'Estação de Monitoramento 2', lat: -14.9, lng: -55.2, descricao: 'Sensor de nível do reservatório', precipitacao_24h: 12.0 },
    { idsitio: 5101, idreservatorio: 51, nome: 'Estação de Monitoramento 3', lat: -12.1, lng: -45.1, descricao: 'Dados ambientais em área remota', precipitacao_24h: 58.9 },
];