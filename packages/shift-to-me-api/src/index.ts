import {ShifttomeApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {ShifttomeApplication};

export async function main(options?: ApplicationConfig) {
  const app = new ShifttomeApplication(options);
  await app.boot();
  await app.start();
  return app;
}
