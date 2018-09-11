import request = require('request-promise');

export type Service = {
  name: string;
  url: string;
  port?: number;
  data: any;
};

export const EnvConstants = {
  web3: { url: 'http://localhost:8545' }
};

export class DecentEnvClient {
  constructor(private decentEnvApiUrl: string) {}

  async register(service: Service) {
    const resp = await request.post(this.decentEnvApiUrl + `/service`, {
      body: {
        ...service
      },
      json: true
    });
    return JSON.parse(resp) as Service;
  }

  async get(serviceName: string) {
    const resp = await request.get(this.decentEnvApiUrl + `/service/${serviceName}`);
    return JSON.parse(resp) as Service;
  }
}
