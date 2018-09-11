import { DecentEnvClient, Service } from ".";
export class BaseClient {
  private envClient: DecentEnvClient;
  private servicePromise: Promise<Service>;
  private service: Service;

  constructor(private serviceName, envUrl?: string) {
    this.envClient = new DecentEnvClient(envUrl);
    this.servicePromise = this.envClient.get(this.serviceName);
  }

  async getUrl() {
    if (!this.service && this.servicePromise) {
      this.service = await this.servicePromise;
    }
    return this.service.url;
  }
}
