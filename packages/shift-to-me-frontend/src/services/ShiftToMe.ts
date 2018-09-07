import * as request from 'request';

export interface InputAddress {
  address: string;
  currency: string;
}
export interface DestinationAddress {
  address: string;
  currency: string;
  inputs: InputAddress[];
}

export class ShiftToMeService {
  static async getAddressInputs(addr: string) {
    return new Promise<DestinationAddress>((resolve, reject) => {
      request.get(
        `http://www.localhost:3000/destination/${addr}`,
        (err, httpResponse, body) => {
          const json = JSON.parse(body);
          const { inputs, currency, address } = json;
          resolve({address, currency, inputs});
        }
      );
    });
  }

}
