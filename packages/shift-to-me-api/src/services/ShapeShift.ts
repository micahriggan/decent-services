import * as request from "request";
import { InputAddress } from "../models/input-address.model";
import { currencies } from "../constants/currencies";
import { DestinationAddress } from "../models/destination-address.model";

export type ShapeShiftResponse = {
  deposit: string;
  depositType: string;
  withdrawal: string;
  withdrawalType: string;
  public: string;
  xrpDestTag: string;
  apiPubKey: string;
  orderId: string;
};
export type ShapeShiftErr = { error: { code: string; message: string } };

export class ShapeShift {
  static generateInputAddress(shift: ShapeShiftResponse, currency: string) {
    const inputAddress = new InputAddress();
    inputAddress.address = shift.deposit;
    inputAddress.currency = currency;
    inputAddress.shift_to = shift.withdrawal;
    inputAddress.orderId = shift.orderId;
    return inputAddress;
  }

  static async generateShiftAddress(
    outputAddress: string,
    inputCurrency: string,
    outputCurrency: string
  ): Promise<ShapeShiftResponse> {
    let shiftData = {
      url: "https://cors.shapeshift.io/shift",
      json: true,
      form: {
        withdrawal: outputAddress,
        reusable: true,
        pair: this.toPair(inputCurrency, outputCurrency),
        apiKey:
          "1f9ee3ebe9981113690c90520434cdb361bd838ddb057ef40ff0b786c00906219e0c1ca9429cb1445ccd8e8935f55661c2ad334ee34514744634e52ffb1c9e1e"
      }
    };
    return new Promise<ShapeShiftResponse>((resolve, reject) => {
      request.post(
        shiftData,
        (err, http, body: ShapeShiftResponse | ShapeShiftErr) => {
          try {
            if (err) {
              reject(err);
            } else if (typeof body === "string") {
              reject("html response, maybe rate limited");
            } else if (typeof body === "object" && "error" in body) {
              reject(body.error);
            } else {
              resolve(<ShapeShiftResponse>body);
            }
          } catch (e) {
            reject(e);
          }
        }
      );
    });
  }

  static toPair(inputCurrency: string, outputCurrency: string) {
    const currencyValues = Object.values(currencies);
    const findCurrency = (cur: string) =>
      currencyValues.find(
        currency =>
          currency.name.toLowerCase() === cur.toLowerCase() ||
          currency.symbol.toLowerCase() === cur.toLowerCase()
      );
    console.log(inputCurrency, outputCurrency);
    const input = findCurrency(inputCurrency);
    const output = findCurrency(outputCurrency);

    if (!input || !output) {
      throw new Error("both input and output currencies must exist");
    }
    return `${input.symbol}_${output.symbol}`.toLowerCase();
  }

  static getID(destination: DestinationAddress, inputCurrency: string) {
    const id = `${destination.address}_${ShapeShift.toPair(
      inputCurrency,
      destination.currency
    )}`;
    return id;
  }
}
