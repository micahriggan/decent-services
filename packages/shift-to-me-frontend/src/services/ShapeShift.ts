import * as request from 'request';

export interface Currency {
  name: string;
  symbol: string;
  image: string;
  imageSmall: string;
  status: string;
}

export interface MarketInfo {
  pair: string;
  min: number;
  limit: number;
  rate: number;
  minerFee: number;
}

export class ShapeShiftService {
  static loadedCoins: Currency[] = new Array<Currency>();
  static lookup: {[coin: string]: Currency} = {};
  static async getCoins() {
    return new Promise<Currency[]>((resolve, reject) => {
      request(
        'https://cors.shapeshift.io/getcoins',
        (err, httpResponse, body) => {
          if (err || !body) {
          reject({status: 'Bad shapeshift response', err, body});
          }
          const json = JSON.parse(body);
          const coins = Object.values(json) as Currency[];
          const availableCoins = coins.filter(
            coin => coin.status === 'available'
          );
          ShapeShiftService.lookup = json;
          ShapeShiftService.loadedCoins = availableCoins;
          for (let coin of coins) {
            ShapeShiftService.lookup[coin.name.toUpperCase()] = coin;
          }
          resolve(availableCoins);
        }
      );
    });
  }

  static async getMarketInfo(pair: string) {
    return new Promise<MarketInfo[]>((resolve) => {
      request(
        `https://cors.shapeshift.io/marketinfo/${pair}`,
        (err, httpResponse, body) => {
          const json = JSON.parse(body) as MarketInfo[];
          resolve(json);
        }
      );
    });
  }

static async getMarketInfoForBase(base: string) {
    return new Promise<MarketInfo[]>((resolve) => {
      request(
        `https://cors.shapeshift.io/marketinfo/`,
        (err, httpResponse, body) => {
          const json = JSON.parse(body) as MarketInfo[];
          const infoForBaseCurrency = json.filter(info => info.pair.toUpperCase().includes(base.toUpperCase()));
          resolve(infoForBaseCurrency);
        }
      );
    });
  }

  static async getImageForCurrency(currency: string, small: boolean = false) {
    if (ShapeShiftService.loadedCoins.length === 0) {
      await ShapeShiftService.getCoins();
    }
    const value = ShapeShiftService.lookup[currency.toUpperCase()] ;
    const { image = '', imageSmall = '' } = value ? value : {};
    if (small) {
      return imageSmall;
    } else {
      return image;
    }
  }

}
