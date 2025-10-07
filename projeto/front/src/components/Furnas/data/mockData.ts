// front/src/components/Furnas/data/mockDataFurnas.ts

// Reimportar os tipos do arquivo Balcar para manter a consistência
import type { ColorPalette, Reservatorio, Sitio } from "../../Balcar/data/mockData";

// Paleta de Cores (Pode ser igual ou adaptada para o projeto Furnas)
export const colorsFurnas: ColorPalette = {
    background: '#F3F7FB',
    surface: '#FFFFFF',
    primary: '#CC5500', // Um tom de laranja mais terroso para Furnas
    secondary: '#FF8C00', // Laranja mais forte
};

// Dados Mockados para o projeto FURNAS
export const mockReservatoriosFurnas: Reservatorio[] = [
    // Reservatório Furnas (coordenadas reais)
    { idreservatorio: 1, nome: 'Reservatório Furnas', lat: -20.6704, lng: -46.3173 }, 
    // Outros Reservatórios na área de influência
    { idreservatorio: 10, nome: 'Itumbiara', lat: -18.4073, lng: -49.0980 },
    { idreservatorio: 11, nome: 'Mascarenhas de Moraes', lat: -20.2863, lng: -47.0644 },
];

export const mockSitiosFurnas: Sitio[] = [
    { idsitio: 1, idreservatorio: 1, nome: 'Sítio Furnas P1 - Centro', lat: -20.65, lng: -46.30, descricao: 'Ponto de coleta profundo' },
    { idsitio: 2, idreservatorio: 1, nome: 'Sítio Furnas P2 - Afluente', lat: -20.55, lng: -46.20, descricao: 'Próximo ao rio afluente' },
    { idsitio: 3, idreservatorio: 10, nome: 'Sítio Itumbiara S1', lat: -18.42, lng: -49.11, descricao: 'Ponto de referência' },
];