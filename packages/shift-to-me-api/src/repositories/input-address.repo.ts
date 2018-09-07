import { DefaultCrudRepository, juggler } from "@loopback/repository";
import { inject } from "@loopback/core";
import { InputAddress } from "../models/input-address.model";

export class InputAddressRepository extends DefaultCrudRepository<
  InputAddress,
  typeof InputAddress.prototype.address
> {
  constructor(
    @inject("datasources.db") protected datasource: juggler.DataSource
  ) {
    super(InputAddress, datasource);
  }
}
