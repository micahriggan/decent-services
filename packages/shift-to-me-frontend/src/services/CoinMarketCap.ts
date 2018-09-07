import * as request from 'request';

export interface CoinTicker {
  'id': number;
  'name': string;
  'symbol': string;
  'website_slug': string;
  'rank': number;
  'circulating_supply': number;
  'total_supply': number;
  'max_supply': number | null;
  'quotes': {
    'USD': {
      'price': number,
        'volume_24h': number,
        'market_cap': number,
        'percent_change_1h': number,
        'percent_change_24h': number,
        'percent_change_7d': number
    }
  };
  'last_updated': number;
}

export type CoinTickerApiResponse  = {[ranking: string]: CoinTicker};

export class CoinMarketCap {
  static cache?: CoinTickerApiResponse;
  static lookup: {[coin: string]: CoinTicker};

  static async getMarket() {
    return new Promise<CoinTickerApiResponse>((resolve) => {
      request(
        'https://api.coinmarketcap.com/v2/ticker/',
        (err, httpResponse, body) => {
          const json = JSON.parse(body) as {data: CoinTickerApiResponse};
          this.setCache(json.data);
          resolve(json.data);
        }
      );
    });
  }

  static setCache(data: CoinTickerApiResponse) {
    this.cache = data;
    this.lookup = Object.values(this.cache)
      .reduce((agg, ticker) => {
        agg[ticker.symbol] = ticker;
        return agg;
      },      {});
  }

  static async getUSDPrice(symbol: string) {
    if (!this.cache) {
      await this.getMarket();
    }
    window.console.log(symbol, this.lookup);
    const ticker = this.lookup[symbol];
    if (ticker) {
      const quote = ticker.quotes.USD.price;
      return quote;
    } else {
      return -1;
    }
  }
}
