import { Entity, model, property, hasMany } from "@loopback/repository";

@model()
export class ShiftAttempt extends Entity {
  @property({
    type: "string",
    id: true,
    required: true
  })
  id: string;
  @property({
    type: "string",
    required: true
  })
  inputCurrency: string;

  @property({
    type: "string",
    required: true
  })
  outputCurrency: string;

  @property({
    type: "string",
    required: true
  })
  address: string;

  @property({
    type: "string"
  })
  status?: 'success' | 'in-progress' | 'pending' | 'failed';

  constructor(data?: Partial<ShiftAttempt>) {
    super(data);
  }
}
