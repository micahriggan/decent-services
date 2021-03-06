/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import Contract, { CustomOptions, contractOptions } from "web3/eth/contract";
import { TransactionObject, BlockType } from "web3/eth/types";
import { Callback, EventLog } from "web3/types";
import { EventEmitter } from "events";
import { Provider } from "web3/providers";

export class TestToken {
  constructor(jsonInterface: any[], address?: string, options?: CustomOptions);
  _address: string;
  options: contractOptions;
  methods: {
    _balances(arg0: string): TransactionObject<string>;

    balanceOf(owner: string): TransactionObject<string>;

    _allowed(arg0: string, arg1: string): TransactionObject<string>;

    allowance(owner: string, spender: string): TransactionObject<string>;

    approve(
      spender: string,
      value: number | string
    ): TransactionObject<boolean>;

    transferFrom(
      from: string,
      to: string,
      value: number | string
    ): TransactionObject<boolean>;

    increaseAllowance(
      spender: string,
      addedValue: number | string
    ): TransactionObject<boolean>;

    decreaseAllowance(
      spender: string,
      subtractedValue: number | string
    ): TransactionObject<boolean>;

    transfer(to: string, value: number | string): TransactionObject<boolean>;

    name(): TransactionObject<string>;
    totalSupply(): TransactionObject<string>;
    INITIAL_SUPPLY(): TransactionObject<string>;
    decimals(): TransactionObject<string>;
    _totalSupply(): TransactionObject<string>;
    symbol(): TransactionObject<string>;
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
