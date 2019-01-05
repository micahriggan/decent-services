import portFinder = require('portfinder');
import { Service } from 'service-registry-client';
const DecentServices: { [serviceName: string]: Service } = {};

export class DecentEnvProvider {
  async register(service: Service) {
    const { name, data, host, url, port } = service;
    let usePort = port;
    let useHost = host;
    let useUrl = url;
    if (!url) {
      usePort = usePort || (await portFinder.getPortPromise());
      useHost = useHost || 'http://localhost';
      useUrl = useUrl || useHost + ':' + usePort;
    }
    DecentServices[name] = {
      name,
      data,
      url: useUrl,
      host: useHost,
      port: usePort
    };
    console.log(name, 'registered at ', useUrl);
    return DecentServices[name];
  }

  get(serviceName) {
    return DecentServices[serviceName];
  }

  all() {
    return DecentServices;
  }
}
