// Caso apague esse arquivo, coloque as cores nos códigos dos mapas, pois elas estão sendo utilizadas daqui

import type { ColorPalette } from "../../Balcar/data/mockData";

export interface SitioSima {
    idsitio: number;
    idreservatorio: number;
    nome: string;
    lat: number;
    lng: number;
    descricao: string;
}

export const colorsSima: ColorPalette = {
    background: '#F3F7FB',
    surface: '#FFFFFF',
    primary: '#008080',
    secondary: '#00CED1',
};