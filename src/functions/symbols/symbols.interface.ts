export interface SymbolsQueryParams {
  /**
   * Finnhub API token
   */
  token: string;

  /**
   * Exchange to filter symbols by
   */
  exchange: string;
}

export interface Symbol {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
}
