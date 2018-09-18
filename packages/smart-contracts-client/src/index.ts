import request = require('request-promise');
import { BaseClient } from 'service-registry-client';
export * from './contracts';

export type ApiContract = {
  spec: any;
  address: string;
};

export type ContractsObj = { [contractName: string]: ApiContract };

export class SmartContractsClient extends BaseClient {
  static serviceName = 'smart-contracts-api';
  constructor(url?: string) {
    super(SmartContractsClient.serviceName, url);
  }

  async getContract(contractName: string) {
    const url = await this.getUrl();
    const resp = await request.get(url + `/contracts/${contractName}`, {
      json: true
    });
    return resp as ApiContract;
  }
}
