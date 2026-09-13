import type { Currency } from '../currency/Currency.js';
import {
  AccountStatus,
  AccountOwnerType,
  AccountNormalBalance,
} from '../enums/account.js';

export enum AccountType {
  USER_WALLET = 'USER_WALLET',
  MERCHANT_REVENUE = 'MERCHANT_REVENUE',
  SYSTEM_SUSPENSE = 'SYSTEM_SUSPENSE',
  SYSTEM_FEES = 'SYSTEM_FEES',
  SYSTEM_EXTERNAL_SOURCE = 'SYSTEM_EXTERNAL_SOURCE',
  SYSTEM_EXTERNAL_SINK = 'SYSTEM_EXTERNAL_SINK',
}

export class Account {
  readonly id: string;
  readonly ownerType: AccountOwnerType;
  readonly ownerId: string | null;
  readonly currency: Currency;
  readonly normalBalance: AccountNormalBalance;
  readonly createdAt: Date;

  private _type: AccountType;
  private _status: AccountStatus;
  private _updatedAt: Date;

  public static fromPersistence(
    id: string,
    ownerType: AccountOwnerType,
    ownerId: string | null,
    currency: Currency,
    type: AccountType,
    normalBalance: AccountNormalBalance,
    status: AccountStatus,
    createdAt: Date,
    updatedAt: Date
  ): Account {
    const account = new Account(
      id,
      ownerType,
      ownerId,
      currency,
      type,
      normalBalance
    );

    account._status = status;
    account._updatedAt = updatedAt;

    Object.defineProperty(account, 'createdAt', {
      value: createdAt,
      writable: false,
      configurable: false,
    });

    return account;
  }

  constructor(
    id: string,
    ownerType: AccountOwnerType,
    ownerId: string | null,
    currency: Currency,
    type: AccountType,
    normalBalance: AccountNormalBalance
  ) {
    if (!id) {
      throw new Error('Account id is required');
    }

    if (ownerType === AccountOwnerType.SYSTEM && ownerId !== null) {
      throw new Error('System accounts cannot have an owner');
    }

    if (ownerType !== AccountOwnerType.SYSTEM && ownerId === null) {
      throw new Error('Non-system accounts must have an owner');
    }

    this.id = id;
    this.ownerType = ownerType;
    this.ownerId = ownerId;
    this.currency = currency;
    this._type = type;
    this.normalBalance = normalBalance;

    this._status = AccountStatus.ACTIVE;

    this.createdAt = new Date();
    this._updatedAt = new Date();
  }

  get type(): AccountType {
    return this._type;
  }

  get status(): AccountStatus {
    return this._status;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  freeze(): void {
    if (this._status !== AccountStatus.ACTIVE) {
      throw new Error('Only active accounts can be frozen');
    }

    this._status = AccountStatus.FROZEN;
    this.touch();
  }

  unfreeze(): void {
    if (this._status !== AccountStatus.FROZEN) {
      throw new Error('Only frozen accounts can be unfrozen');
    }

    this._status = AccountStatus.ACTIVE;
    this.touch();
  }

  close(): void {
    if (this._status === AccountStatus.CLOSED) {
      throw new Error('Account is already closed');
    }

    this._status = AccountStatus.CLOSED;
    this.touch();
  }

  changeType(newType: AccountType): void {
    if (this._status === AccountStatus.CLOSED) {
      throw new Error('Closed accounts cannot change type');
    }

    this._type = newType;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
