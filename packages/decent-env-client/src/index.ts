import request = require('request-promise');

export type Service = {
  name: string;
  host?: string;
  url?: string;
  port?: number | string;
  data?: any;
};

export const EnvConstants = {
  web3: { url: 'http://localhost:8545' },
  DECENT_ENV_PORT: process.env.DECENT_ENV_PORT || 5555,
  DECENT_ENV_HOST: process.env.DECENT_ENV_HOST || 'http://localhost'
};

const defaultUrl = EnvConstants.DECENT_ENV_HOST + ':' + EnvConstants.DECENT_ENV_PORT;
export class DecentEnvClient {
  constructor(private url: string = defaultUrl) {}

  async register(service: Service) {
    let waiting = true;
    while (waiting) {
      try {
        console.log('waiting for service registry to come up @ ', this.url);
        const ping = await request.get(this.url + '/ping');
        waiting = false;
      } catch (e) {
        console.log('still waiting for service registry to come up @ ', this.url);
      }
    }
    const resp = await request.post(this.url + `/service`, {
      body: {
        ...service
      },
      json: true
    });
    return resp as Service;
  }

  async get(serviceName: string) {
    const resp = await request.get(this.url + `/service/${serviceName}`);
    return JSON.parse(resp) as Service;
  }
}
