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
      } else {
        console.log('Service retrieved', this.service);
      }
    }
    return this.service.url;
  }

  register(service?: Partial<Service>) {
    console.log('Registering service', this.serviceName);
    const srv = Object.assign({}, { name: this.serviceName }, service);
    return this.envClient.register(srv);
  }

  get(): Promise<Service> {
    console.log('Getting service', this.service);
    return this.envClient.get(this.serviceName);
  }
}
