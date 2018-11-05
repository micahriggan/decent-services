/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import Contract, { CustomOptions, contractOptions } from "web3/eth/contract";
import { TransactionObject, BlockType } from "web3/eth/types";
import { Callback, EventLog } from "web3/types";
import { EventEmitter } from "events";
import { Provider } from "web3/providers";

export class PayToSignatureHash {
  constructor(jsonInterface: any[], address?: string, options?: CustomOptions);
  _address: string;
  options: contractOptions;
  methods: {
    balances(arg0: string | number[]): TransactionObject<string>;

    getPaymentHash(
      hash: string | number[],
      v: number | string,
      r: string | number[],
      s: string | number[]
    ): TransactionObject<string>;

    balanceOfSigHashes(
      hash: (string | number[])[],
      v: (number | string)[],
      r: (string | number[])[],
      s: (string | number[])[]
    ): TransactionObject<string>;

    payToHash(hash: string | number[]): TransactionObject<void>;

    sendTo(
      to: (string)[],
      paymentHashes: (string | number[])[],
      values: (number | string)[],
      hash: (string | number[])[],
      v: (number | string)[],
      r: (string | number[])[],
      s: (string | number[])[]
    ): TransactionObject<void>;
  };
  deploy(options: {
    data: string;
    arguments: any[];
  }): TransactionObject<Contract>;
  events: {
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
