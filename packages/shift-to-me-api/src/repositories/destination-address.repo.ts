import { DefaultCrudRepository, juggler } from "@loopback/repository";
import { DestinationAddress } from "../models";
import { inject } from "@loopback/core";
import { repository, HasManyRepositoryFactory } from "@loopback/repository";
import { InputAddress } from "../models/input-address.model";
import { InputAddressRepository } from "./input-address.repo";

export class DestinationAddressRepository extends DefaultCrudRepository<
  DestinationAddress,
  typeof DestinationAddress.prototype.address
> {
  public inputs: HasManyRepositoryFactory<
    InputAddress,
    typeof InputAddress.prototype.shift_to
  >;

  constructor(
    @inject("datasources.db") protected datasource: juggler.DataSource,
    @repository(InputAddressRepository)
    protected inputAddressRepo: InputAddressRepository
  ) {
    super(DestinationAddress, datasource);
    this.inputs = this._createHasManyRepositoryFactoryFor(
      "inputs",
      inputAddressRepo
    );
  }

  async findByAddress(addr: string) {
    const address = addr.toLowerCase();
    const query = { address };
    return this.findOne({ where: query });
  }
}
