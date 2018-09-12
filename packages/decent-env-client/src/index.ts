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

  private async ensureConnected() {
    const timerDone = (timer, cb) => {
      clearInterval(timer);
      cb();
    };
    const ping = () => {
      return request.get(this.url + '/ping');
    };
    await new Promise(async resolve => {
      const timer = setInterval(async () => {
        try {
          await ping();
          timerDone(timer, resolve);
        } catch (e) {
          console.log('waiting for service registry to come up @ ', this.url);
        }
      }, 1000);
    });
  }

  async register(service: Service) {
    await this.ensureConnected();
    const resp = await request.post(this.url + `/service`, {
      body: {
        ...service
      },
      json: true
    });
    return resp as Service;
  }

  async get(serviceName: string) {
    await this.ensureConnected();
    const resp = await request.get(this.url + `/service/${serviceName}`, { json: true });
    return resp as Service;
  }
}
export * from './base';
