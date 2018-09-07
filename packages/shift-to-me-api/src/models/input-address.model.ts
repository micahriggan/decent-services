import {Entity, model, property} from '@loopback/repository';

@model()
export class InputAddress extends Entity {
  
  @property({
    type: 'string',
    required: true,
    id: true,
  })
  currency: string;
  
  @property({
    type: 'string',
    required: true,
    
  })
  address: string;

  @property({
    type: 'string',
    id: true,
    required: true,
  })
  shift_to: string;

  @property({
    type: 'string',
  })
  orderId: string;
  
  constructor(data?: Partial<InputAddress>) {
    super(data);
  }
}
