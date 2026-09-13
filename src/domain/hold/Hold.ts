import type { Money } from '../money/Money.js';
import { HoldStatus } from '../enums/hold.js';

export class Hold {
  readonly id: string;
  readonly accountId: string;
  readonly amount: Money;
  readonly expiresAt: Date | null;
  readonly createdAt: Date;

  private _status: HoldStatus;

  private constructor(
    id: string,
    accountId: string,
    amount: Money,
    status: HoldStatus,
    expiresAt: Date | null,
    createdAt: Date
  ) {
    if (!id) {
      throw new Error('Hold id is required');
    }

    if (!accountId) {
      throw new Error('Hold account id is required');
    }

    if (amount.amount <= 0n) {
      throw new Error('Hold amount must be greater than zero');
    }

    this.id = id;
    this.accountId = accountId;
    this.amount = amount;
    this._status = status;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
  }

  public static create(
    id: string,
    accountId: string,
    amount: Money,
    expiresAt: Date | null = null
  ): Hold {
    return new Hold(
      id,
      accountId,
      amount,
      HoldStatus.ACTIVE,
      expiresAt,
      new Date()
    );
  }

  public static fromPersistence(
    id: string,
    accountId: string,
    amount: Money,
    status: HoldStatus,
    expiresAt: Date | null,
    createdAt: Date
  ): Hold {
    return new Hold(id, accountId, amount, status, expiresAt, createdAt);
  }

  get status(): HoldStatus {
    return this._status;
  }

  public capture(): void {
    this.ensureActive();
    this._status = HoldStatus.CAPTURED;
  }

  public release(): void {
    this.ensureActive();
    this._status = HoldStatus.RELEASED;
  }

  public expire(): void {
    this.ensureActive();
    this._status = HoldStatus.EXPIRED;
  }

  private ensureActive(): void {
    if (this._status !== HoldStatus.ACTIVE) {
      throw new Error('Only active holds can change status');
    }
  }
}
