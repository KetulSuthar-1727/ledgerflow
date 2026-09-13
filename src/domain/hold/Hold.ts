import type { Money } from '../money/Money.js';
import { HoldStatus } from '../enums/hold.js';

export class Hold {
  readonly id: string;
  readonly accountId: string;
  readonly amount: Money;
  status: HoldStatus;
  readonly createdAt: Date;

  constructor(id: string, accountId: string, amount: Money) {
    if (amount.amount <= 0n) {
      throw new Error('Hold amount must be greater than zero');
    }

    this.id = id;
    this.accountId = accountId;
    this.amount = amount;
    this.status = HoldStatus.ACTIVE;
    this.createdAt = new Date();
  }

  capture(): void {
    if (this.status !== HoldStatus.ACTIVE) {
      throw new Error('Only active holds can be captured');
    }

    this.status = HoldStatus.CAPTURED;
  }

  release(): void {
    if (this.status !== HoldStatus.ACTIVE) {
      throw new Error('Only active holds can be released');
    }

    this.status = HoldStatus.RELEASED;
  }
}
