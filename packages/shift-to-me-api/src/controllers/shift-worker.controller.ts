import { currencies } from "../constants/currencies";
import { ShiftAttempt } from "../models/shift-attempt.model";
import { InputAddress } from "../models/input-address.model";
import { ShiftAttemptRepository } from "../repositories/shift-attempt.repo";
import { repository } from "@loopback/repository";
import { ShapeShift } from "../services/ShapeShift";
import { InputAddressRepository } from "../repositories/input-address.repo";
import { get } from "@loopback/openapi-v3/dist8/src/decorators/operation.decorator";

export class AttemptShiftWorker {
  constructor(
    @repository(ShiftAttemptRepository)
    protected shiftAttemptRepo: ShiftAttemptRepository,
    @repository(InputAddressRepository)
    protected inputAddrRepo: InputAddressRepository
  ) {}

  @get("/shiftattempts")
  async findAllShiftAttempts() {
    const results = await this.shiftAttemptRepo.find({});
    return results;
  }

  @get("/shiftworker/run")
  async processPendingShifts() {
    if (!this.inputAddrRepo || !this.shiftAttemptRepo) {
      throw new Error("Repository not available");
    }
    const pendingWork = await this.shiftAttemptRepo.find({
      where: { status: "pending" }
    });

    for (let pendingShift of pendingWork) {
      let inputsToCreate = new Array<InputAddress>();
      if (pendingShift.inputCurrency !== pendingShift.outputCurrency) {
        console.log("Generating shift for ", pendingShift.inputCurrency);
        try {
          pendingShift.status = "in-progress";
          await this.shiftAttemptRepo.update(pendingShift);

          const shapeShift = await ShapeShift.generateShiftAddress(
            pendingShift.address,
            pendingShift.inputCurrency,
            pendingShift.outputCurrency
          );
          console.log(shapeShift);
          if (
            shapeShift.withdrawal.toLowerCase() !==
            pendingShift.address.toLowerCase()
          ) {
            throw new Error(
              "Shapeshift withdrawal address mismatch the destination address. Confidence low, may be exploited"
            );
          }
          const inputAddress = ShapeShift.generateInputAddress(
            shapeShift,
            pendingShift.inputCurrency
          );
          await this.inputAddrRepo.create(inputAddress);
          pendingShift.status = "success";
          await this.shiftAttemptRepo.update(pendingShift);
        } catch (err) {
          pendingShift.status = "failed";
          await this.shiftAttemptRepo.update(pendingShift);
          console.error(err);
        }
      }
    }
  }
  start() {}
}
