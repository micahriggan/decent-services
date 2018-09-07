import { DefaultCrudRepository, juggler } from "@loopback/repository";
import { inject } from "@loopback/core";
import { ShiftAttempt } from "../models/shift-attempt.model";

export class ShiftAttemptRepository extends DefaultCrudRepository<
  ShiftAttempt,
  typeof ShiftAttempt.prototype.address
> {
  constructor(
    @inject("datasources.db") protected datasource: juggler.DataSource
  ) {
    super(ShiftAttempt, datasource);
  }
}
