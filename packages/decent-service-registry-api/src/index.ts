import express = require('express');
import { Service, EnvConstants, DecentEnvClient } from 'decent-service-registry-client';
import { DecentEnvProvider } from './services/service-provider';
const app = express();
app.use(express.json());

const provider = new DecentEnvProvider();

app.get('/ping', (req, res) => {
  res.send({ msg: 'pong' });
});

app.get('/service/:serviceName', (req, res) => {
  const { serviceName } = req.params;
  const payload = provider.get(serviceName);
  res.send(payload);
});

app.post('/service', async (req, res) => {
  const { name, url, port, data } = req.body;
  const payload = await provider.register({ name, url, port, data });
  res.send(payload);
});

const port = EnvConstants.DECENT_ENV_PORT;

app.listen(port, async () => {
  const env = new DecentEnvClient();
  const service = await env.register({ name: 'services', port, host: EnvConstants.DECENT_ENV_HOST });
  console.log(`App listening on port ${service.port} `);
});
