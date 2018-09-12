import { DecentEnvClient, Service } from '.';
export class BaseClient {
  private envClient: DecentEnvClient;
  private service: Service;

  constructor(private serviceName, envUrl?: string) {
    this.envClient = new DecentEnvClient(envUrl);
  }

  async getUrl() {
    while (!this.service) {
      console.log('Waiting for ', this.serviceName);
      this.service = await this.envClient.get(this.serviceName);
      if (!this.service) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    return this.service.url;
  }

  register(service?: Partial<Service>) {
    const srv = Object.assign({}, { name: this.serviceName }, service);
    return this.envClient.register(srv);
  }

  get(): Promise<Service> {
    return this.envClient.get(this.serviceName);
  }
}
