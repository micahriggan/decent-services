// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import * as request from "request";
import { DestinationAddressRepository } from "../repositories";
import { repository } from "@loopback/repository";
import { post, requestBody } from "@loopback/openapi-v3";
import { DestinationAddress } from "../models";
import { HttpErrors } from "@loopback/rest";
import { currencies } from "../constants/currencies";
import { InputAddressRepository } from "../repositories/input-address.repo";
import { get } from "@loopback/openapi-v3/dist8/src/decorators/operation.decorator";
import { param } from "@loopback/openapi-v3/dist8/src/decorators/parameter.decorator";
import { Filter } from "@loopback/repository/dist8/src/query";
import { InputAddress } from "../models/input-address.model";
import { ShiftAttemptRepository } from "../repositories/shift-attempt.repo";
import { ShiftAttempt } from "../models/shift-attempt.model";
import { ShapeShift } from "../services/ShapeShift";

export class DestinationAddressController {
  constructor(
    @repository(DestinationAddressRepository)
    protected destAddrRepo: DestinationAddressRepository,
    @repository(InputAddressRepository)
    protected inputAddrRepo: InputAddressRepository,
    @repository(ShiftAttemptRepository)
    protected shiftAttemptRepo: ShiftAttemptRepository
  ) {
    console.log("Started DestinationAddress");
  }

  @get("/destination/{address}")
  async getDestinationAddress(@param.path.string("address") addr: string) {
    const address = addr.toLowerCase();
    const destination = await this.destAddrRepo.findByAddress(address);
    if (!destination) {
      throw new HttpErrors.BadRequest(`Could not find address ${address}`);
    } else {
      if (!destination.inputs || destination.inputs.length === 0) {
        console.log("No inputs attached, finding them");
        destination.inputs = await this.destAddrRepo
          .inputs(destination.address)
          .find({});
      }
      return destination;
    }
  }

  @post("/destination")
  async registerDestinationAddress(
    @requestBody() destination: DestinationAddress
  ) {
    if (!destination.address || !destination.currency) {
      throw new HttpErrors.BadRequest(
        "Currency and address are required to register"
      );
    } else {
      destination.address = destination.address.toLowerCase();
      const created = await this.destAddrRepo.create(destination);
      console.log(created);
      if (destination.inputs) {
        for (let input of destination.inputs) {
          if (!input.shift_to || input.shift_to !== destination.address) {
            input.shift_to = destination.address;
          }
          await this.inputAddrRepo.create(input);
        }
      } else {
        console.log("Creating inputs");
        await this.generateAllInputs(destination);
      }
    }
  }

  async generateAllInputs(destination: DestinationAddress) {
    const generationPromises = [];
    for (let currency in currencies) {
      let inputsToCreate = new Array<ShiftAttempt>();
      if (currency !== destination.currency) {
        console.log("Generating shift for ", currency);
        const id = ShapeShift.getID(destination, currency);
        generationPromises.push(
          this.shiftAttemptRepo.create({
            inputCurrency: currency,
            outputCurrency: destination.currency,
            address: destination.address,
            status: "pending",
            id
          })
        );
      }
    }
    return generationPromises;
  }
}
