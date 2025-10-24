import { logger } from "../configs/logger"; // Supondo que o logger esteja acessível

/**
 * Classe de serviço para centralizar a formatação e normalização de dados
 * para as saídas da API.
 */
export class DataFormatterService {
	// ----------------------------------------------------------------
	// MÉTODOS DE NORMALIZAÇÃO DE TIPOS
	// ----------------------------------------------------------------

	/**
	 * Constrói string ISO "YYYY-MM-DD" segura a partir de ano/mês/dia.
	 * Retorna null se data inválida (ex: 31/02/2023).
	 */
	private static buildISODate(y: number, m: number, d: number): string | null {
		try {
			// Validação básica
			if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 3000) {
				return null;
			}
			const date = new Date(Date.UTC(y, m - 1, d)); // Usar UTC para evitar problemas de fuso

			// Confirma se a data não "transbordou" (ex: 31/02 virou 03/03)
			if (
				date.getUTCFullYear() === y &&
				date.getUTCMonth() === m - 1 &&
				date.getUTCDate() === d
			) {
				return date.toISOString().slice(0, 10);
			}
			return null;
		} catch (error) {
			logger.warn(`Erro ao construir data ISO: ${y}-${m}-${d}`, error);
			return null;
		}
	}

	/**
	 * Normaliza datas de strings em formatos comuns ou objetos Date para "YYYY-MM-DD".
	 *
	 * Formatos aceitos:
	 * - Objeto Date
	 * - String ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
	 * - YYYY-MM-DD
	 * - DD/MM/YYYY
	 * - MM-DD-YYYY
	 *
	 * Retorna: string no formato ISO "YYYY-MM-DD" ou null se inválido.
	 */
	public static normalizeDate(
		value: string | Date | null | undefined,
	): string | null {
		if (!value) return null;

		// 1. Se for um objeto Date
		if (value instanceof Date) {
			if (isNaN(value.getTime())) return null;
			// Usar UTC para pegar a data "pura" sem influência de fuso
			return new Date(
				Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
			)
				.toISOString()
				.slice(0, 10);
		}

		// 2. Se for string
		const trimmed = value.trim();
		if (!trimmed) return null;

		// 2a. String ISO (YYYY-MM-DDTHH... ou YYYY-MM-DD)
		const matchISO = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
		if (matchISO) {
			const [, y, m, d] = matchISO;
			// CORREÇÃO: Trocar 'this' pelo nome da classe
			return DataFormatterService.buildISODate(Number(y), Number(m), Number(d));
		}

		// 2b. DD/MM/YYYY
		const matchDMY = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
		if (matchDMY) {
			const [, d, m, y] = matchDMY;
			// CORREÇÃO: Trocar 'this' pelo nome da classe
			return DataFormatterService.buildISODate(Number(y), Number(m), Number(d));
		}

		// 2c. MM-DD-YYYY
		const matchMDY = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(trimmed);
		if (matchMDY) {
			const [, m, d, y] = matchMDY;
			// CORREÇÃO: Trocar 'this' pelo nome da classe
			return DataFormatterService.buildISODate(Number(y), Number(m), Number(d));
		}

		// 2d. Tenta parsear como último recurso
		try {
			const date = new Date(trimmed);
			if (!isNaN(date.getTime())) {
				// Recria com UTC para garantir formato YYYY-MM-DD correto
				return new Date(
					Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
				)
					.toISOString()
					.slice(0, 10);
			}
		} catch (error) {
			// Ignora falha no parse
		}

		logger.warn(`Formato de data não reconhecido: ${value}`);
		return null;
	}

	/**
	 * Normaliza números em diferentes notações locais (pt-BR).
	 * Retorna: number ou null se inválido.
	 */
	public static parseLocaleNumber(
		value: string | number | null | undefined,
	): number | null {
		if (value == null) return null;

		if (typeof value === "number") {
			return isNaN(value) ? null : value;
		}

		const trimmed = String(value).trim();
		if (!trimmed) return null;

		// Detectar padrão com vírgula decimal (pt-BR)
		// Ex: "1.234,56" ou "5,0"
		if (trimmed.includes(",")) {
			// remove separadores de milhar "." e substitui vírgula decimal "," por "."
			const normalized = trimmed.replace(/\./g, "").replace(",", ".");
			const num = Number(normalized);
			return isNaN(num) ? null : num;
		}

		// Tenta parsear direto (ex: "1234.56" ou "1234")
		const num = Number(trimmed);
		return isNaN(num) ? null : num;
	}

	// ----------------------------------------------------------------
	// MÉTODOS DE FORMATAÇÃO DE SAÍDA (Output)
	// ----------------------------------------------------------------

	/**
	 * Formata um registro para a saída de listagem (getAll).
	 * "Achata" os campos 'sitio' e 'campanha' conforme solicitado
	 * e normaliza os demais campos.
	 */
	public static formatListOutput(row: any): any {
		if (!row) return null;

		return {
			idabioticocoluna: row.idabioticocoluna,
			// CORREÇÃO: Trocar 'this' pelo nome da classe
			datamedida: DataFormatterService.normalizeDate(row.datamedida),
			horamedida: row.horamedida, // Parece já estar no formato "HH:mm:ss"

			// Normaliza os campos numéricos
			// CORREÇÃO: Trocar 'this' pelo nome da classe
			profundidade: DataFormatterService.parseLocaleNumber(row.profundidade),
			dic: DataFormatterService.parseLocaleNumber(row.dic),
			nt: DataFormatterService.parseLocaleNumber(row.nt),
			pt: DataFormatterService.parseLocaleNumber(row.pt),
			delta13c: DataFormatterService.parseLocaleNumber(row.delta13c),
			delta15n: DataFormatterService.parseLocaleNumber(row.delta15n),

			// "Achata" os campos de relacionamento para a listagem
			sitio: row.idsitio ? row.sitio_nome : undefined,
			campanha: row.idcampanha ? row.nrocampanha : undefined,
		};
	}

	/**
	 * Formata um registro para a saída de detalhe (getById).
	 * Mantém a estrutura aninhada e normaliza todos os campos.
	 * (Baseado na sua função `mapRowToAbioticoColuna`)
	 */
	public static formatDetailOutput(row: any): any {
		if (!row) return null;

		return {
			idabioticocoluna: row.idabioticocoluna,
			// CORREÇÃO: Trocar 'this' pelo nome da classe
			datamedida: DataFormatterService.normalizeDate(row.datamedida),
			horamedida: row.horamedida,
			// CORREÇÃO: Trocar 'this' pelo nome da classe
			profundidade: DataFormatterService.parseLocaleNumber(row.profundidade),
			dic: DataFormatterService.parseLocaleNumber(row.dic),
			nt: DataFormatterService.parseLocaleNumber(row.nt),
			pt: DataFormatterService.parseLocaleNumber(row.pt),
			delta13c: DataFormatterService.parseLocaleNumber(row.delta13c),
			delta15n: DataFormatterService.parseLocaleNumber(row.delta15n),

			// Objeto Aninhado para o Sítio (com normalização)
			sitio: row.idsitio
				? {
						idsitio: row.idsitio,
						nome: row.sitio_nome,
						// CORREÇÃO: Trocar 'this' pelo nome da classe
						lat: DataFormatterService.parseLocaleNumber(row.sitio_lat),
						lng: DataFormatterService.parseLocaleNumber(row.sitio_lng),
						descricao: row.sitio_descricao,
					}
				: undefined,

			// Objeto Aninhado para a Campanha (com normalização)
			campanha: row.idcampanha
				? {
						idcampanha: row.idcampanha,
						nroCampanha: row.nrocampanha,
						// CORREÇÃO: Trocar 'this' pelo nome da classe
						dataInicio: DataFormatterService.normalizeDate(
							row.campanha_datainicio,
						),
						dataFim: DataFormatterService.normalizeDate(row.campanha_datafim),
						reservatorio: row.idreservatorio
							? {
									idreservatorio: row.idreservatorio,
									nome: row.reservatorio_nome,
								}
							: undefined,
					}
				: undefined,
		};
	}
}