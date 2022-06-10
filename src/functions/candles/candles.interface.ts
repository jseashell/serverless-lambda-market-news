export interface Candles {
  /**
   * List of close prices for returned candles.
   */
  c: number[];

  // List of high prices for returned candles.
  h: number[];

  // List of low prices for returned candles.
  l: number[];

  // List of open prices for returned candles.
  o: number[];

  // Status of the response
  s: 'ok' | 'no_data';

  /**
   * List of timestamp for returned candles
   */
  t: number[];

  /**
   * List of volume data for returned candles.
   */
  v: number[];
}

export interface CandlesQueryParams {
  /**
   * Finnhub API token
   */
  token: string;

  /**
   * Stock to query
   */
  symbol: string;

  /**
   * Supported resolution includes 1, 5, 15, 30, 60, D, W, M.
   * Some timeframes might not be available depending on the exchange.
   */
  resolution: string;

  /**
   * Unix timestamp representing interval initial value
   */
  from: string;

  /**
   * Unix timestamp representing interval end value
   */
  to: string;
}
