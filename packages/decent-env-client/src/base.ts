import { DecentEnvClient, Service } from '.';
export class BaseClient {
  private envClient: DecentEnvClient;
  private service: Service;

  constructor(private serviceName, envUrl?: string) {
    this.envClient = new DecentEnvClient(envUrl);
  }

  async getUrl() {
    if (!this.service) {
      this.service = await this.envClient.get(this.serviceName);
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
