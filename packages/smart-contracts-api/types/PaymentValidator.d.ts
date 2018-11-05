/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import Contract, { CustomOptions, contractOptions } from "web3/eth/contract";
import { TransactionObject, BlockType } from "web3/eth/types";
import { Callback, EventLog } from "web3/types";
import { EventEmitter } from "events";
import { Provider } from "web3/providers";

export class PaymentValidator {
  constructor(jsonInterface: any[], address?: string, options?: CustomOptions);
  _address: string;
  options: contractOptions;
  methods: {
    isValidPayment(
      value: number | string,
      expiration: number | string,
      payload: string | number[],
      hash: string | number[],
      v: number | string,
      r: string | number[],
      s: string | number[]
    ): TransactionObject<boolean>;

    validatePayment(
      value: number | string,
      expiration: number | string,
      payload: string | number[],
      hash: string | number[],
      v: number | string,
      r: string | number[],
      s: string | number[]
    ): TransactionObject<boolean>;

    pay(
      expiration: number | string,
      payload: string | number[],
      hash: string | number[],
      v: number | string,
      r: string | number[],
      s: string | number[]
    ): TransactionObject<void>;

    withdraw(): TransactionObject<void>;

    setSigner(newQuoteSigner: string): TransactionObject<void>;

    setAdmin(newAdmin: string): TransactionObject<void>;

    owner(): TransactionObject<string>;
    quoteSigner(): TransactionObject<string>;
  };
  deploy(options: {
    data: string;
    arguments: any[];
  }): TransactionObject<Contract>;
  events: {
    PaymentAccepted(
      options?: {
        filter?: object;
        fromBlock?: BlockType;
        topics?: string[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    allEvents: (
      options?: {
        filter?: object;
        fromBlock?: BlockType;
        topics?: string[];
      },
      cb?: Callback<EventLog>
    ) => EventEmitter;
  };
  getPastEvents(
    event: string,
    options?: {
      filter?: object;
      fromBlock?: BlockType;
      toBlock?: BlockType;
      topics?: string[];
    },
    cb?: Callback<EventLog[]>
  ): Promise<EventLog[]>;
  setProvider(provider: Provider): void;
}