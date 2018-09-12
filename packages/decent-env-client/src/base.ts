import { DecentEnvClient, Service } from '.';
export class BaseClient {
  private envClient: DecentEnvClient;
  private service: Service;

  constructor(private serviceName, envUrl?: string) {
    this.envClient = new DecentEnvClient(envUrl);
  }

  async getUrl() {
    const fetch = async () => {
      return this.envClient.get(this.serviceName);
    };
    this.service = await fetch();
    const timerDone = (timer, cb) => {
      if (!this.service) {
        console.log('Waiting for ', this.serviceName);
      } else {
        clearInterval(timer);
        cb(this.service.url);
      }
    };
    return new Promise(resolve => {
      const timer = setInterval(async () => {
        await fetch();
        timerDone(timer, resolve);
      }, 1000);
      timerDone(timer, resolve);
    });
  }

  register(service?: Partial<Service>) {
    const srv = Object.assign({}, { name: this.serviceName }, service);
    return this.envClient.register(srv);
  }

  get(): Promise<Service> {
    return this.envClient.get(this.serviceName);
  }
}
