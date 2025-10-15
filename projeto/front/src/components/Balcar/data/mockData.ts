// --- ARQUIVO DE DADOS MOCKADOS PARA O BALCAR ---

// --- PALETA DE CORES ---

/**
 * Paleta de cores definida, mapeada para uso fácil em variáveis.
 */
export interface ColorPalette {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
}

export const colors: ColorPalette = {
  background: '#F3F7FB', // Tom de azul claro
  surface: '#FFFFFF',    // Branco
  primary: '#1777af',    // Azul Escuro
  secondary: '#FFA500',  // Laranja
};


// --- TIPOS DE DADOS DAS TABELAS ---

// 1. tbreservatorio
export interface Reservatorio {
  idreservatorio: number;
  nome: string;
  lat: number;
  lng: number;
}

// 2. tbtabelacampo
export interface TabelaCampo {
  idtabelacampo: number;
  nome: string;
  rotulo: string;
  unidade: string;
  descricao: string;
  ordem: number;
}

// 3. tbinstituicao
export interface Instituicao {
  idinstituicao: number;
  nome: string;
}

// 4. tbsitio
export interface Sitio {
  idsitio: number;
  idreservatorio: number;
  nome: string;
  lat: number;
  lng: number;
  descricao: string;
}

// 5. tbcampanha
export interface Campanha {
  idcampanha: number;
  idreservatorio: number;
  idinstituicao: number;
  nrocampanha: number;
  datainicio: string; // Usando string para data mock
  datafim: string;    // Usando string para data mock
}

// 6. tbfluxoinpe (Simplificada para os campos mais relevantes para a visualização)
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


// --- DADOS MOCKADOS ---

export const mockReservatorios: Reservatorio[] = [
  { idreservatorio: 1, nome: 'Reservatório Furnas', lat: -20.66, lng: -45.91 },
  { idreservatorio: 2, nome: 'Reservatório Itaparica', lat: -8.84, lng: -39.11 },
  { idreservatorio: 3, nome: 'Reservatório Serra da Mesa', lat: -13.91, lng: -48.33 },
];

export const mockInstituicoes: Instituicao[] = [
  { idinstituicao: 101, nome: 'INPE' },
  { idinstituicao: 102, nome: 'USP' },
  { idinstituicao: 103, nome: 'UNESP' },
];

export const mockSitios: Sitio[] = [
  { idsitio: 1001, idreservatorio: 1, nome: 'Sítio Principal 1', lat: -20.65, lng: -45.90, descricao: 'Ponto de medição central' },
  { idsitio: 1002, idreservatorio: 1, nome: 'Sítio Rio Grande', lat: -20.70, lng: -45.95, descricao: 'Próximo à afluência' },
  { idsitio: 2001, idreservatorio: 2, nome: 'Sítio Secundário 2', lat: -8.85, lng: -39.10, descricao: 'Área de remanso' },
];

export const mockCampanhas: Campanha[] = [
  { idcampanha: 1, idreservatorio: 1, idinstituicao: 101, nrocampanha: 1, datainicio: '2023-03-10', datafim: '2023-03-15' },
  { idcampanha: 2, idreservatorio: 2, idinstituicao: 102, nrocampanha: 1, datainicio: '2023-05-20', datafim: '2023-05-25' },
  { idcampanha: 3, idreservatorio: 1, idinstituicao: 101, nrocampanha: 2, datainicio: '2023-09-01', datafim: '2023-09-05' },
];

export const mockFluxoInpe: FluxoInpe[] = [
  { idfluxoinpe: 1, idsitio: 1001, idcampanha: 1, datamedida: '2023-03-11', ch4: 5.23, tempar: 25.5, odsubsuperficie: 8.1, phmeio: 7.2 },
  { idfluxoinpe: 2, idsitio: 1002, idcampanha: 1, datamedida: '2023-03-12', ch4: 6.81, tempar: 26.1, odsubsuperficie: 7.5, phmeio: 7.0 },
  { idfluxoinpe: 3, idsitio: 2001, idcampanha: 2, datamedida: '2023-05-21', ch4: 4.10, tempar: 28.9, odsubsuperficie: 9.3, phmeio: 7.5 },
];

export const mockTabelaCampo: TabelaCampo[] = [
  { idtabelacampo: 1, nome: 'ch4', rotulo: 'Gás Metano', unidade: '$mu mol/m^2/h$', descricao: 'Fluxo de metano', ordem: 10 },
  { idtabelacampo: 2, nome: 'batimetria', rotulo: 'Profundidade', unidade: 'm', descricao: 'Medida da profundidade da água', ordem: 20 },
  { idtabelacampo: 3, nome: 'tempar', rotulo: 'Temperatura do Ar', unidade: '$^{circ}C$', descricao: 'Temperatura do ar na hora da medição', ordem: 30 },
  { idtabelacampo: 4, nome: 'odsubsuperficie', rotulo: 'OD Sub-superfície', unidade: '$mg/L$', descricao: 'Oxigênio Dissolvido próximo à superfície', ordem: 40 },
];