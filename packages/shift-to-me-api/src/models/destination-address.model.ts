import { Entity, model, property, hasMany } from "@loopback/repository";
import { InputAddress } from "./input-address.model";

@model()
export class DestinationAddress extends Entity {
  @property({
    type: "string",
    required: true
  })
  currency: string;

  @property({
    type: "string",
    id: true,
    required: true
  })
  address: string;

  @property({
    type: "string"
  })
  user?: string;

  @hasMany(InputAddress, { keyTo: "shift_to" })
  inputs?: InputAddress[];

  constructor(data?: Partial<DestinationAddress>) {
    super(data);
  }
}
