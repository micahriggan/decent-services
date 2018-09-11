import portFinder = require('portfinder');
import express = require('express');
import { Service } from 'decent-env-client';
const app = express();

const DecentServices: { [serviceName: string]: Service } = {};

export class DecentEnvProvider {
  async register(service: Service) {
    const { name, data, url, port } = service;
    const usePort = port || (await portFinder.getPortPromise());
    DecentServices[name] = {
      name,
      data,
      url,
      port: usePort
    };
    return DecentServices[name];
  }

  get(serviceName) {
    return DecentServices[serviceName];
  }
}
const provider = new DecentEnvProvider();

app.get('/ping', (req, res) => {
  res.send('pong');
});
app.get('/service/:serviceName', (req, res) => {
  const { serviceName } = req.params;
  provider.get(serviceName);
});
app.post('/service', (req, res) => {
  const { name, url, port, data } = req.body;
  provider.register({ name, url, port, data });
});

const port = process.env.DECENT_ENV_PORT || 5555;
app.listen(port, () => {
  console.log('service registry started on port', port);
});
