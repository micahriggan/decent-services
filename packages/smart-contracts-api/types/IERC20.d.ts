/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import Contract, { CustomOptions, contractOptions } from "web3/eth/contract";
import { TransactionObject, BlockType } from "web3/eth/types";
import { Callback, EventLog } from "web3/types";
import { EventEmitter } from "events";
import { Provider } from "web3/providers";

export class IERC20 {
  constructor(jsonInterface: any[], address?: string, options?: CustomOptions);
  _address: string;
  options: contractOptions;
  methods: {
    balanceOf(tokenOwner: string): TransactionObject<string>;

    allowance(tokenOwner: string, spender: string): TransactionObject<string>;

    transfer(to: string, tokens: number | string): TransactionObject<boolean>;

    approve(
      spender: string,
      tokens: number | string
    ): TransactionObject<boolean>;

    transferFrom(
      from: string,
      to: string,
      tokens: number | string
    ): TransactionObject<boolean>;

    totalSupply(): TransactionObject<string>;
  };
  deploy(options: {
    data: string;
    arguments: any[];
  }): TransactionObject<Contract>;
  events: {
    Transfer(
      options?: {
        filter?: object;
        fromBlock?: BlockType;
        topics?: string[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    Approval(
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