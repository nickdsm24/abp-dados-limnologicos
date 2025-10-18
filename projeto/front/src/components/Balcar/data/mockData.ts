// Caso apague esse arquivo, coloque as cores nos códigos dos mapas, pois elas estão sendo utilizadas daqui

export interface ColorPalette {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
}

export const colors: ColorPalette = {
  background: '#F3F7FB',
  surface: '#FFFFFF',
  primary: '#CC5500',
  secondary: '#FF8C00',
};

export interface Reservatorio {
  idreservatorio: number;
  nome: string;
  lat: number;
  lng: number;
}

export interface TabelaCampo {
  idtabelacampo: number;
  nome: string;
  rotulo: string;
  unidade: string;
  descricao: string;
  ordem: number;
}

export interface Instituicao {
  idinstituicao: number;
  nome: string;
}

export interface Sitio {
  idsitio: number;
  idreservatorio: number;
  nome: string;
  lat: number;
  lng: number;
  descricao: string;
}

export interface Campanha {
  idcampanha: number;
  idreservatorio: number;
  idinstituicao: number;
  nrocampanha: number;
  datainicio: string;
  datafim: string;
}

export interface FluxoInpe {
  idfluxoinpe: number;
  idsitio: number;
  idcampanha: number;
  datamedida: string;
  ch4: number;
  tempar: number;
  odsubsuperficie: number;
  phmeio: number;
}