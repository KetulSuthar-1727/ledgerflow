import type { Money } from '../money/Money.js';
import { JournalEntryDirection } from '../enums/journal-entry.js';

export class JournalEntry {
  readonly id: string;
  readonly transactionId: string;
  readonly accountId: string;
  readonly amount: Money;
  readonly direction: JournalEntryDirection;
  readonly createdAt: Date;

  private constructor(
    id: string,
    transactionId: string,
    accountId: string,
    amount: Money,
    direction: JournalEntryDirection,
    createdAt: Date
  ) {
    if (!id) {
      throw new Error('Journal entry id is required');
    }

    if (!transactionId) {
      throw new Error('Journal entry transaction id is required');
    }

    if (!accountId) {
      throw new Error('Journal entry account id is required');
    }

    if (amount.amount <= 0n) {
      throw new Error('Journal entry amount must be greater than zero');
    }

    this.id = id;
    this.transactionId = transactionId;
    this.accountId = accountId;
    this.amount = amount;
    this.direction = direction;
    this.createdAt = createdAt;
  }

  public static create(
    id: string,
    transactionId: string,
    accountId: string,
    amount: Money,
    direction: JournalEntryDirection
  ): JournalEntry {
    return new JournalEntry(
      id,
      transactionId,
      accountId,
      amount,
      direction,
      new Date()
    );
  }

  public static fromPersistence(
    id: string,
    transactionId: string,
    accountId: string,
    amount: Money,
    direction: JournalEntryDirection,
    createdAt: Date
  ): JournalEntry {
    return new JournalEntry(
      id,
      transactionId,
      accountId,
      amount,
      direction,
      createdAt
    );
  }
}
