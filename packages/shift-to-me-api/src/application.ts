import { ApplicationConfig } from "@loopback/core";
import { RestApplication, RestServer, RestBindings } from "@loopback/rest";
import { MySequence } from "./sequence";

/* tslint:disable:no-unused-variable */
// Binding and Booter imports are required to infer types for BootMixin!
import { BootMixin, Booter, Binding } from "@loopback/boot";
import {
  Class,
  Repository,
  juggler,
  RepositoryMixin
} from "@loopback/repository";
/* tslint:enable:no-unused-variable */

import { DbDataSource } from "./datasources/db.datasource";
import { DestinationAddressRepository } from "./repositories/destination-address.repo";
import { InputAddressRepository } from "./repositories/input-address.repo";
import { ShiftAttemptRepository } from "./repositories/shift-attempt.repo";

export class ShifttomeApplication extends BootMixin(
  RepositoryMixin(RestApplication)
) {
  constructor(options?: ApplicationConfig) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ["controllers"],
        extensions: [".controller.js"],
        nested: true
      }
    };
  }

  setupDatasources() {
    // This will allow you to test your application without needing to
    //     // use a "real" datasource!
    const datasource =
      this.options && this.options.datasource
        ? new juggler.DataSource(this.options.datasource)
        : DbDataSource;
    this.dataSource(datasource);
  }

  async start() {
    await super.start();

    this.repository(DestinationAddressRepository);
    this.repository(InputAddressRepository);
    this.repository(ShiftAttemptRepository);
    const server = await this.getServer(RestServer);
    const port = await server.get(RestBindings.PORT);
    console.log(`Server is running at http://127.0.0.1:${port}`);
    console.log(`Try http://127.0.0.1:${port}/ping`);
  }
}
